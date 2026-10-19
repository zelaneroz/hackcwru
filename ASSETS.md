# Asset provenance

## Current scene: `public/scene-desktop.png` and `public/scene-mobile.png`

Created with the built-in `image_gen` tool using the user-provided image `inspo/Gemini_Generated_Image_ri5b1qri5b1qri5b.jpeg` as the reference and edit target. The dialog and pointer were removed to make clean scene plates. The live page supplies accessible HTML text, buttons, the floating window, animated ground shadow, scrolling terminal overlay, and cursor.

Desktop image: 1672 × 941 pixels. Portrait image: 941 × 1672 pixels.

### Final desktop prompt

Use case: precise-object-edit. The attached image is the visual reference and edit target. Create a clean background plate for an interactive website by removing ONLY the large floating Windows dialog box, all its text and buttons, the big white mouse cursor, AND the dialog/cursor's dark cast shadow. Inpaint the removed areas with the same grassy hill and sky. Keep the beige low-poly vintage CRT computer and blue/white 3.5 inch floppy disks nestled in grass in the bottom-left foreground. Keep the computer's black screen with green terminal code. Preserve the reference's chunky early-2000s 3D-render style, tangible thick grass blades, warm off-white plastic, saturated leaf-green hill, blue sky with big soft white cumulus clouds, subtle nostalgic film texture, strong light from the upper left and deep directional shadows. Recompose as a WIDE 16:9 desktop wallpaper, extending the landscape left and right naturally. The grassy hill slopes from 42 percent height at left to 58 percent height at right. Computer and disks fit entirely within the bottom-left quadrant, collectively occupying about 25 percent of image width and 31 percent of image height; the computer starts at 6 percent image width, its base is at 86 percent image height. Leave the entire center and right clear as natural grass and sky. Camera perspective and 3D material quality closely match the reference. No UI windows, no interface, no cursor, no text overlays, no logos, no new props, no watermark. A live HTML dialog will be overlaid separately.

### Final portrait prompt

Use case: precise-object-edit. The attached image is the visual reference and edit target. Make a clean VERTICAL 9:16 mobile website background, based closely on the attached nostalgic low-poly 3D rendered landscape. Remove the large floating Windows dialog window including all text/buttons, the oversized white pointer, and their cast shadows. Replace those areas naturally with grass and sky. Preserve the beige vintage CRT computer with a dark terminal screen and the scattered blue and white 3.5 inch floppy disks in the lower-left foreground. Preserve the reference's chunky early-2000s 3D rendered grass blades, warm plastic materials, saturated green hill, bright blue sky and large soft white clouds, and hard sunlight from the upper left. For vertical composition, make sky fill the top 45 percent with the hill crest at 42 percent on the left and sloping down to 55 percent at right. Leave the center completely open for a live HTML dialog that will be overlaid later. Scale the computer so its entire height occupies 23 percent of image height and its width is 38 percent of image width, placed at x 7 percent and bottom at 90 percent image height. Floppy disks rest around it in the grass, with all props in the bottom-left, leaving the center and right natural. Keep the tangible stylized 3D look rather than real photograph. No UI, no text overlays, no cursor, no large floating dark shadow, no additional objects, no watermark.

## Locally hosted fonts

- `public/fonts/VT323-Regular.ttf` — VT323, weight 400. [Official source](https://github.com/google/fonts/tree/main/ofl/vt323). SIL Open Font License 1.1 in `public/fonts/VT323-OFL.txt`.
- `public/fonts/PixelifySans-Variable.ttf` — Pixelify Sans, weights 400–700. [Official source](https://github.com/google/fonts/tree/main/ofl/pixelifysans). SIL Open Font License 1.1 in `public/fonts/PixelifySans-OFL.txt`.

## Retained earlier assets

`public/landscape.png` and `public/computer.svg` remain available from the first design pass. The revised page uses the reference-based scene plates instead. The earlier landscape was generated with the built-in image tool; the computer and floppies are original SVG artwork.

## `public/text-document.svg`

Original code-native pixel document icon for Tracks & Prizes. Transparent 96 × 120 viewBox with folded corner, cream-to-pale-blue paper, seven gray text lines, a thick outline, extrusion, and hard shadow. The attached Tracks & Prizes reference supplied by the user informed its styling. No image generation was used for this icon.

## `public/pixel-cursor.svg`

Standalone original SVG extracted from the live cursor. Transparent background, 58 × 80 viewBox, white pixel arrow, thick black outline, shaded bevel, and dark extrusion. Its hotspot is at SVG coordinate (4, 2). Reusable tracking and responsive styling are in `src/pixel-cursor.ts` and `src/pixel-cursor.css`.

## `public/favicon.svg`

Original project SVG with a beveled Windows-inspired frame and HackCWRU H mark.
