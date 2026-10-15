# Image Editor: Project Guide

Yeh browser mein chalne wala ek client-side image editor hai. User image select karta hai, sliders se visual filters adjust karta hai, preset laga sakta hai, aur final canvas ko PNG ke roop mein download kar sakta hai. Image server par upload nahi hoti; processing browser ke Canvas API mein hoti hai.

## Project ki files

- `index.html`: editor ka markup, image input, canvas, filter panel aur preset area.
- `script.js`: filter configuration, UI generation, image loading, canvas rendering, reset, presets aur download behavior.
- `style.css`: editor ka layout, buttons, sliders, canvas aur responsive presentation ke styles.
- `theme.css`: rang, spacing, font-size aur border-radius ke CSS custom properties (design tokens).

## Kaise chalayein

`index.html` ko modern browser mein kholen. Image chunne ke baad sliders aur presets ka istemal karein. `Download` canvas ko `image.png` naam se save karta hai. Remix Icon stylesheet CDN se load hoti hai, isliye us icon ke liye internet connection chahiye.

## Mukhya concepts

### 1. Filter configuration aur state

`script.js` ka `filters` object editor ki vartaman state hai. Har filter ke paas `value`, `min`, `max` aur `unit` hota hai. Misal ke taur par brightness ka `100%` normal hai, jabki blur `0px` se shuru hota hai. Slider ka input event isi object mein value badalta hai.

Yeh object UI aur rendering ke beech source of truth ka kaam karta hai: slider state badalta hai, `applyFilters()` us state ko padhta hai, aur preset bhi isi state ko update karta hai.

### 2. JavaScript se UI banana

`createFilters()` `filters` object ki keys par loop karke `createFilterElement()` chalata hai. Har filter ke liye label aur range input DOM mein bante hain. Is approach se filter jodne ke liye aam taur par configuration entry aur render chain mein uska CSS filter hi add karna hota hai.

`createFilters()` dobara chalane se pehle `.filters` container saaf kiya jata hai, isliye reset/preset ke baad purane sliders duplicate nahi hote.

### 3. File input, Image aur Canvas

`#image-input` se chuni gayi file browser `File` object hoti hai. `URL.createObjectURL(file)` us file ko `Image` element ke liye local URL deta hai. Image load hone par canvas ki width/height ko image ke natural dimensions par set kiya jata hai aur `drawImage()` se preview draw hota hai.

Canvas do kaam karta hai: edited preview dikhata hai aur wahi final pixels export ke liye deta hai. Canvas ka HTML display-size CSS se chhota ho sakta hai; canvas ka `width`/`height` uske internal pixel buffer ka size hai.

### 4. CSS Canvas filters

`applyFilters()` pehle `clearRect()` se purana frame mitaata hai, phir `canvasCtx.filter` mein CSS filter functions jodta hai, aur original image ko dobara draw karta hai. Isliye filters ek doosre ke upar jama nahi hote; har redraw current state se shuru hota hai.

| Filter        | Kya karta hai                                                            | Unit / aam default                  |
| ------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| `brightness`  | Roshni badhata ya ghatata hai                                            | `%`, `100%`                         |
| `contrast`    | Halke aur gehre rangon ka antar badhata ya ghatata hai                   | `%`, `100%`                         |
| `saturation`  | Rangon ki teevrata badhata ya ghatata hai; `0%` grayscale jaisa hota hai | `%`, `100%`                         |
| `hueRotation` | Rangon ko color wheel par ghumata hai                                    | `deg`, `0deg` par koi rotation nahi |
| `blur`        | Image ko dhundhla karta hai                                              | `px`, `0px`                         |
| `grayscale`   | Rang ko black-and-white ki taraf le jata hai                             | `%`, `0%`                           |
| `sepia`       | Bhura/sepia tone milata hai                                              | `%`, `0%`                           |
| `opacity`     | Image ki apardarshita badalta hai                                        | `%`, `100%`                         |
| `invert`      | Rangon ko ulat deta hai                                                  | `%`, `0%`                           |

Filter order maayne rakhta hai: browser listed order mein effects lagata hai, isliye `script.js` ke filter chain ka order badalne se output badal sakta hai.

### 5. Presets

`presets` object named filter-value collections rakhta hai, jaise `vintage`, `drama` aur `black and white`. Button click par preset ke values `filters` state mein copy hote hain, canvas redraw hota hai, aur sliders dobara banaye jate hain taaki controls preview se match karein. Preset image ko replace nahi karta; woh bas saare filter values ek saath set karta hai.

### 6. Reset aur download

`Reset` default filter configuration set karta hai, preview redraw karta hai, aur sliders recreate karta hai. Dhyan dein: file ke shuru mein `hueRotation` ka initial value `200` hai, lekin reset configuration mein `100` hai. Isliye page load par aur reset ke baad Hue slider ek jaisa nahi hota; `normal` preset ise `0` karta hai. Agar consistent defaults chahiye, in values ko ek hi configuration se lena chahiye.

`Download` `canvas.toDataURL()` se canvas pixels ko PNG data URL mein badalta hai, phir temporary `<a>` element ko click karke browser download shuru karta hai. Exported file mein canvas ka rendered result hota hai, original image file nahi.

## Abhi ke behavior ki seemaayein

- Image load hone se pehle `Reset` ya preset chalane par canvas draw call ko valid image nahi milti. Pehle image chunna expected flow hai.
- Download se pehle bhi image select honi chahiye; khaali canvas export user ke liye upyogi result nahi dega.
- Image ka local object URL release nahi kiya jata, aur file input mein `accept="image/."` ka filter sahi MIME pattern nahi hai. Bade ya repeated image sessions mein URL cleanup aur `accept="image/*"` behtar honge.
- `file` variable file object rakhta hai, lekin current rendering mein asli kaam loaded `image` object karta hai.
- `createFilterElement()` ka `unit` parameter abhi sirf function signature mein hai; slider value display mein unit nahi dikhayi jati.

Yeh guide maujooda code ko explain karti hai; upar bataye behavior gaps ko alag implementation changes ki zaroorat hogi.
