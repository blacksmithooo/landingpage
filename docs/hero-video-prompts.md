# Hero video: Higgsfield prompt pack

A 20-second, silent, 16:9 fashion film for the hero section. Five shots of
different people, all wearing **the exact same pair of glasses**.

The site's hero text sits at the bottom centre, so every shot keeps the lower
third darker and less busy.

## How consistency works

Text prompts alone will drift: the frame shape, colour or lenses change from
shot to shot. To stop that:

1. **Make one product image first** (Step 1). This becomes the master reference.
2. **Attach that image to every later generation** as a reference image.
3. **Paste the same glasses description into every prompt**, word for word (the
   "Glasses block" below).
4. **Make a still image for each shot first, then animate it.** Reject any still
   where the glasses don't match before you spend video credits on it.

## Glasses block

Paste this into every prompt, unchanged:

> wearing the LUMEN-01 smart glasses from the reference image: matte black
> acetate, rectangular frames with softly rounded corners, thick flat temple
> arms, a thin brushed-silver hinge, two small round silver dots on the outer
> top corners of the front frame, dark smoke-grey lenses. The glasses must be
> identical to the reference image in shape, colour, thickness and lens tint.

## Step 1: master product image

- **Model:** Nano Banana Pro, 4k, 16:9
- **Prompt:**

> Studio product photograph of a single pair of smart glasses on a seamless
> warm light-grey background, three-quarter front view, soft diffused key light
> from the upper left, gentle shadow underneath. The glasses: matte black
> acetate, rectangular frames with softly rounded corners, thick flat temple
> arms, a thin brushed-silver hinge, two small round silver dots on the outer
> top corners of the front frame, dark smoke-grey lenses. No logos, no text,
> no people. Ultra sharp, commercial eyewear catalogue style.

Make a few variations and pick one. Then make two more angles of **that same
pair** (attach the chosen image as a reference): a straight-on front view and a
side profile. Use all three as references from here on.

## Step 2: still for each shot

- **Model:** Nano Banana Pro, 2k, 16:9
- **Attach:** the three master product images
- **For each shot, the prompt is:** shot description + Glasses block + style line

**Style line** (add to the end of every shot prompt):

> Fashion editorial film still, shot on 35mm, shallow depth of field, rich
> natural colour, soft film grain, cinematic 16:9, darker and calmer in the
> lower third of the frame.

### Shot 1: the opening (0–4s)

> Close-up of a woman in her late 20s with a sleek dark bob and an oversized
> cobalt-blue tailored blazer, on a rooftop at golden hour, lifting the glasses
> towards her face with one hand, city skyline softly blurred behind her.
> [Glasses block]

### Shot 2: the street (4–8s)

> Medium shot of a man in his 30s with short curly hair and a cream chunky-knit
> turtleneck, walking across a sunlit crosswalk in a European city, looking
> slightly off camera. [Glasses block]

### Shot 3: the product beat (8–12s)

> Macro close-up of the glasses folded on a white marble café table next to an
> espresso cup, late-afternoon sunlight falling across the frames.
> [Glasses block]

### Shot 4: the movement (12–16s)

> A woman in her early 20s with long braids and a burnt-orange silk shirt
> laughing on a seaside promenade, wind in her hair, the sea behind her.
> [Glasses block]

### Shot 5: the closing (16–20s)

> Portrait of a woman with short platinum hair and a black leather trench coat
> against a deep red studio backdrop, adjusting the glasses with one finger and
> looking straight into the camera. Subject in the upper-middle of the frame.
> [Glasses block]

**Check before moving on:** compare each still against the master image. The
frame shape, the silver dots, the hinge and the lens tint must match. Regenerate
any still that doesn't.

## Step 3: animate each still

- **Best for consistency:** Seedance 2.0 (needs a Plus plan or higher).
  - Settings: 5s, 1080p, 16:9, audio off.
  - Attach the shot's still as `start_image` and the master product images as
    `image_references`.
- **Alternative:** Cinema Studio Video 3.0.
  - Settings: 4–5s, 1080p, 16:9, audio off.
  - Attach the still as `start_image`.

**Motion prompts** (always add: "The glasses stay identical to the reference
image throughout. No morphing.")

1. Slow push-in as she slides the glasses on; her hair moves slightly in the breeze.
2. Smooth tracking shot moving alongside him as he walks; natural stride.
3. Slow sideways camera slide; a band of sunlight sweeps across the frames.
4. Handheld, gentle; she turns her head towards the camera mid-laugh.
5. Very slow push-in; she adjusts the glasses and holds eye contact; ends still.

**Avoid motion that breaks consistency:** fast head turns, hands covering the
glasses, extreme close-ups of the lenses and taking the glasses off on camera.

## Step 4: edit and export

- Cut the five clips together with 0.3s cross-dissolves, about 20s in total.
- Make the last frame close to the first so the video loops cleanly.
- Export as MP4 (H.264), 1920×1080, no audio. Keep it under about 8MB for the web.
- Also export a still of the first frame to use as the poster image.

## Getting it onto the site

Put the files in `assets/hero.mp4` and `assets/hero-poster.jpg`. Then ask Claude
to swap the hero's placeholder gradient for the video. The play/pause button
will control it.
