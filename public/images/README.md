# Image assets

Filenames here are declared in [`src/images.js`](../../src/images.js) — that is
the only file to edit if you want different names. `<Img>` shows a grey
"Replace image" placeholder at the correct box size until a file exists.

| Filename            | Used by             | Notes                                        |
| ------------------- | ------------------- | -------------------------------------------- |
| `hero-meeting.jpg`  | Hero, right column  | 3:2. Currently 539×360 — upscaled, looks soft |
| `about-team.jpg`    | About section, left | Slot is 1.9:1, so a 3:2 source crops ~21%     |
| `collage.png`       | Commitment section  | Pre-composed, **transparent** PNG, ~1:1.03    |
| `logo.png`          | Optional real logo  | Not currently used                            |

## The collage is one image, not four

`collage.png` bakes the stagger, rounded corners and gaps into the artwork.
The gaps are transparent, so `.collage__image` in `src/styles.css` deliberately
carries **no** `background` and **no** `border-radius` — adding either would
show through the transparent areas as grey blocks.

The other photo slots *do* get a grey `background`, so a missing or lazy
offscreen image shows its box instead of collapsing invisibly.

## The logo

The header logo is drawn in CSS/text (`.logo` in `src/styles.css`). To use a
real image, swap the two `<span>`s in `src/components/Header.jsx` for
`<img src={IMAGES.logo} alt="Saeed Accounting" />`.
