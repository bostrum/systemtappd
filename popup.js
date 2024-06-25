console.log("Logging: Start");

function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        var currentTabURL = currentTab.url;
        callback(currentTabURL);
    });
}

function extractDynamicPart(htmlContent) {
    var match = htmlContent.match(/_next\/static\/([^\/]+)\/_buildManifest\.js/);
    return match ? match[1] : null;
}

function getBeer() {
    console.log("Logging: Button Clicked");
    getCurrentTabUrl(function(currentURL) {
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
                            console.log('Logging:', title);

                            var untappdURL = 'https://untappd.com/search?q=' + title;
                            window.open(untappdURL, '_blank');
                        })
                        .catch(error => {
                            alert("Could not fetch JSON from Systembolaget with link: " + jsonURL);
                            console.error('Logging: Error fetching JSON:', error);
                        });
                } else {
                    alert("Dynamic part extraction failed or product name not found.");
                    console.error('Logging: Failed to extract dynamic part or match product name.');
                }
            })
            .catch(error => {
                alert("Could not fetch HTML content from the current URL.");
                console.error('Logging: Error fetching HTML content:', error);
            });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchUntappd").addEventListener("click", getBeer);
});

function addUntappdButton() {
    var varukorgButton = document.querySelector('.css-1vauawh.e18r2tjj0');
    var newButton = document.createElement('button');
    newButton.textContent = 'Sök på Untappd';
    newButton.style.backgroundColor = 'yellow';
    newButton.style.marginTop = '10px'; // Adjust margin as needed
    varukorgButton.parentNode.appendChild(newButton);
  }

  // Call the function to add the button
  addUntappdButton();