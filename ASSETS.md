# Asset provenance

## Current Tracks scene: reference-matched desk

The section uses a room plate edited from the supplied `Gemini_Generated_Image_n935oun935oun935.jpeg`, plus matching transparent physical objects. All assets below were made with the **built-in image_gen tool** and copied into this workspace. The approved homepage images, markup, stylesheet and cursor are unchanged.

Final saved assets:

- `public/desk-room-v2.png` — muted taupe wall, weathered wooden desk and static CD/floppy/coaster/VGA clutter.
- `public/desk-monitor-v3.png` — weathered beige CRT with a large blank glass opening; transparent surroundings. Live HTML covers its glass using measured percentage coordinates.
- `public/desk-fishbowl-v2.png` — transparent fishbowl with orange goldfish, clear water, dark gravel and plants.
- `public/desk-console-v2.png` — transparent handheld console lying flat.
- `public/desk-basketball.png` — the retained transparent basketball from the first desk pass, with its color muted in CSS.

The wall title, filenames, selection auras, window controls, track text and prizes are live HTML/CSS. The standalone cursor remains `public/pixel-cursor.svg`.

### Final reference-based generation prompts

#### desk-room-v2.png

Use case: precise-object-edit. Asset type: clean background plate for an interactive web scene. Input image is EDIT TARGET. Preserve this image's exact camera framing, softly lit muted brown-beige plaster wall, dark weathered wooden desk, realistic material detail, subdued golden light from upperleft, color grade, and composition. Remove the entire CRT monitor including stand and castshadow, the fishbowl, handheld console, basketball, their glows and labels, AND the extruded word Tracks from the wall. Fill their areas naturally with the SAME plain wall and wooden desktop. PRESERVE the existing static clutter on desk: CD-ROM jewel cases, beige and blue/red floppy disks, square worn coaster, and unplugged beige VGA cable onfar right, keeping original positions. Keep table backedge depth/perspective as inreference. Empty wall, no large strong windowframe shadows, no bright yelloworange wash, no artificialnewlight. Output originalwide16:9format. No added object, no typography, no UI, no cursor, no watermark. Aim precisely for the original photograph-like tactile3DCGIrender, not a new interpretation.

#### desk-monitor-v2.png (intermediate monitor)

Use case: background-extraction. Asset type: isolated physical CRT computer monitor for live HTML screenoverlay. Use image as visualreference. Recreate ONLY the large beige CRT monitor on right, complete with its bulky deep weathered yellowed plastic body, dustyscuffs, gentlyrounded rectangularbezel, smallsquare powerbutton atbottomright, stoutswivelneck andbroad ovalbase. Match reference's tangible photorealistic3Drender quality and muted goldentan lighting fromupperleft, softshadowright. Camera: front-on, screen MUST be a flat RECTANGLE with perfectly horizontal/vertical edges, at0degrees yaw/pitch. Slight depthvisible at rightbody permitted but displayisstraight. Inner screen is a completelyblank, uniform, flat creamrectangle #f4f2eb with slightlylandscape aspectratio1.60:1, NO UI, NO icons, NO text, NO reflections obscuringrectangle. Entire monitor includingbase centered, tightlycroppedwith3%transparentmarginaroundallouteredges. Overallmonitorbody+base roughly1.30:1widthtoheight. Subtle realisticbevelandweatheredtexture essential, not simplisticcleanvector/CSScartoon. Genuinelytransparentalphabackground outside monitor; keep screencreamopaque. No desk, no otherprop, no wires, no brand, no titleword, no cursor, no watermark, no bakedgroundshadow.

#### desk-fishbowl-v2.png

Use case: background-extraction. Asset type: transparent PNG interactive trinket. Use suppliedimage asvisualreference: recreate ONLY the small roundglassfishbowl ondeskleft. Matchits exact restrained warmmuted realistic3Dstyle, clear glass filled70%with water, dark finegravelbottom, oneorangegoldfishfacingleft, two modest green aquaticplants. Pale softglasshighlights/refraction, no vividbluewatertint, no overbrightgoldsparkles. Keep bowlnaturalroundwide1:1shape, camera frontwithslightlyelevatedview tosee ellipticalrim. Entireisolatedbowl closelyframed with5%transparentpadding. Warm mutedafternoonlightupperleft shadowsright. Genuinelytransparentbackground including translucentglass. No label, no whiteoutlineglow, no deskground, no opaquebackgroundpatch, no bakedcastshadow, noflowers, no floppy, no additionalobjects, notextorwatermark.

#### desk-console-v2.png

Use case: background-extraction. Asset type: transparent PNG interactive website trinket. Input is visualreference. Recreate ONLY the beige Game Boy-style handheld atbottomleft, LYING FLAT ALMOST HORIZONTAL onwooddesk, viewed from a lowelevatedfrontthreequartercamera. Match exactreference orientation: left edgeupperleft, bottomrightedge inforeground; objectvisually WIDEANDLOW about1.9widthto1height, with frontbottom edgevisible clearly. Beige weatheredyellowplastic, blankolivegreen LCD atback, blackDpadatleftfront, two smallburgundybuttonsatright, tinyselectstartbuttons. Match understated realistic3Dmaterial, mutedwarmgoldentanlightingfromupperleft. Fullconsolewith3%transparentmargin, genuinealphabackground. No bluewater, no stand, no hand, no wires, no desk, no groundpatch, no bakedshadow, no glow, no label, no text, no logos, no watermark. Do NOT show console standing upright or tallportrait-oriented.

#### desk-monitor-v3.png (final monitor)

Use case: precise-object-edit. Edit target: this transparent beigeCRT monitor cutout. Preserve exactly the physical outer silhouette, warmweatheredplastictexture, subtle rightside depth, swivelneck, ovalbase, colors, lighting, alpha transparency andfronton0degreeflat camera. Change ONLY the screen opening and its surrounding bezel: make the blank cream rectangular display significantly larger/wider, with a thinner realistic plasticbezel, like a late90slarge monitor. Target displayrectangle begins at7.5percentimagewidth,12percentimageheight andendsat90percentimagewidth,77percentimageheight. Rectangleedgesperfectlyhorizontalvertical, gentlyroundedcorners; completely blankuniformcream interior#e4decb, darkthinrim. Keepouterbezelshapeuntouched andallcurrentwearmarksoutsideenlargedopening. No UI,no text,no icons,no reflectionsinsideopening. Clean the wispywhitefragments outsideouterhardwareedges so silhouettehascleantruealpha. Genuinelytransparentbackgroundoutsideentiremonitor; opaquecreaminsideglass. Fullmonitorandbasestayvisible; preserveimageaspectratioandframing. No newobjects, no desk, nocastgroundshadow,nowatermark.


## Retained first Tracks desk scene

The desk section follows the user's 90s desk prompt and visual reference `Gemini_Generated_Image_n935oun935oun935.jpeg`. The homepage's original scene plates are unchanged. The room and all physical prop assets were generated with the **built-in image_gen tool**, then copied into the project. The CRT cabinet and live screen are HTML/CSS; text and selection labels are not baked into any image.

Saved assets:

- `public/desk-room.png` — opaque room and wooden desk background.
- `public/desk-fishbowl.png` — transparent prop cutout.
- `public/desk-console.png` — transparent prop cutout.
- `public/desk-basketball.png` — transparent prop cutout.
- `public/desk-clutter.png` — transparent prop cutout.

### Final desk generation prompts

#### desk-room.png

Use case: stylized-concept. Asset type: wide 16:9 website scene background plate. A nostalgic warm 1990s room. Textured beige/tan plaster wall fills EXACTLY upper 74% of image. A dark weathered walnut wooden desk surface fills bottom26%, horizontal back edge at74%imageheight. Straight-on camera with enough downward angle to see tabletop. Strong golden afternoon sunlight from left creates large softly defined diagonal windowframe shadows across wall and rich amber wood grain. Left wall brightly illuminated, right wall gently darker. Empty wall and empty desk; desk extends edge-to-edge and out of frame. Style: tactile late-1990s/early-2000s 3D CGI nostalgia, softly low-poly silhouette but rich realistic material textures, warm golden sunlight from upper left, shadows to right, lovingly rendered retro desktop surrealism. No text, no labels, no logo, no watermark, no UI, no cursor. No monitor, no fishbowl, no basketball, no game console, no furniture legs, no props or clutter. This is a clean empty plate for individually layered interactive objects. Aim for beautiful nostalgic 3D rendered diorama lighting, not an illustration. Landscape16:9.

#### desk-fishbowl.png

Use case: stylized-concept. Asset type: transparent PNG interactive website trinket. A single round clear glass fishbowl containing blue-tinted water, multicolored fine gravel at bottom, two green aquatic plants, and one cute orange goldfish clearly visible facing left. Thick elliptical glass rim, believable refraction, bright glints and translucent water. Rounded natural glass silhouette, not pixelated. Frontview slightly above showing waterline, vessel bottom resting on tabletop; isolated entire object, tightly framed with8% margin. Style: tactile late-1990s/early-2000s 3D CGI nostalgia, softly low-poly silhouette but rich realistic material textures, warm golden sunlight from upper left, shadows to right, lovingly rendered retro desktop surrealism. No text, no labels, no logo, no watermark, no UI, no cursor. Genuinely transparent alpha background, including translucent glass. No opaque background, no grass, no flowers, no floppy disks, no other objects, no ground patch, no baked cast shadow. Entire bowl visible.

#### desk-console.png

Use case: stylized-concept. Asset type: transparent PNG interactive website trinket. One classic vintage beige handheld gaming console from the1990s, Game Boy style with blank gray-green LCD screen, black D-pad and two burgundy circular buttons, tiny speaker grooves and softly worn yellowed plastic. It is LYING FLAT on a tabletop, shown from elevated front three-quarter view, top points diagonally upperleft, bottom points lowerright. Strong visible thickness and realistic buttons. Entire object tightly framed with8% margin. Style: tactile late-1990s/early-2000s 3D CGI nostalgia, softly low-poly silhouette but rich realistic material textures, warm golden sunlight from upper left, shadows to right, lovingly rendered retro desktop surrealism. No text, no labels, no logo, no watermark, no UI, no cursor. Genuinely transparent alpha background. No text or labels anywhere, no game artwork, no hand, no wire, no otherobjects, no ground patch, no baked cast shadow.

#### desk-basketball.png

Use case: stylized-concept. Asset type: transparent PNG interactive website trinket. One small orange textured rubber mini basketball, spherical and tangible, recognizable deep black curving seams and rich pebbled texture. Frontview slightly from above. Warm highlight upperleft, deep amber shaded rightside. Entireball tightly framed centered with8%margin. Style: tactile late-1990s/early-2000s 3D CGI nostalgia, softly low-poly silhouette but rich realistic material textures, warm golden sunlight from upper left, shadows to right, lovingly rendered retro desktop surrealism. No text, no labels, no logo, no watermark, no UI, no cursor. Genuinely transparent alpha background. No label, no brand, no stand, no otherobject, no ground patch, no baked cast shadow.

#### desk-clutter.png

Use case: stylized-concept. Asset type: wide2:1 transparent PNG decorative desk prop group. Nostalgic1990s desk clutter arranged as a shallow low-height group, shown from elevated frontthreequarterview to sit naturally on a wooden desk. At left one worn square brown cork coaster; center short stack of three CD-ROM transparent jewelcases with iridescent discs visible, two3.5inch floppy disks lying infront (onebeige,oneblue withred label); at far right a loose coiled beige VGA monitor cable with visibly unplugged blue15pin connector. Objects form a compact connected group but each readable; allentirelyinframe. Style: tactile late-1990s/early-2000s 3D CGI nostalgia, softly low-poly silhouette but rich realistic material textures, warm golden sunlight from upper left, shadows to right, lovingly rendered retro desktop surrealism. No text, no labels, no logo, no watermark, no UI, no cursor. Genuinely transparent alphabackground with8%margin. No tabletop, no opaqueground, no monitor, no fishbowl, no basketball, no handheld, no textlabels, no bakedcastshadow.


## Retained earlier Tracks hillside assets

The approved homepage continues to use `public/scene-desktop.png` and `public/scene-mobile.png` without modification. Its markup, stylesheet, cursor, and image positioning are preserved.

New assets made with the built-in `image_gen` tool:

- `public/hillside-world.png` — clean landscape derived from the homepage scene, used for the previous grass-only Tracks design. Retained, currently unused.
- `public/tracks-flowers.png` — transparent Windows signpost, terracotta pot, voxel flowers, and floppy disks. Retained, currently unused.
- `public/tracks-fishbowl.png` — transparent glass bowl with pixel goldfish, aquatic plants, floppy disk, and voxel flower. Retained, currently unused.
- `public/hero-computer.png` — unused experimental cutout, retained as an asset only. The homepage does not load it.

The ground props use real alpha transparency. Backgrounds and props contain no cursor. The existing live pointer component handles the mouse.

### Final generation prompts

#### hillside-world.png

Use case: precise-object-edit. The supplied image is the edit target for a continuous website landscape background. Remove the beige CRT computer, all floppy disks, and their shadows from the lower-left. Replace them naturally with exactly the same lush 3D rendered grass. Preserve the sky, soft puffy white clouds, grassy rolling hill, grass blade texture, green and blue colors, nostalgic low-poly CGI realism, camera perspective, and top-left sunlight. Keep the left hill horizon at about42 percent height, smoothly sloping down to60 percent at right. This should look like exactly the same scene, now an empty uninterrupted grassy hill under a clearblue sky. Wide16:9. No objects, no UI, no text, no cursor, no watermarks. The same image will serve as one fixed continuous environment behind both sections of a scrolling web page.

#### hero-computer.png

Use case: background-extraction. Create a genuinely TRANSPARENT PNG cutout containing ONLY the exact beige low-poly CRT desktop computer and the blue and white3.5inch floppy disks seen in the lower-left of this reference image. Preserve its chunky early2000s 3D-render aesthetic, front-right view, warm cream plastic, black display with tiny glowing green terminal code, desktop PC base, original relative layout of the floppies, hard top-left sunlight, and deep shadows to the lower right. Crop composition close around the prop group with10percent breathing room. Include a few wisps of grass at the base and a soft semitransparent directional contact shadow to blend into a grassy hillside. No opaque ground patch. No sky, no opaque background, no added keyboard, no UI window, no cursor, no additional objects or text labels. Transparent background with clean alpha edges.

#### tracks-flowers.png

Use case: background-extraction. The attached image is a visual reference for an isolated transparent-background3D prop group. Recreate ONLY its lower-left mini Windows95-style signpost standing BEHIND a low-poly terracotta flower pot filled with colorful voxel flowers. The little sign is a chunky puttygray beveled rectangle with a tiny navy title strip, a little X button, and the exact readable black pixel text "Tracks & Prizes" on its face. The pot is angular orange terracotta with a thick polygonal rim. Flowers are cute blocky pink, red, white, and pale-yellow voxel daisies on green stems. Include one or two blue/white3.5inch floppy disks scattered beside the pot near ground level. Match reference's tangible nostalgic3D-render style and sunlight from upper left. Front-facing props with slight depth in their sides, cropped tightly around the group with10percent breathing room. A few individual grass blades and a soft semitransparent directional contact shadow at the base are fine; no opaque grass patch or pedestal. Truly transparent background, clean alpha. NO sky, no background, no large preview UI, no heading, no file icons, no mouse cursor, no watermark.

#### tracks-fishbowl.png

Use case: background-extraction. Recreate ONLY the bottom-right decorative prop group from this reference as a genuinely transparent PNG cutout: a round transparent glass fishbowl, half-full with clear blue-tinted water, containing one cute orange pixel-art/voxel goldfish, a little sand/gravel at the bottom, and green voxel aquatic plants. The glass needs believable soft highlights, refraction, translucency, and a thick elliptical top rim; the fish remains clearly visible. Include one blue/white3.5inch floppy disk lying beside the bowl at ground level and one small purple/white voxel daisy. Match the reference's nostalgic early2000s3D-rendered surreal desktop-world aesthetic, hard sunlight from top-left, front-facing viewpoint. A few fine grass blades at the base and a soft semitransparent contact shadow may ground the group, but no opaque ground patch. Close composition with10percent breathing room around the group. Truly transparent background with clean alpha; no sky, no landscape, no large UI window, no file icons, no header text, no mouse cursor, no watermark.



## Preserved homepage scene: `public/scene-desktop.png` and `public/scene-mobile.png`

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
