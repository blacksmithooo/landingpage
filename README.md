# landingpage

A product landing page draft. Its structure and UX follow a modern smart-glasses
product page. It's a starting point for our own design work, not a finished page.

**Live preview:** https://blacksmithooo.github.io/landingpage/

Or open `index.html` in a browser. There's no build step.

## Page structure

The layout mirrors a modern smart-glasses product page, section by section:

1. **Header + product bar**: header is transparent over the hero and turns white after it. The product bar (name, "starting at" price, blue pill) sits at the bottom of the hero, then sticks under the header.
2. **Hero**: full-bleed media, brand lockup, headline, subline, pause button.
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

"Lumen" is a placeholder product. All copy, prices and artwork (CSS gradients
and an inline SVG frame) are placeholders to swap for real content.

## Files

- `index.html`: markup
- `styles.css`: styles, with design tokens at the top under `:root`
- `main.js`: header/product bar, menu, hero pause, swatches, assistant scroll effect, hotspots, compare columns, FAQ, scroll reveals

## Fonts

Brand typefaces from [`fonts/`](fonts/). Suisse Int'l is used throughout to
match the reference layout. Suisse Works and Suisse Int'l Mono are loaded and
available as `--serif` and `--mono` in `styles.css`.
