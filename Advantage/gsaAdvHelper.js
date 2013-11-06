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
        searchResultHeader:
        '<div class="pp-separator">'
            + '<p>Here are results for similar items from the Prices Paid portal.</p>'
        + '</div>',
        searchResultItem1:
           '<div class="pp-search-result">'
            + '<table class="pp-search-result">'
            + '<tr>'
            + '<td><img src="',
        searchResultItem2:
            '" width="100" height="100")></img></td>'
            + '<td>'
            + '<p>We are sorry, but the <strong>Prices Paid</strong> portal is unreachable at present. '
            + 'Please contact Robert Read at the Presidential Innovation Fellowship for assistance.</p>'
            + '</td></tr></table>'
        + '</div>',
        searchResultFooter:
          '<div class="pp-separator">'
            + '<p>Here are results from the basic search.</p>'
        + '</div>',
        userPppCredsGrabber:
            '<div class="modal-dialog-canvas">' +
            '<div class="modal-dialog" id="get-user-creds">' +
            '<div class="modal-dialog-hdr">' +
            '<h2  class="modal-dialog" id="get-user-creds-hdr">' +
            'Login Required' +
            '</h2>' +
            '</div>' +
            '<div class="modal-dialog-body">' +
            '<p class="modal-dialog">' +
            'Please enter your credentials for the Prices Paid Portal' +
            '</p>' +
            '<p class="modal-dialog">' +
            'User Name' +
            '<input type="text" id="ppp-user">user-name</input>' +
            '</p>' +
            '<p class="modal-dialog">' +
            'Password' +
            '<input type="password" id="ppp-password"></input>' +
            '</p>' +
            '<p class="modal-dialog">' +
            '<input type="button" id="ppp-submit-login">Submit</input>' +
            '</p>' +
            '</div>' +
            '</div>' +
            '</div>',
        nothing: 'I always forgot to add and remove commas at the end of an object'
    },
    queries: {
        svcsMenu:
        'div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]',
        sortbar:
        'div#wrapper div#container div#main table tbody tr td div#sortbarDeptView',
        searchresult:
        'body div#wrapper div#container-fluid div#main-alt table tbody tr td table#pagination.pagin',
        listings:
        'div#container-fluid div#main table tbody tr td table ' +
	'tbody tr td table.greybox tbody tr td.greyVertRuleCenter',
	searchCriteria: 'div#criteria a',
	itemSearch: '#main table tr td table tr td table tr td table.black8pt tr td table.black8pt tr td table tr td font strong',
	// itemMatch: 'div#main table tr td table tr td table.greybox tr td input[checked="checked"]',
	itemMatch: 'div#main table tr td table tr td table.greybox',
	nothing: 'this is so I dont have to deal with commas'
    },
    insertions: {}
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
    // data: {
       p3username: ppSecrets.serviceUsername,
       p3password: ppSecrets.servicePassword,
       numRows: numResults,
       search_string: query,
       psc_pattern: '*'
       };
    // },

  $.getJSON( ppSecrets.ppUrl, jsonReqData, handleSearchResult);
}

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
    
function addToSearchResults() {
    var searchStr = $(advantage.queries.searchCriteria).text();
    console.log('search for: ' + searchStr);
    searchMe(searchStr,3, function (data) {
      var resultsToDisplay = '<table id="criteria-search-result">';
      resultsToDisplay += '<tr class="search-result-row">';
      resultsToDisplay += '<td class="search-result-class">';
      resultsToDisplay += 'Description';
      resultsToDisplay += '</td>';
      resultsToDisplay += '<td class="search-result-class">';
      resultsToDisplay += 'Vendor';
      resultsToDisplay += '</td>';
      resultsToDisplay += '<td class="search-result-class">';
      resultsToDisplay += 'Unit Price';
      resultsToDisplay += '</td>';
      resultsToDisplay += '<td class="search-result-class">';
      resultsToDisplay += 'More info';
      resultsToDisplay += '</td>';
      resultsToDisplay += '</tr>';
      $.each(data, function(index, value) {
	resultsToDisplay += '<tr class="search-result-row">';
	resultsToDisplay += '<td class="search-result-class">';
	resultsToDisplay += value.productDescription;
	resultsToDisplay += '</td>';
	resultsToDisplay += '<td class="search-result-class">';
	resultsToDisplay += value.vendor;
	resultsToDisplay += '</td>';
	resultsToDisplay += '<td class="search-result-class">';
	resultsToDisplay += value.unitPrice;
	resultsToDisplay += '</td>';
	resultsToDisplay += '<td class="search-result-class">';
	resultsToDisplay += 'coming soon';
	resultsToDisplay += '</td>';
	resultsToDisplay += '</tr>';
      });
      resultsToDisplay += '</table>';
      console.log(JSON.stringify(data));
      $(advantage.queries.searchresult).
	next().
	clone().
	attr("class", "search-result").
	html(advantage.content.searchResultHeader + resultsToDisplay).
	insertAfter( advantage.queries.searchresult);
      });
}

var templateMap = [
                {
                    name: "item",
                    filename: "gsaAdvItemTemplate.html",
                    successHandler: onItemTemplateLoaded,
                    errorHandler: onItemTemplateLoaded
                }
            ];

function onItemTemplateLoaded(data) {
    var resultsToDisplay;
     $(data).insertBefore('div#sectionheader');
     var itemTitle = $(advantage.queries.itemSearch);
     var itemQueryStr = itemTitle.text();
     $('div.adv-helper#item-results-expanded p').text('Searched for "' +
                itemQueryStr + '"');
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
          var expandedResults =
              $('div.adv-helper#item-results-expanded');
          $('div#item-results-toggler p#toggler').on('click', function() {
            if ($(expandedResults).css('visibility') === 'visible') {
                expandedResults.css({"visibility": "hidden",
                                "position": "absolute"});
                $(this).text('Click to show.');
            } else {
                expandedResults.css({"visibility": "visible",
                                "position": "static"});
                $(this).text('Click to hide.');
            }
      });
    });
}

function onItemTemplateError( jqXHR, textStatus, errorThrown ) {
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
/*

         // Handle user actions: open/close portal view, ...
         */

$(document).ready(function() {
    
    // Handle authentication for the PP portal
    // $(advantage.content.userPppCredsGrabber).insertAfter($('div#wrapper'));

    if (document.title === "Product Detail") {
        executeTemplate(templateMap, 'item');
    }
});
