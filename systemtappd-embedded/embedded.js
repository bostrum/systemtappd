function extractDynamicPart(htmlContent) {
    var match = htmlContent.match(/_next\/static\/([^\/]+)\/_buildManifest\.js/);
    return match ? match[1] : null;
}

function getBeer() {
    console.log("SYSTEMTAPPD: Button Clicked");
    const currentURL = window.location.href;
    fetch(currentURL)
        .then(response => response.text())
        .then(htmlContent => {
            var dynamicPart = extractDynamicPart(htmlContent);
            var productNameMatch = currentURL.match(/\/([^\/]+)\/$/);
            var productName = productNameMatch ? productNameMatch[1] : null;

            if (dynamicPart && productName) {
                var jsonURL = 'https://www.systembolaget.se/_next/data/' + dynamicPart + '/produkt/ol/' + productName + '.json';
                fetch(jsonURL)
                    .then(response => response.json())
                    .then(data => {
                        var title = data.pageProps.seo.openGraph.title.toLowerCase().replace(/\s+/g, '+');
                        console.log('SYSTEMTAPPD: Logging:', title);

                        var untappdURL = 'https://untappd.com/search?q=' + title;
                        window.open(untappdURL, '_blank');
                    })
                    .catch(error => {
                        alert("Could not fetch JSON from Systembolaget with link: " + jsonURL);
                        console.error('SYSTEMTAPPD: Error fetching JSON:', error);
                    });
            } else {
                alert("Dynamic part extraction failed or product name not found.");
                console.error('SYSTEMTAPPD: Failed to extract dynamic part or match product name.');
            }
        })
        .catch(error => {
            alert("Could not fetch HTML content from the current URL.");
            console.error('SYSTEMTAPPD: Error fetching HTML content:', error);
        });
}

function addButton() {
    const targetElement = document.querySelector('.css-9egk76.enbz1310');
    console.log('SYSTEMTAPPD: Target element:', targetElement);

    if (targetElement) {
        const brElement = document.createElement('br');
        const newButton = document.createElement('button');
        newButton.textContent = 'Untappd';
        newButton.className = 'css-9egk76 enbz1310';
        newButton.style.backgroundColor = "#ffc000";
        newButton.style.color = "white";

        newButton.addEventListener("mouseover", function() {
            newButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        });

        newButton.addEventListener("mouseout", function() {
            newButton.style.boxShadow = "none";
        });

        newButton.addEventListener('click', () => {
            console.log("SYSTEMTAPPD: Button clicked");
            getBeer();
        });

        targetElement.parentNode.insertBefore(brElement, targetElement.nextSibling);
        targetElement.parentNode.insertBefore(newButton, brElement.nextSibling);
        console.log('SYSTEMTAPPD: New button added');
    } else {
        console.log('SYSTEMTAPPD: Target element not found');
    }
}

// wait until standard button is loaded
function waitForElement(selector, callback) {
    const intervalId = setInterval(() => {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            clearInterval(intervalId);
            callback(targetElement);
        }
    }, 100);
}

// history navigation back/forward
window.addEventListener('popstate', function() {
    console.log('SYSTEMTAPPD: Page history changed, reinitializing button');
    waitForElement('.css-9egk76.enbz1310', addButton);
});

// initial check and add
waitForElement('.css-9egk76.enbz1310', addButton);
