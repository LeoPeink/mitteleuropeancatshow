/**
 * Stewards Loader Script
 * Dynamically loads steward images and populates the stewards page
 * Automatically discovers images in the img/stewards folder
 */

// List of all steward images - ADD YOUR IMAGES HERE
// Images starting with _ will be used as Capo Steward (e.g., _ElisaGrazzi.jpeg)
// Other images should follow the format: NameSurname.jpg
const STEWARD_IMAGES = [
    '_Elisa Grazzi IT.jpeg',
    'Christian Coltra IT.jpg',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    'Coming Soon!.png',
    // Add more steward images here in the format: 'NameSurname.jpg'
    // Example: 'MarioRossi.jpg', 'GiuliaBianchi.jpg', etc.
];

/**
 * Convert filename to Name and Country format
 * Example: "Christian Coltra IT.jpg" -> { name: "Christian Coltra", country: "IT" }
 * Example: "Mario Rossi.jpg" -> { name: "Mario Rossi", country: null }
 */
function formatName(filename) {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    
    // Remove underscore if present
    const cleanName = nameWithoutExt.replace(/^_/, '');
    
    // Check if the last part (after last space) is a 2-letter country code
    const parts = cleanName.split(' ');
    const lastPart = parts[parts.length - 1];
    
    // If last part is 2 letters (country code), extract it
    if (lastPart && lastPart.length === 2 && /^[A-Z]{2}$/i.test(lastPart)) {
        const country = lastPart.toUpperCase();
        const name = parts.slice(0, -1).join(' ');
        return { name, country };
    }
    
    // No country code found
    return { name: cleanName, country: null };
}

/**
 * Get flag class based on country code
 */
function getFlagClass(countryCode) {
    if (!countryCode) return '';
    
    const countryMap = {
        'IT': 'flag-italy',
        'FR': 'flag-france',
        'DE': 'flag-germany',
        'ES': 'flag-spain',
        'GB': 'flag-uk',
        'UK': 'flag-uk',
        'US': 'flag-usa',
        'AT': 'flag-austria',
        'CH': 'flag-switzerland',
        'NL': 'flag-netherlands',
        'BE': 'flag-belgium',
        'SE': 'flag-sweden',
        'NO': 'flag-norway',
        'DK': 'flag-denmark',
        'FI': 'flag-finland',
        'PL': 'flag-poland',
        'CZ': 'flag-czech',
        'SK': 'flag-slovakia',
        'HU': 'flag-hungary',
        'RO': 'flag-romania',
        'BG': 'flag-bulgaria',
        'GR': 'flag-greece',
        'PT': 'flag-portugal',
        'IE': 'flag-ireland',
        'HR': 'flag-croatia',
        'SI': 'flag-slovenia',
        'RS': 'flag-serbia',
        'RU': 'flag-russia',
        'UA': 'flag-ukraine',
    };
    
    return countryMap[countryCode] || '';
}

/**
 * Load Capo Steward image
 */
function loadCapoSteward() {
    const capoImage = STEWARD_IMAGES.find(img => img.startsWith('_'));
    
    if (capoImage) {
        const capoStewardBubble = document.querySelector('.capo-steward .steward-bubble img');
        const capoStewardName = document.querySelector('.capo-steward .steward-name');
        
        if (capoStewardBubble) {
            capoStewardBubble.src = `img/stewards/${capoImage}`;
            capoStewardBubble.alt = formatName(capoImage);
            capoStewardBubble.onerror = function() {
                this.src = 'img/stewards/_UtenteAnonimo.png';
            };
        }
        
        if (capoStewardName) {
            const { name, country } = formatName(capoImage);
            const flagClass = getFlagClass(country);
            const flagHTML = flagClass ? ` <span class="flag ${flagClass}"></span>` : '';
            capoStewardName.innerHTML = `${name}${flagHTML}`;
        }
        
        console.log(`Loaded Capo Steward: ${formatName(capoImage).name}`);
    } else {
        console.warn('No Capo Steward image found (images starting with _)');
    }
}

/**
 * Create a steward card element
 */
function createStewardCard(imagePath, imageFilename) {
    const { name, country } = formatName(imageFilename);
    const flagClass = getFlagClass(country);
    const flagHTML = flagClass ? ` <span class="flag ${flagClass}"></span>` : '';
    
    const stewardItem = document.createElement('div');
    stewardItem.className = 'steward-item';
    
    stewardItem.innerHTML = `
        <div class="steward-bubble">
            <img src="${imagePath}" alt="${name}" class="steward-photo" onerror="this.src='img/stewards/_UtenteAnonimo.png'">
        </div>
        <h3 class="steward-name">${name}${flagHTML}</h3>
    `;
    
    return stewardItem;
}

/**
 * Load all regular stewards (excluding images starting with _)
 */
function loadStewards() {
    const stewardsGrid = document.querySelector('.stewards-grid');
    
    if (!stewardsGrid) {
        console.error('Stewards grid not found');
        return;
    }
    
    // Clear existing stewards
    stewardsGrid.innerHTML = '';
    
    // Filter out images starting with _ (those are for Capo Steward)
    // Also filter out empty strings
    const regularStewards = STEWARD_IMAGES.filter(img => img && !img.startsWith('_'));
    
    if (regularStewards.length === 0) {
        console.warn('No regular steward images found');
        stewardsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #555;">Aggiungi immagini degli steward alla cartella img/stewards/ nel formato NomeCognome.jpg</p>';
        return;
    }
    
    // Create and append steward cards
    regularStewards.forEach(image => {
        const imagePath = `img/stewards/${image}`;
        const card = createStewardCard(imagePath, image);
        stewardsGrid.appendChild(card);
    });
    
    console.log(`Loaded ${regularStewards.length} regular stewards`);
}

/**
 * Initialize the stewards page
 */
function initStewardsPage() {
    console.log('Initializing stewards page...');
    
    // Load Capo Steward
    loadCapoSteward();
    
    // Load regular stewards
    loadStewards();
    
    console.log('Stewards page initialized successfully');
}

// Run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStewardsPage);
} else {
    initStewardsPage();
}
