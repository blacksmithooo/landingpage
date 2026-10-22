# landingpage

A product landing page draft. Its structure and UX follow a modern smart-glasses
product page. It's a starting point for our own design work, not a finished page.

**Live preview:** https://blacksmithooo.github.io/landingpage/

**Scroll-telling page:** https://blacksmithooo.github.io/landingpage/scroll-telling/

Or open `index.html` in a browser. There's no build step.

## Page structure

The layout mirrors a modern smart-glasses product page, section by section:

1. **Header + product bar**: header is transparent over the hero and turns white after it. The product bar (name, "starting at" price, blue pill) sits at the bottom of the hero, then sticks under the header.
2. **Hero**: full-bleed looping video under a dark gradient, brand lockup, headline, subline, and a play/pause button that controls the video. With `prefers-reduced-motion` the video doesn't autoplay and shows its poster.
3. **Style picker**: three grey cards with a "New" tag, colour swatches, name and a "Shop" pill, plus "Try them on" and "Compare styles" outline pills.
4. **Assistant**: "Hey Lumen," with cycling questions over a faded wall of example questions. A video card rises over it as you scroll.
5. **Banner**: full-width media with overlay copy, a blue "Shop" pill and a frosted "Learn more" pill.
6. **Calls / Audio / Camera**: centred heading, large rounded media with floating chips, and a two-up card row.
7. **Hotspot diagram**: hover a point and it expands into a labelled pill; click it for a detail sheet.
8. **Compare**: three columns, each with a model dropdown, price, "Shop now" and an icon spec list.
9. **Your glasses, your rules**: three image cards with text.
10. **More from Lumen**: two large media cards with overlay copy and pills.
11. **FAQ** accordion, **newsletter** sign-up and a four-column **footer**.

### Pill styles

| Pill | Use |
| --- | --- |
| `pill--primary` | Blue `#0457cb`, white text. Main actions. |
| `pill--outline` | Transparent, blue text, light grey border. Secondary actions. |
| `pill--glass` | Frosted light grey with blur. Secondary actions on top of media. |
| `chip` | Dark frosted label floating over media. |

"Lumen" is a placeholder product. All copy, prices and artwork are
placeholders to swap for real content. All imagery is AI-generated:

- `assets/photos/`: lifestyle shots (stills and frames from the hero video shoot, plus `app.jpg`, the branded Lumen app in hand).
- `assets/products/`: product shots on white, one per style and colourway
  (`<style>-<colour>.jpg`), plus `hotspot.jpg` for the "What's inside the frame"
  diagram. Each colourway was generated from its style's base shot so the shape
  stays identical. They use `mix-blend-mode: multiply`, so the white background
  takes on the colour of the card behind it.

Style card swatches swap the product photo (each swatch has a `data-src`), and
the compare columns pick their photo from the `img` field in `models` in
`main.js`. The hotspots are positioned in percentages over `hotspot.jpg`, so
they need re-placing if that image changes.

### Hero video

`assets/hero.mp4` is a 20-second silent loop (H.264, 1920×1080, about 7.6MB):
five AI-generated shots of the same placeholder glasses, joined with 0.3s
cross-dissolves. The end dissolves back into the opening so the loop has no
hard cut. `assets/hero-poster.jpg` is its first frame.

Phones (up to 720px wide) get `assets/hero-mobile.mp4` instead: a 3:4 portrait
cut of the same edit (810×1080, about 3.3MB), with each shot's crop placed, and
panned where the subject moves, so the glasses stay in frame. It has its own
poster, `assets/hero-mobile-poster.jpg`. On phones the hero is 3:4 rather than
full height, and the photo slots use wider crops so less of each image is cut off.

It was made in Higgsfield, loosely following
[`docs/hero-video-prompts.md`](docs/hero-video-prompts.md), with these
differences: Nano Banana Pro and the doc's video models aren't available to
our API key, so the stills were made with Grok Imagine Image 2.0 (with the
three master glasses images as references) and animated with Kling O3 image
reference (each still as the first frame, plus the masters as references). The
"darker lower third" line in the style prompt was reworded because the image
model drew it as a literal black band; the page's gradient overlay darkens
the bottom instead.

## Files

- `index.html`: markup
- `styles.css`: styles, with design tokens at the top under `:root`
- `assets/`: hero video and poster; `assets/photos/` lifestyle shots; `assets/products/` product shots
- `main.js`: smooth scrolling, header/product bar, menu, hero video play/pause, swatches, assistant scroll effect, hotspots, compare columns, FAQ, scroll reveals

## Smooth scrolling

Scrolling is smoothed with [Lenis](https://github.com/darkroomengineering/lenis)
(loaded from unpkg, pinned to 1.3.26) for a weighted, gliding feel. Tune the
glide with `lerp` in `main.js` (lower is floatier). Anchor links still respect
`scroll-padding-top`. Touch devices keep native scrolling, and Lenis is off
with `prefers-reduced-motion`.

## Scroll-telling page

`scroll-telling/` is a second, self-contained page (`index.html`, `style.css`,
`app.js`) that tells the Lumen story through scroll-driven motion. Its section
order and motion follow a modern smart-ring product page; all copy and imagery
are our own placeholders.

How the motion works: every `[data-scene]` section gets a `--p` CSS variable
from 0 to 1 as you scroll through it (`app.js`), and `style.css` maps `--p` to
transforms, opacity, blur and clip-paths. Pinned scenes hold a sticky `.pin`
for the length of their runway. Elements with `data-reveal` fade up once when
they enter the viewport.

1. **Hero:** pinned. The headline lifts away, the intro copy lights up word by word, the image drifts, then the stage fades to light.
2. **Morph:** pinned. The glasses shrink into the "00" of "100%" while the digits blur in, then a blue morpho butterfly flies in from off-screen and lands on the frame. Its frames were cut out of a generated landing clip (`assets/scroll/butterfly.webp` plus positions in `butterfly.json`) and drawn on a full-screen canvas, so it can fly anywhere on the page. Scroll only triggers it: once the 100% has formed, the flight plays on its own clock (so it stays smooth however you scroll), then it flutters now and then while perched. Scrolling back above the scene re-arms it.
3. **Hand + film card:** the hand rises with parallax, then the film card slides over it. "Watch the film" opens the hero video in a viewer.
4. **Designed for real life:** the card unveils downward while the copy arrives.
5. **Stats:** count up, with dividers drawing in and the background warming.
6. **8 hours:** pinned dark stage. A looping video of the frame in clear acetate settles as the figure rises. The front is almost bare (two hairline traces to a tiny chip at the bridge); the electronics sit inside the temple arms (a muted sage module, small chips, a battery cell). The components light softly, then a fine warm glow runs along the traces to the bridge. Only the light is taken from the generated clip and layered onto the still frame, so the components never change shape (`assets/scroll/xray.mp4`, poster `xray.jpg`).
7. **Built for every day:** full-width video card scaling in.
8. **Everyday intelligence:** tabs swap a horizontal card rail with arrows and a progress bar.
9. **Technical specifications** panel, then **Choose your style** (all 15 colourways; hover shows the price), notes and footer.

It reuses the main page's fonts, photos, product shots and hero video. New
assets in `assets/scroll/`: `hero-dark.jpg`, `macro-dark.jpg` and `hand.jpg`
(generated), and `seaside.mp4` (a clip from the hero shoot). With reduced
motion, the scenes unpin and show their end states.

## Fonts

Brand typefaces from [`fonts/`](fonts/). Suisse Int'l is used throughout to
match the reference layout. Suisse Works and Suisse Int'l Mono are loaded and
available as `--serif` and `--mono` in `styles.css`.
