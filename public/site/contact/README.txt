EQUINOUX — Contact page filmstrip
=================================

Drop images in THIS folder and they run in the filmstrip behind the contact
page. No code change needed.

    ebcom-app/public/site/contact/

The folder is read at build time, so after adding or removing files you just
need to redeploy (or restart `npm run dev` locally) for the change to show.


IF THIS FOLDER IS EMPTY
-----------------------
The strip falls back, in order, to:

    1. public/site/about/       (the About hero images)
    2. the four project covers  (from projects-data.ts)

So the page always has a backdrop. Drop files here only when you want the
contact page to look different from the About page.


ORDER
-----
Files play left to right in filename order, so number them:

    01-.jpg  02-.jpg  03-.jpg  ...


WHAT WORKS
----------
Accepted extensions:  .jpg  .jpeg  .png  .webp  .avif
Ignored:              anything else, and any file starting with "." or "_"


IMAGE SPECS
-----------
Shape       Each frame is a 620px-wide window at full strip height and crops
            with object-cover. Square or portrait sources work best; very wide
            panoramas lose most of their width.

Size        1280 x 1280 px is plenty. Larger is wasted bytes.

Weight      Under 300 KB each. Run big camera or stock originals down before
            committing them — a 5 MB original costs every visitor bandwidth
            for a 620px frame.

Format      JPEG for photographs, WebP if you want smaller at the same quality.

Look        A 42% ink scrim sits over the strip and white display type sits on
            top of that. Busy, bright or high-detail images fight the headline;
            darker, simpler frames read best.


HOW MANY
--------
Six to twelve is comfortable. The strip loops continuously, so enough frames to
fill the screen twice avoids an obvious repeat — at 620px each that is about
seven at a 1920px display.

Anything left inside public/ is uploaded and publicly served, so keep untouched
originals outside the web root (see ebcom-app/_archive/).
