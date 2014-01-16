// This JavaScript file is invoked from background.html
// It contains the GsaAdvHelper-specific code for the background page
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

	case 'get-ppp-credentials':
    var credentials;
    if (sessionStorage.ppUserName) {
        credentials.ppUserName = sessionStorage.ppUserName;
    } else if (localStorage.ppUserName) {
        credentials.ppUserName = localStorage.ppUserName;
    } else {
        credentials.ppUserName = 'anonymous';
    }
    if (sessionStorage.ppPassword) {
        credentials.Password = sessionStorage.Password;
    } else if (localStorage.ppUserName) {
        credentials.Password = localStorage.Password;
    } else {
        credentials.Password = 'nopassword';
    }
	sendResponse({ppp-credentials: credentials});
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
// Checks to see if we are on sam.gov
// and shows page action if we are

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
