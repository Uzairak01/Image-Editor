    let filters = {
        brightness: {
            value: 100,
            min: 0,
            max: 200,
            unit: '%',
        },
        contrast: {
            value: 100,
            min: 0,
            max: 200,
            unit: '%',
        },
        saturation: {
            value: 100,
            min: 0,
            max: 200,
            unit: '%',
        },
        hueRotation: {
            value: 0,
            min: 0,
            max: 360,
            unit: 'deg',
        },
        blur: {
            value: 0,
            min: 0,
            max: 100,
            unit: 'px',
        },
        grayscale: {
            value: 0,
            min: 0,
            max: 100,
            unit: '%',
        },
        sepia: {
            value: 0,
            min: 0,
            max: 100,
            unit: '%',
        },
        opacity: {
            value: 100,
            min: 0,
            max: 100,
            unit: '%',
        },
        invert: {
            value: 0,
            min: 0,
            max: 100,
            unit: '%',
        },
    }

const imageCanvas = document.querySelector("#image-canvas")
const imgInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const resetBtn = document.querySelector("#reset-btn")
const downloadBtn = document.querySelector("#download-btn")
const presetsContainer = document.querySelector(".presets")
let file = null
let image = null

const filtersContainer = document.querySelector(".filters")

function createFilterElement(name, unit = '%', value,  min, max) {
    const div = document.createElement('div');
    div.classList.add('filter');

    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = value;
    
    const p = document.createElement('p');
    p.innerText = name

    div.appendChild(p);
    div.appendChild(input);

    input.addEventListener("input", (event)=>{
        filters[name].value = input.value
        applyFilters()
    })

    return div;
}

function createFilters(){
    Object.keys(filters).forEach(key => {
        const  filterElement = createFilterElement(key, filters[key].unit, filters[key].value, filters[key].min, filters[key].max)
        filtersContainer.appendChild(filterElement)
    });

    imgInput.addEventListener("change", (event) =>{
        const file = event.target.files[0]
        const imagePlaceholder = document.querySelector(".placeholder")
        imageCanvas.style.display = "block"
        imagePlaceholder.style.display = "none"

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
            imageCanvas.width = img.width
            imageCanvas.height = img.height
            canvasCtx.drawImage(img, 0, 0)
        }
    });
}
createFilters()

function applyFilters(){
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    canvasCtx.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit}) 
        contrast(${filters.contrast.value}${filters.contrast.unit}) 
        saturation(${filters.saturation.value}${filters.saturation.unit}) 
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit}) 
        blur(${filters.blur.value}${filters.blur.unit}) 
        grayscale(${filters.grayscale.value}${filters.grayscale.unit}) 
        sepia(${filters.sepia.value}${filters.sepia.unit}) 
        opacity(${filters.opacity.value}${filters.opacity.unit}) 
        invert(${filters.invert.value}${filters.invert.unit})
    `
    canvasCtx.drawImage(image, 0, 0)
}

resetBtn.addEventListener("click", () => {
    filters = {
    brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: '%',
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: '%',
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: '%',
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: 'deg',
    },
    blur: {
        value: 0,
        min: 0,
        max: 100,
        unit: 'px',
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: '%',
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: '%',
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: '%',
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: '%',
    },
}
    applyFilters()
    filtersContainer.innerHTML = ""
    createFilters()
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = imageCanvas.toDataURL()
    link.click()
});

const filterPresets = {
    original: {
        brightness: 100, contrast: 100, saturation: 100, hueRotation: 0,
        blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0
    },
    drama: {
        brightness: 110,
        contrast: 140,      // High contrast for impact
        saturation: 85,     // Slightly desaturated for a moody look
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    vintage: {
        brightness: 95,     // Slightly faded
        contrast: 90,       // Softened shadows
        saturation: 80,     // Muted colors
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 30,          // Warm, aged tint
        opacity: 100,
        invert: 0
    },
    noir: {
        brightness: 100,
        contrast: 150,      // Stark contrast between blacks and whites
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,     // Full black and white
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    cyberpunk: {
        brightness: 110,
        contrast: 120,
        saturation: 160,    // Intensely vivid colors
        hueRotation: 320,   // Shifts hues toward neon pinks and purples
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    fadedDream: {
        brightness: 120,    // Overexposed look
        contrast: 80,       // Low contrast, very soft
        saturation: 90,
        hueRotation: 10,    // Subtle warm shift
        blur: 1,            // Tiny bit of dreamlike blur
        grayscale: 0,
        sepia: 10,
        opacity: 100,
        invert: 0
    },
    coolElevated: {
        brightness: 105,
        contrast: 110,
        saturation: 110,
        hueRotation: 190,   // Shifts tones slightly toward a clean, cool blue
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    warmSun: {
        brightness: 105,
        contrast: 105,
        saturation: 125,    // Pops the colors
        hueRotation: 15,    // Shifts colors slightly toward warm golds/oranges
        blur: 0,
        grayscale: 0,
        sepia: 15,          // Adds a gentle sun-kissed warmth
        opacity: 100,
        invert: 0
    },
    cinematic: {
        brightness: 95,     // Slightly pulled back for a theatrical feel
        contrast: 125,      // Richer shadows
        saturation: 110,
        hueRotation: 180,   // Cools down the green/blue tones slightly
        blur: 0,
        grayscale: 0,
        sepia: 5,           // Melds with the hue shift for a teal-and-orange vibe
        opacity: 100,
        invert: 0
    },
    popArt: {
        brightness: 110,
        contrast: 150,      // Harsh separation of lighting
        saturation: 200,    // Maxed out, hyper-vibrant colors
        hueRotation: 90,    // Complete color distortion/shift
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    xRay: {
        brightness: 120,
        contrast: 130,
        saturation: 0,      // Strips color away
        hueRotation: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 100         // Completely flips light and dark values
    },
    matteMinimal: {
        brightness: 115,    // Brightens the whites
        contrast: 85,       // Flattens the image for a clean look
        saturation: 75,     // Subdued, pastel-like colors
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },
    oldNewspaper: {
        brightness: 90,
        contrast: 140,      // Sharp, ink-like shadows
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,     // Removes all color
        sepia: 40,          // Heavy yellowing of the paper
        opacity: 100,
        invert: 0
    }
};

Object.keys(filterPresets).forEach(presetName => {
    const presetBtn = document.createElement("button")
    presetBtn.classList.add("btn")
    presetBtn.innerText = presetName

    presetBtn.addEventListener("click", () => {
        applyFilter(filterPresets[presetName])

        Object.keys(filterPresets[presetName]).forEach(filterKey => {
            filters[filterKey].value = filterPresets[presetName][filterKey]
        });
        filtersContainer.innerHTML = ""
        createFilters()
    })
    presetsContainer.appendChild(presetBtn)
})