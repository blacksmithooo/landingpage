# landingpage

A product landing page draft. Its structure and UX follow a modern smart-glasses
product page. It's a starting point for our own design work, not a finished page.

**Live preview:** https://blacksmithooo.github.io/landingpage/

Or open `index.html` in a browser. There's no build step.

## Page structure

1. **Header**: transparent over the hero, solid once you scroll past it, hides on scroll down. Burger menu on mobile.
2. **Hero**: full-bleed dark media, product name, headline, subline, play/pause control.
3. **Sticky buy bar**: product name, "starting at" price and a primary CTA. Sits at the bottom of the hero, then sticks under the header.
4. **Intro + stats**: headline, one line of copy, three key numbers.
5. **Assistant**: dark panel with a "Hey Lumen," prompt that types out example questions.
6. **Audio split**: media and copy side by side.
7. **Feature tiles**: two media cards with copy.
8. **Camera**: segmented tabs that switch between three camera modes.
9. **Inside**: product diagram with labelled hotspots.
10. **Compare**: three model cards with colour swatches, spec list, price and CTA.
11. **You're in control**: app, privacy and accessibility cards.
12. **Family carousel**: horizontal snap carousel with arrow buttons.
13. **FAQ**: accordion, one answer open at a time.
14. **Footer**

"Lumen" is a placeholder product. All copy, prices and artwork (CSS gradients
and an inline SVG frame) are placeholders to swap for real content.

## Files

- `index.html`: markup
- `styles.css`: styles, with design tokens at the top under `:root`
- `main.js`: header, menu, hero pause, typing effect, tabs, swatches, carousel, FAQ, scroll reveals

## Fonts

Brand typefaces from [`fonts/`](fonts/): Suisse Works (headlines),
Suisse Int'l (body text) and Suisse Int'l Mono (labels, buttons, tabs).
