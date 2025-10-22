const DEFAULT_CIK = '0001730168';
const SEC_API_BASE = 'https://data.sec.gov/api/xbrl/companyconcept/';
const USER_AGENT = 'BroadcomSharesApp/1.0 (contact@example.com)';

function formatNumber(num) {
    if (typeof num !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
}

// Function to update DOM elements
function updateDOM(entityName, maxVal, maxFy, minVal, minFy) {
    document.title = `${entityName} Share Outstanding Data`;
    document.getElementById('share-entity-name').textContent = entityName;
    document.getElementById('share-max-value').textContent = formatNumber(maxVal);
    document.getElementById('share-max-fy').textContent = maxFy;
    document.getElementById('share-min-value').textContent = formatNumber(minVal);
    document.getElementById('share-min-fy').textContent = minFy;
}

// Function to handle errors and display them
function displayError(cik, error) {
    console.error(`Error loading data for CIK ${cik}:`, error);
    document.title = `Error Loading Data`;
    document.getElementById('share-entity-name').textContent = `Error loading data for CIK ${cik}. Please check console.`;
    updateDOM('Error', 'N/A', 'N/A', 'N/A', 'N/A'); // Reset values
}

// Function to process raw SEC API data
function processSecData(rawData) {
    const entityName = rawData.entityName;
    const sharesData = rawData.units.shares;

    const filteredShares = sharesData.filter(entry => {
        const fy = parseInt(entry.fy);
        return fy > 2020 && typeof entry.val === 'number';
    });

    if (filteredShares.length === 0) {
        throw new Error("No relevant shares data found for fy > 2020.");
    }

    let maxValEntry = filteredShares[0];
    let minValEntry = filteredShares[0];

    for (let i = 1; i < filteredShares.length; i++) {
        const current = filteredShares[i];
        if (current.val > maxValEntry.val) {
            maxValEntry = current;
        }
        if (current.val < minValEntry.val) {
            minValEntry = current;
        }
    }

    return {
        entityName: entityName,
        maxVal: maxValEntry.val,
        maxFy: String(maxValEntry.fy), // Ensure fy is string
        minVal: minValEntry.val,
        minFy: String(minValEntry.fy)  // Ensure fy is string
    };
}


// Main function to fetch and render data
async function loadData(cik) {
    try {
        if (cik === DEFAULT_CIK) {
            // For the default CIK, load from local data.json
            const response = await fetch('data.json');
            if (!response.ok) {
                // If local data.json not found or error, fall back to live API
                console.warn('data.json not found or failed to load, falling back to live SEC API.');
                await fetchLiveSecData(cik);
                return;
            }
            const data = await response.json();
            updateDOM(data.entityName, data.max.val, data.max.fy, data.min.val, data.min.fy);
        } else {
            // For other CIKs, fetch from live SEC API using a proxy
            await fetchLiveSecData(cik);
        }
    } catch (error) {
        displayError(cik, error);
    }
}

async function fetchLiveSecData(cik) {
    const url = `${SEC_API_BASE}CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`;
    // Using a CORS proxy for cross-origin requests
    // Note: User-Agent header may not be forwarded by generic CORS proxies like AllOrigins.
    const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl, {
        headers: {
            'User-Agent': USER_AGENT // This header is intended for direct SEC requests.
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawData = await response.json();
    const processed = processSecData(rawData);
    updateDOM(processed.entityName, processed.maxVal, processed.maxFy, processed.minVal, processed.minFy);
}


// On page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let cikParam = urlParams.get('CIK');
    let targetCik = DEFAULT_CIK;

    if (cikParam) {
        // Clean and pad CIK to 10 digits for consistency with SEC API.
        const cleanCik = cikParam.replace(/\D/g, '');
        if (cleanCik) {
            targetCik = cleanCik.padStart(10, '0');
        }
    }

    loadData(targetCik);
});
