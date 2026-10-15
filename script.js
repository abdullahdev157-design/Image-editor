let filters = {
  brightness: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  contrast: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },

  saturation: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  hueRotation: {
    value: 200,
    min: 0,
    max: 360,
    unit: "deg",
  },
  blur: {
    value: 0,
    min: 0,
    max: 20,
    unit: "px",
  },
  grayscale: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
  sepia: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
  opacity: {
    value: 100,
    min: 0,
    max: 100,
    unit: "%",
  },
  invert: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
};

// Har filter ka current value, slider range, aur CSS unit yahan configure hota hai.
let presetCont = document.querySelector(".presets");

let filterCont = document.querySelector(".filters");
let imageCanvas = document.querySelector("#image-canvas");
let inputImage = document.querySelector("#image-input");
let canvasCtx = imageCanvas.getContext("2d");
let resetBtn = document.querySelector("#reset-btn");
let downloadBtn = document.querySelector("#download-btn");
let image = null;
let file = null;

// Config se ek slider banata hai; slider badalne par state update karke canvas redraw hota hai.
function createFilterElement(name, value, unit = "%", min, max) {
  let div = document.createElement("div");
  div.classList.add("filter");
  let input = document.createElement("input");
  input.min = min;
  input.type = "range";
  input.max = max;
  input.value = value;
  input.id = name;
  let p = document.createElement("p");
  p.innerText = name;
  input.addEventListener("input", (event) => {
    filters[name].value = input.value;
    applyFilters();
  });
  div.append(p);
  div.append(input);
  return div;
}

// Filters object ke har entry ke liye UI control banata hai.
function createFilters() {
  Object.keys(filters).forEach((filter) => {
    // console.log(filter)
    // console.log(filters[filter])
    const filterEle = createFilterElement(
      filter,
      filters[filter].value,
      filters[filter].unit,
      filters[filter].min,
      filters[filter].max,
    );
    filterCont.append(filterEle);
    console.log(filterCont);
  });
}
createFilters();

// Chuni hui file ko browser image mein decode karke uske natural size ka canvas banata hai.
inputImage.addEventListener("change", (event) => {
  file = event.target.files[0];
  console.log(file);
  document.querySelector(".placeholder").style.display = "none";
  imageCanvas.style.display = "block";
  let img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    imageCanvas.width = img.width;
    image = img;
    imageCanvas.height = img.height;
    canvasCtx.drawImage(img, 0, 0);
  };
});

// Canvas ko saaf karke CSS filter chain ke saath original image dobara draw karta hai.
function applyFilters() {
  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  canvasCtx.filter =
    `brightness(${filters.brightness.value}${filters.brightness.unit})
  contrast(${filters.contrast.value}${filters.contrast.unit})
  saturate(${filters.saturation.value}${filters.saturation.unit})
  hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
  blur(${filters.blur.value}${filters.blur.unit})
  grayscale(${filters.grayscale.value}${filters.grayscale.unit})
  sepia(${filters.sepia.value}${filters.sepia.unit})
  opacity(${filters.opacity.value}${filters.opacity.unit})
  invert(${filters.invert.value}${filters.invert.unit})`.trim();
  canvasCtx.drawImage(image, 0, 0);
}

// Reset default configuration set karta hai aur sliders ko naye values ke saath rebuild karta hai.
resetBtn.addEventListener("click", () => {
  filters = {
    brightness: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },
    contrast: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },

    saturation: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },
    hueRotation: {
      value: 100,
      min: 0,
      max: 360,
      unit: "deg",
    },
    blur: {
      value: 0,
      min: 0,
      max: 20,
      unit: "px",
    },
    grayscale: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
    sepia: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
    opacity: {
      value: 100,
      min: 0,
      max: 100,
      unit: "%",
    },
    invert: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
  };
  applyFilters();
  filterCont.innerHTML = "";
  createFilters();
});

// Canvas ke rendered pixels ko PNG data URL mein badal kar download shuru karta hai.
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "image.png";
  link.href = imageCanvas.toDataURL();
  link.click();
});

// Preset har filter ke liye pehle se chune gaye values ka named collection hai.
const presets = {
  normal: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },

  vintage: {
    brightness: 115,
    contrast: 120,
    saturation: 80,
    hueRotation: 25,
    blur: 1,
    grayscale: 18,
    sepia: 45,
    opacity: 100,
    invert: 0,
  },

  drama: {
    brightness: 95,
    contrast: 160,
    saturation: 110,
    hueRotation: 12,
    blur: 1,
    grayscale: 0,
    sepia: 18,
    opacity: 100,
    invert: 0,
  },

  sepia: {
    brightness: 105,
    contrast: 120,
    saturation: 60,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 80,
    opacity: 100,
    invert: 0,
  },

  "high contrast": {
    brightness: 105,
    contrast: 180,
    saturation: 120,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },

  "soft glow": {
    brightness: 120,
    contrast: 90,
    saturation: 105,
    hueRotation: 0,
    blur: 3,
    grayscale: 8,
    sepia: 10,
    opacity: 96,
    invert: 0,
  },

  "black and white": {
    brightness: 100,
    contrast: 140,
    saturation: 0,
    hueRotation: 0,
    blur: 0,
    grayscale: 100,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },

  "warm tone": {
    brightness: 110,
    contrast: 110,
    saturation: 120,
    hueRotation: 30,
    blur: 0,
    grayscale: 0,
    sepia: 20,
    opacity: 100,
    invert: 0,
  },

  "cool tone": {
    brightness: 95,
    contrast: 115,
    saturation: 75,
    hueRotation: 200,
    blur: 0,
    grayscale: 10,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },

  dreamy: {
    brightness: 125,
    contrast: 90,
    saturation: 85,
    hueRotation: 45,
    blur: 3,
    grayscale: 5,
    sepia: 18,
    opacity: 92,
    invert: 0,
  },
};

// Preset button state update karta hai aur controls/preview ko sync karta hai.
Object.keys(presets).forEach((presetName) => {
  let presetBtn = document.createElement("button");
  presetBtn.classList.add("btn");

  presetBtn.innerText = presetName;
  presetCont.append(presetBtn);
  presetBtn.addEventListener("click", () => {
    const presetFilters = presets[presetName];
    Object.keys(presetFilters).forEach((filterName) => {
      filters[filterName].value = presetFilters[filterName];
    });
    applyFilters();
    filterCont.innerHTML = "";
    createFilters();
  });
});
