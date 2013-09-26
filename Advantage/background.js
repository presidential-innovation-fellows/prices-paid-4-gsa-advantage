// This JavaScript file is invoked from background.html
// For details of its behavior, refer to the documentation for Chrome extensions
// This file lives at:

// Handle a command from a user page
// request object properties:
//	"command" : "get-json-from-url" | "signs-of-life"	(maybe more later?)
//	"url": <url-name>	(relative to extension root OR absolute)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.command) {
	case 'get-json-from-url':
	$.getJSON(request.url,  function(data) {
	    sendResponse({result: data});
	});
	break;

	case 'signs-of-life':
	sendResponse({status: "nominal"});
	break;

	default:
	break;
	}
    return true;
    });

// Called when the url of a tab changes.
// Checks to see if we are on gsaadvantage.gov
// and shows page action if we are

checkForValidUrl = function(tabId, changeInfo, tab) {
    var gsaAdvUrl = "https://www.gsaadvantage.gov/";
    var taburl = tab.url.substr(0, gsaAdvUrl.length);
    console.log('checking url against https://www.gsaadvantage.gov');
    if (taburl == gsaAdvUrl ) {
      console.log('matchie!');
      // ... show the page action. 
      chrome.pageAction.show(tabId);
    }
};  
	  
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
