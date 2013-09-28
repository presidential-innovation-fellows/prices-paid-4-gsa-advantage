// This JavaScript file is invoked from background.html
// It contains the GsaAdvHelper-specific code for the background page
// For details of its behavior, refer to the documentation for Chrome extensions
// This file lives at:

// Enable page action if we load a matching page
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = "https://www.gsaadvantage.gov/";
    console.log('url: ' + url + '\nurl.length: ' + url.length
        + '\nnew url: ' + tab.url
        + '\nclipped new url: ' + tab.url.substr(0, url.length));
    if (tab.url.substr(0, url.length) === url ) {
      chrome.pageAction.show(tabId);
    }
});
