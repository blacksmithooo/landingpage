# landingpage

A product landing page draft. Its structure and UX follow a modern smart-glasses
product page. It's a starting point for our own design work, not a finished page.

**Live preview:** https://blacksmithooo.github.io/landingpage/

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
placeholders to swap for real content. Photo slots use AI-generated images of
the placeholder glasses (stills and frames from the hero video shoot, in
`assets/photos/`). The style cards, hotspot diagram, compare columns, phone
mockup and detail sheet still use the inline SVG frame, because their
swatches and hotspots recolour or position the drawing.

### Hero video

`assets/hero.mp4` is a 20-second silent loop (H.264, 1920×1080, about 7.6MB):
five AI-generated shots of the same placeholder glasses, joined with 0.3s
cross-dissolves. The end dissolves back into the opening so the loop has no
hard cut. `assets/hero-poster.jpg` is its first frame.

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
- `assets/`: hero video and its poster image; `assets/photos/` holds the section photos
- `main.js`: smooth scrolling, header/product bar, menu, hero video play/pause, swatches, assistant scroll effect, hotspots, compare columns, FAQ, scroll reveals

## Smooth scrolling

Scrolling is smoothed with [Lenis](https://github.com/darkroomengineering/lenis)
(loaded from unpkg, pinned to 1.3.26) for a weighted, gliding feel. Tune the
glide with `lerp` in `main.js` (lower is floatier). Anchor links still respect
`scroll-padding-top`. Touch devices keep native scrolling, and Lenis is off
with `prefers-reduced-motion`.

## Fonts

Brand typefaces from [`fonts/`](fonts/). Suisse Int'l is used throughout to
match the reference layout. Suisse Works and Suisse Int'l Mono are loaded and
available as `--serif` and `--mono` in `styles.css`.
