// --- 1. STATE & PRESETS ---
const filters = {
    brightness: { value: 100, min: 0, max: 200, unit: '%' },
    contrast: { value: 100, min: 0, max: 200, unit: '%' },
    saturation: { value: 100, min: 0, max: 200, unit: '%' },
    hueRotation: { value: 0, min: 0, max: 360, unit: 'deg' },
    blur: { value: 0, min: 0, max: 100, unit: 'px' },
    grayscale: { value: 0, min: 0, max: 100, unit: '%' },
    sepia: { value: 0, min: 0, max: 100, unit: '%' },
    opacity: { value: 100, min: 0, max: 100, unit: '%' },
    invert: { value: 0, min: 0, max: 100, unit: '%' },
};

const filterPresets = {
    original:     { brightness: 100, contrast: 100, saturation: 100, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    drama:        { brightness: 110, contrast: 140, saturation: 85, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    vintage:      { brightness: 95, contrast: 90, saturation: 80, hueRotation: 0, blur: 0, grayscale: 0, sepia: 30, opacity: 100, invert: 0 },
    noir:         { brightness: 100, contrast: 150, saturation: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 0, opacity: 100, invert: 0 },
    cyberpunk:    { brightness: 110, contrast: 120, saturation: 160, hueRotation: 320, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    fadedDream:   { brightness: 120, contrast: 80, saturation: 90, hueRotation: 10, blur: 1, grayscale: 0, sepia: 10, opacity: 100, invert: 0 },
    coolElevated: { brightness: 105, contrast: 110, saturation: 110, hueRotation: 190, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    warmSun:      { brightness: 105, contrast: 105, saturation: 125, hueRotation: 15, blur: 0, grayscale: 0, sepia: 15, opacity: 100, invert: 0 },
    cinematic:    { brightness: 95, contrast: 125, saturation: 110, hueRotation: 180, blur: 0, grayscale: 0, sepia: 5, opacity: 100, invert: 0 },
    popArt:       { brightness: 110, contrast: 150, saturation: 200, hueRotation: 90, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    xRay:         { brightness: 120, contrast: 130, saturation: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 0, opacity: 100, invert: 100 },
    matteMinimal: { brightness: 115, contrast: 85, saturation: 75, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    oldNewspaper: { brightness: 90, contrast: 140, saturation: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 40, opacity: 100, invert: 0 }
};

// --- 2. DOM ELEMENTS & VARIABLES ---
const imageCanvas = document.querySelector("#image-canvas");
const canvasCtx = imageCanvas.getContext("2d");
const imgInput = document.querySelector("#image-input");
const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");
const presetsContainer = document.querySelector(".presets");
const filtersContainer = document.querySelector(".filters");

let image = null;

// --- 3. CORE FUNCTIONS ---

// Renders the image with current filters
function applyFilters() {
    if (!image) return;

    const ctx = canvasCtx;

    // Clear canvas
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    // Build clean filter string
    const filterString = [
        `brightness(${filters.brightness.value}%)`,
        `contrast(${filters.contrast.value}%)`,
        `saturate(${filters.saturation.value}%)`,
        `hue-rotate(${filters.hueRotation.value}deg)`,
        `blur(${filters.blur.value}px)`,
        `grayscale(${filters.grayscale.value}%)`,
        `sepia(${filters.sepia.value}%)`,
        `opacity(${filters.opacity.value}%)`,
        `invert(${filters.invert.value}%)`
    ].join(' ');

    ctx.filter = filterString;

    // Draw image with filters
    ctx.drawImage(image, 0, 0, imageCanvas.width, imageCanvas.height);

    // Reset filter after drawing (good practice)
    ctx.filter = 'none';
}

// Updates state, applies changes, and moves sliders to match
function loadPreset(presetObj) {
    Object.keys(presetObj).forEach(key => {
        filters[key].value = presetObj[key]; // Update state
        
        // Update the visual slider in the UI without re-creating it
        const inputElement = document.querySelector(`#input-${key}`);
        if (inputElement) inputElement.value = presetObj[key];
    });
    applyFilters();
}

// --- 4. UI GENERATION ---

// Build the sliders dynamically
function createFilterSliders() {
    filtersContainer.innerHTML = "";
    Object.keys(filters).forEach(key => {
        const div = document.createElement('div');
        div.classList.add('filter');

        const label = document.createElement('p');
        label.innerText = key; // E.g., 'brightness'

        const input = document.createElement('input');
        input.type = 'range';
        input.id = `input-${key}`; // Assign ID for easy updating later
        input.min = filters[key].min;
        input.max = filters[key].max;
        input.value = filters[key].value;

        input.addEventListener("input", () => {
            filters[key].value = input.value;
            applyFilters();
        });

        div.appendChild(label);
        div.appendChild(input);
        filtersContainer.appendChild(div);
    });
}

// Build the preset buttons dynamically
function createPresetButtons() {
    presetsContainer.innerHTML = "";
    Object.keys(filterPresets).forEach(presetName => {
        if (presetName === 'original') return; // Handled by Reset button

        const presetBtn = document.createElement("button");
        presetBtn.classList.add("btn");
        presetBtn.innerText = presetName;

        presetBtn.addEventListener("click", () => {
            loadPreset(filterPresets[presetName]);
        });
        
        presetsContainer.appendChild(presetBtn);
    });
}

// --- 5. EVENT LISTENERS ---

// Handle image upload
imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imagePlaceholder = document.querySelector(".placeholder");
    if (imagePlaceholder) imagePlaceholder.style.display = "none";
    imageCanvas.style.display = "block";

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        image = img; // Assign global image variable
        
        loadPreset(filterPresets.original); // Draw clean image
    };
});

// Handle reset
resetBtn.addEventListener("click", () => {
    loadPreset(filterPresets.original);
});

// Handle download
downloadBtn.addEventListener("click", () => {
    if (!image) return;
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});

// --- 6. INITIALIZE ---
createFilterSliders();
createPresetButtons();