# art/

Alpha masks for the site's engravings. Each file is an RGBA WebP whose RGB is
constant black and whose alpha channel is the picture: opaque where the plate is
light (paper), transparent where it is ink. Pages paint them with
`mask-image` over a solid colour, so the same file works on light and dark
ground and never carries a colour of its own.

| File | Plate | Source and licence |
| --- | --- | --- |
| `empyrean.webp` (1200 x 1480) | Gustave Dore, illustration for Dante's *Paradiso*, Canto XXXI (the Empyrean) | public domain |
| `ninth-heaven.webp` (1200 x 1638) | Gustave Dore, illustration for *Paradiso*, Canto XXVIII (the ninth heaven) | public domain |
| `babel.webp` (1200 x 1494) | Gustave Dore, *The Confusion of Tongues* | public domain |
| `firmament.webp` (1200 x 901) | the Flammarion engraving (first printed in Camille Flammarion, *L'atmosphere*, 1888) | public domain |
| `mnemosyne.webp` (1000 x 1685) | Mnemosyne plate, Rijksmuseum | CC0 |

## How they were made

Processed from the two-colour halftoned plates prepared for
[Pylos](https://github.com/jack-chaudier/pylos) (`apps/web/public/art`), which
screen each engraving to exactly two colours, kiln (217, 69, 14) and bone
(244, 235, 221):

1. Classify each source pixel as bone when its luminance is above the image
   mean (the images are exactly two colours, so this is exact).
2. Build a full-resolution boolean mask, then resample it to the target width
   with Lanczos. Resampling the boolean, not the two-colour picture, keeps the
   dot screen from aliasing; the alpha is left continuous rather than
   re-thresholded.
3. Store RGB = 0 and alpha = mask. `mnemosyne`, `ninth-heaven`, and `babel`
   were already at target width, so their alpha is exactly 0 or 255.
4. Encode with `cwebp -lossless -exact -q 100`. For the two resampled plates
   the continuous alpha did not fit the size budget losslessly, so their alpha
   was quantised first (empyrean to 3 levels, firmament to 8) and then encoded
   losslessly.

Sizes: empyrean 227 KB, firmament 215 KB, babel 142 KB, ninth-heaven 120 KB,
mnemosyne 89 KB.
