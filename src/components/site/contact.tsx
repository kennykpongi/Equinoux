"use client";

/**
 * Contact — a designed destination, not a form page.
 *
 * There is no server to post to, so the form composes a pre-filled message and
 * hands it to the visitor's mail client. That's stated in the UI rather than
 * implied, and the direct address sits alongside it for anyone who'd rather
 * skip the form. Validation runs in the component (not just via the browser's
 * default bubbles) so errors are announced and tied to their fields.
 *
 * Spam: the form never posts anywhere, and a hidden honeypot short-circuits
 * automated submissions that fill every field they find.
 */

import { useId, useState, type FormEvent } from "react";
import { BRAND } from "./content";
import { Container, LabelRow, Roll, Section } from "./layout";
import { Reveal, ArrowUpRight } from "./primitives";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const uid = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!EMAIL_RE.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10) next.message = "A sentence or two about the project helps.";
    return next;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (values.company) return; // honeypot tripped
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = encodeURIComponent(`Project enquiry from ${values.name.trim()}`);
    const body = encodeURIComponent(`Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`);
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const fields = [
    { key: "name" as const, label: "Name", type: "text", autoComplete: "name" },
    { key: "email" as const, label: "Email", type: "email", autoComplete: "email" },
  ];

  return (
    <Section id="contact" tone="ink" top="2xl" bottom="2xl">
      <Container>
        <Reveal>
          <h2 className="t-display">Let&rsquo;s build what matters next.</h2>
        </Reveal>

        <div
          className="mt-[var(--space-xl)] grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "var(--space-lg)" }}
        >
          {/* Direct lines */}
          <Reveal className="flex flex-col gap-[var(--space-sm)]">
            <LabelRow label="Direct">
              <ul>
                {[
                  { label: BRAND.email, href: `mailto:${BRAND.email}` },
                  { label: BRAND.phone, href: BRAND.phoneHref },
                  { label: "WhatsApp", href: BRAND.whatsapp, ext: true },
                ].map((l) => (
                  <li key={l.label} className="border-t" style={{ borderColor: "var(--line-inverse)" }}>
                    <a
                      href={l.href}
                      target={l.ext ? "_blank" : undefined}
                      rel={l.ext ? "noopener noreferrer" : undefined}
                      className="t-sub flex items-center justify-between gap-4 py-4"
                    >
                      <Roll>{l.label}</Roll>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </a>
                  </li>
                ))}
                <li className="border-t" style={{ borderColor: "var(--line-inverse)" }} />
              </ul>
            </LabelRow>

            <LabelRow label="Studio">
              <p className="t-meta" style={{ color: "var(--ink-inverse)" }}>
                {BRAND.name} Studio
                <br />
                {BRAND.location}
              </p>
            </LabelRow>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <p className="t-statement max-w-[18ch]">Start a project.</p>

            <form onSubmit={submit} noValidate className="mt-[var(--space-md)] flex flex-col gap-8">
              {fields.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`${uid}-${f.key}`} className="t-meta block" style={{ color: "var(--ink-inverse)" }}>
                    {f.label}
                  </label>
                  <input
                    id={`${uid}-${f.key}`}
                    name={f.key}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    value={values[f.key]}
                    onChange={set(f.key)}
                    aria-invalid={Boolean(errors[f.key])}
                    aria-describedby={errors[f.key] ? `${uid}-${f.key}-error` : undefined}
                    className="mt-2 w-full bg-transparent pb-3 text-lg outline-none focus-visible:border-b-[color:var(--paper)]"
                    style={{ borderBottom: `1px solid ${errors[f.key] ? "var(--paper)" : "var(--line-inverse)"}` }}
                  />
                  {errors[f.key] && (
                    <p id={`${uid}-${f.key}-error`} className="t-meta mt-2" style={{ color: "var(--paper)" }}>
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor={`${uid}-message`} className="t-meta block" style={{ color: "var(--ink-inverse)" }}>
                  Project
                </label>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                  className="mt-2 w-full resize-none bg-transparent pb-3 text-lg outline-none"
                  style={{ borderBottom: `1px solid ${errors.message ? "var(--paper)" : "var(--line-inverse)"}` }}
                />
                {errors.message && (
                  <p id={`${uid}-message-error`} className="t-meta mt-2" style={{ color: "var(--paper)" }}>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <label htmlFor={`${uid}-company`}>Company</label>
                <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  className="t-meta inline-flex items-center gap-3 px-7 py-4 font-medium transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--paper)", color: "var(--ink)" }}
                >
                  Send enquiry
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <p className="t-meta" style={{ color: "var(--ink-inverse)" }} aria-live="polite">
                  {sent ? "Opening your mail app. Press send to finish." : "Opens in your mail app."}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
