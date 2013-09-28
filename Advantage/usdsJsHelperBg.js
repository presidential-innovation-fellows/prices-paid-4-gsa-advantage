// This JavaScript file is to be invoked from background.html
// Include it if the helper extension needs any of the supplied functions
// For details of its behavior, refer to the documentation for Chrome extensions
// This file lives at:

var $;

var UsdsJsChromeBg = function() {
    'use strict';
};

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
