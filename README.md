# SEC Company Shares Outstanding Viewer

This is a single-page web application designed to fetch and display common stock shares outstanding data for companies from the SEC EDGAR API. It specifically filters for data from fiscal years after 2020, presenting the maximum and minimum share counts found within that filtered set.

## Features

-   **Dynamic Data Fetching**: Retrieves company concept data directly from the SEC EDGAR API.
-   **Default Company**: Displays data for Broadcom (CIK 0001730168) by default, loading from the local `data.json` file.
-   **Custom Company Lookup**: Supports looking up data for any other publicly traded company by appending a CIK query parameter to the URL (e.g., `index.html?CIK=0001018724`).
-   **Filtered Data**: Only considers shares outstanding data for fiscal years greater than 2020.
-   **Max/Min Values**: Clearly presents the maximum and minimum share outstanding values along with their corresponding fiscal years.
-   **Responsive Design**: A basic, clean visual layout suitable for quick information consumption.

## How to Run

1.  **Save Files**: Save all the provided files (`index.html`, `script.js`, `style.css`, `data.json`, `README.md`, `LICENSE`, `uid.txt`) into a single directory.
2.  **Open `index.html`**: Open the `index.html` file in your web browser.

    -   By default, it will load data for **Broadcom (CIK 0001730168)** from the local `data.json` file.

3.  **View Other Companies**: To view data for a different company, append `?CIK=` followed by the company's 10-digit Central Index Key (CIK) to the URL in your browser's address bar. For example, to view Apple Inc. data (CIK 0000320193):
    `file:///path/to/your/files/index.html?CIK=0000320193`
    (Replace `file:///path/to/your/files/` with the actual path to your `index.html` file, or serve it via a local web server for a cleaner URL.)

    *Note on CIKs:* The application will attempt to zero-pad shorter CIKs to 10 digits for API compatibility.

### Important Note on CORS and User-Agent

-   When fetching data for a `?CIK=` parameter (i.e., not the default Broadcom CIK), the application uses a public CORS proxy (`https://api.allorigins.win/raw?url=`) to bypass Cross-Origin Resource Sharing (CORS) restrictions that browsers impose on direct API calls to `data.sec.gov` from a different origin. 
-   The SEC guidance requires a descriptive `User-Agent` header for API requests. While `script.js` attempts to set this header, generic CORS proxies like AllOrigins may not forward custom `User-Agent` headers to the target server. In such cases, the `User-Agent` will be set by the proxy itself. For direct requests (when loading the default Broadcom data via `data.json`), the `User-Agent` is not directly sent to the SEC API from the client, as `data.json` is a local file.

## Project Structure

-   `index.html`: The main HTML file for the web application.
-   `script.js`: Contains the JavaScript logic for fetching data, processing it, and updating the DOM.
-   `style.css`: Provides basic styling for the application.
-   `data.json`: Contains the pre-processed share outstanding data for Broadcom (CIK 0001730168) for fiscal years > 2020, as required by the brief. This file serves as the initial data source for the default CIK.
-   `README.md`: This file, describing the application and how to use it.
-   `LICENSE`: The full text of the MIT License.
-   `uid.txt`: An attached unique identifier file.
