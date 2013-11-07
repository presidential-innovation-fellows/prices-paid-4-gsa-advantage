//
// This file lives at:
//

var advantage = {
    content: {
        addMeToSvcsMenu:
        'See Prices Paid',
        addMeToSortbar1:
        '<h2>Prices Paid</h2><p>Find data on prices paid for <strong>',
        addMeToSortbar2:
        '</strong>.</p><p>Visit the Prices Paid portal for more info.</p>',
        nothing: 'I always forgot to add and remove commas at the end of an object'
    },
    queries: {
        svcsMenu:
        'div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]',
        sortbar:
        'div#wrapper div#container div#main table tbody tr td div#sortbarDeptView',
        itemSearch:
        '#main table tr td table tr td table tr td table.black8pt' +
                'tr td table.black8pt tr td table tr td font strong',
        nothing: 'this is so I dont have to deal with commas'
    }
};

function getPppCredFromUser() {
}

function searchMe(query, numResults, resultHandler) {
  function handleSearchResult(dataFromSearch, status, jqXhr) {
    if (dataFromSearch === null || typeof dataFromSearch !== 'object') {
       alert('No results returned.');
       resultHandler([]);
    }
    if (dataFromSearch["status"] &&
	  (dataFromSearch[0]["status"] == "BadAuthentication")) {
      alert('Unable to Authenticate. ' +
	    'Perhaps your session timed-out. Please log in again.');  
       resultHandler([]);
    }
    resultHandler(dataFromSearch);
  }

  var jsonReqData =  {
       p3username: ppSecrets.serviceUsername,
       p3password: ppSecrets.servicePassword,
       numRows: numResults,
       search_string: query,
       psc_pattern: '*'
       };

  $.getJSON( ppSecrets.ppUrl, jsonReqData, handleSearchResult);
}

var searchQuals = [ "Mfr Part No", "Manufacturer", "Disaster Recovery"];
var authenticated = false;

function onItemCredsLoaded(data) {
     $(data).insertBefore('div.adv-helper#item-results-expanded');
     var credentialsBox =
            $('div.adv-helper#credentials');
     var expandedResults =
            $('div.adv-helper#item-results-expanded');
     var visible =
            ($(credentialsBox).css('visibility') === 'visible') ||
            ($(expandedResults).css('visibility') === 'visible');
     $('button#submit-creds').on('click', function() {
        authenticated = true;
        credentialsBox.css({"visibility": "hidden",
                    "position": "absolute"});
        expandedResults.css({"visibility": "visible",
                    "position": "static"});
     });
      $('div#item-results-toggler p#toggler').on('click', function() {
        visible =
            ($(credentialsBox).css('visibility') === 'visible') ||
            ($(expandedResults).css('visibility') === 'visible');
        if (visible) {
            credentialsBox.css({"visibility": "hidden",
                            "position": "absolute"});
            expandedResults.css({"visibility": "hidden",
                            "position": "absolute"});
            $(this).text('Click to show.');
        } else {
            if (authenticated) {
                credentialsBox.css({"visibility": "hidden",
                                "position": "absolute"});
                expandedResults.css({"visibility": "visible",
                                "position": "static"});
            } else {
                credentialsBox.css({"visibility": "visible",
                                "position": "static"});
                expandedResults.css({"visibility": "hidden",
                                "position": "absolute"});
            }
        $(this).text('Click to hide.');
        }
  });
}

function onItemTemplateLoaded(data) {
     executeTemplate(templateMap, 'credentials');
     var resultsToDisplay;
     $(data).insertBefore('div#sectionheader');
     var itemTitle = $(advantage.queries.itemSearch);
     var itemQueryStr = itemTitle.text();
     var searchParams =
        '<thead id="search-params-header">' +
            '<td>Select</td>' +
            '<td>Qualifier</td>' +
            '<td>Value</td>' +
            '<td></td>' +
            '<td>Select</td>' +
            '<td>Custom Field</td>' +
            '<td>Value</td>' +
        '</thead>';
     $.each(searchQuals, function(index, value) {
        searchParams +=
            '<tr class="search-result-class">' +
                '<td><input type="checkbox"></button></td>' +
                '<td>' +
                    value +
                '</td>' +
                '<td><input type="textfield"></input></td>' +
                '<td></td>' +
                '<td><input type="checkbox"></button></td>' +
                '<td><input type="textfield" placeholder="Custom"></input></td>' +
                '<td><input type="textfield"></input></td>' +
            '<tr>';
     });
          /*
          var credentialsBox =
              $('div.adv-helper#credentials');
          var expandedResults =
              $('div.adv-helper#item-results-expanded');
      */
     $('table.item-match-table#params tbody').html(searchParams);

     $('div.adv-helper#item-results-expanded p#search-results').
            text('Searched for "' + itemQueryStr + '"');
     searchMe(buildQueryString(itemQueryStr,
                retrieveSearchParams()),3, function (data) {
         $.each(data, function(index, value) {
              var itemTd = '<td class="search-result-class">';
                  resultsToDisplay +=
                  '<tr class="item-match-row search-result-row">' +
                  itemTd + value.unitPrice + '</td>' +
                  itemTd + value.unitsOrdered + '</td>' +
                  itemTd + value.contractingAgency + '</td>' +
                  itemTd + value.vendor + '</td>' +
                  itemTd + value['Manufacturer Name'] + '</td>' +
                  '<td class="search-result-class popup-info" id="' +
                          index + '">' + 'More&hellip;' + '</td>' + '</tr>';
         });
         $('table.item-match-table#item-match-table tbody').
                    html(resultsToDisplay);
         $('td.popup-info').on('click', function () {
            var item = $(this).attr('id');
            var popupContent =
                '<div class="advantage-popup"><p>' +
                    data[item].longDescription +
                    '</p><p id="click-to-dismiss">' +
                    '&lsaquo;Click to dismiss&rsaquo;</p>' +
                    '</div>';
                $(popupContent).insertBefore('td.popup-info#' +
                    item);
            $('div.advantage-popup').on('click', function () {
                $(this).remove();
            });
         });
    });
}

function buildQueryString(userEntry, extraParams) {
    var queryString = userEntry;

    if (extraParams) {
        $.each(extraParams, function(index, value) {
            queryString += '&' + index + '=' + value;
        });
    }
    return queryString;
}

function retrieveSearchParams() {
    var params = null;
    if (localStorage && localStorage.searchParams) {
        params = JSON.parse(localStorage.searchParams);
    }
    return params;
}

var templateMap = [
                {
                    name: "item",
                    filename: "gsaAdvItemTemplate.html",
                    successHandler: onItemTemplateLoaded,
                    errorHandler: templateLoadFailed
                },
                {
                    name: "credentials",
                    filename: "gsaAdvCredsTemplate.html",
                    successHandler: onItemCredsLoaded,
                    errorHandler: templateLoadFailed
                }
            ];

function templateLoadFailed( jqXHR, textStatus, errorThrown ) {
    console.log('ajax failed with error: ' + textStatus);
}

function executeTemplate(templates, templateName) {
    $.each(templates, function(index, value) {
        if (value.name === templateName) {
            $.ajax({
                type: "GET",
                url: chrome.extension.getURL(value.filename),
                dataType: "html"
                }).done(value.successHandler).
                    fail(value.errorHandler);
            return false;
        }
    });
}

$(document).ready(function() {
    
    // Handle authentication for the PP portal
    // $(advantage.content.userPppCredsGrabber).insertAfter($('div#wrapper'));

    if (document.title === "Product Detail") {
        executeTemplate(templateMap, 'item');
    }
});

//////////////////////////////////////////////////////////////////////////
//
// Functions below this line are not being maintained at the moment
//
//////////////////////////////////////////////////////////////////////////

function addContentBelowSortBar() {
    advantage.insertions.sortbar = $(advantage.queries.sortbar);
    advantage.insertions.sortbar.next().clone()
        .attr("id", "pp-insertion")
        .html(
            advantage.content.addMeToSortbar1
            + advantage.insertions.sortbar.text()
            + advantage.content.addMeToSortbar2)
        .insertAfter(advantage.insertions.sortbar);
}

function addLeftNavItem() {
    $(advantage.queries.svcsMenu)
        .parent().clone().children('a')
        .attr("href", "http://www.google.com")
        .text(advantage.content.addMeToSvcsMenu).parent()
        .insertAfter($(advantage.queries.svcsMenu).parent());
}
