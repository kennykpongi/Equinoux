EQUINOUX — About page hero media
================================

Drop images in THIS folder and they appear in the About page's cursor-media
plate automatically. No code change needed.

    ebcom-app/public/site/about/

The folder is read at build time, so after adding or removing files you just
need to redeploy (or restart `npm run dev` locally) for the change to show.


ORDER
-----
Files play in filename order, so number them:

    01-studio.jpg
    02-workshop.jpg
    03-detail.jpg
    ...

The plate cross-fades between them. With a single image it simply sits still.


WHAT WORKS
----------
Accepted extensions:  .jpg  .jpeg  .png  .webp  .avif
Ignored:              anything else, and any file starting with "." or "_"

The README you are reading is ignored too (it is not an image extension).


IMAGE SPECS
-----------
Shape       Square. The plate is a 1:1 frame and crops with object-cover, so
            anything non-square loses its edges. Crop to square first if the
            subject matters.

Size        1280 x 1280 px is plenty. The plate renders at 640px at most, so
            1280 covers retina with room to spare. Larger is wasted bytes.

Weight      Aim for under 300 KB each. The existing files in public/site are
            160-250 KB at 1122 x 1402 — that is the right ballpark.

Format      JPEG for photographs. WebP if you want smaller files at the same
            quality — Next.js serves modern formats automatically either way.

Look        These sit against the paper background next to a near-white ghost
            wordmark. High-contrast, simple compositions read best; busy or
            pale images disappear into the page.


A NOTE ON COUNT
---------------
Three to six images is the sweet spot. One is fine. More than about eight and
visitors will never see the later ones — the plate advances roughly every four
seconds, or as the pointer travels across the hero.

BEFORE YOU DROP FILES IN
------------------------
Large camera/stock originals are fine to drop here, but run them down to spec
afterwards: square, 1280 x 1280, under 300 KB. A 5 MB 6960x4640 original costs
every visitor bandwidth for a 640px frame.

Untouched originals for the current set are kept outside the web root at:

    ebcom-app/_archive/about-originals/

Anything left inside public/ is uploaded and publicly served, even when this
folder's reader ignores it — that is why the originals live in _archive and
not in an "_originals" subfolder here.


HOW MANY ACTUALLY GET SEEN
--------------------------
The plate mounts three frames at a time (current, previous, next) and advances
on pointer travel, or every few seconds without a pointer. Sixteen images all
load eventually, but a visitor who reads the page and moves on sees maybe the
first four. Order the best work first.
