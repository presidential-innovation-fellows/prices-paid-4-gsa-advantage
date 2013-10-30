//
// This file lives at:
//

var advantage = {
    tags: {
        itemSrchResContainer:
            '<div class="adv-helper" id="item-results-container">',
        itemSrchResCollapsed:
            '<div class="adv-helper" id="item-results-collapsed">',
        itemSrchResExpanded:
            '<div class="adv-helper" id="item-results-expanded">',
        itemSrchResTopContent:
            '<div class="adv-helper" id="item-results-top-content">',
        itemSrchResBottomContent:
            '<div class="adv-helper" id="item-results-bottom-content">',
        itemSrchResTable:
            '<div class="adv-helper" id="item-results-table">',
        itemSrchResTblHdrLine:
              '<theader class="item-match-row search-result-row">' +
              '<td class="item-match-data search-result-data" colspan=0>',

        itemSrchResTblHdrRow:
              '<theader class="item-match-row search-result-row">',
        itemSrchResTblHdrData:
	          '<td class="item-match-data search-result-data" colspan=0>',

        itemSrchResTblRow:
	          '<tr class="item-match-row search-result-row">',

        itemSrchResTblVerRule:
	          '<td valign="middle" bgcolor="#AAAAFF"' +
	          'class="greyVertRuleCenter">&nbsp;</td>',

        nothing: 'so I dont mess up commas'
    },

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

$(document).ready(function() {


    // This is a left menu replacement
    $(advantage.queries.svcsMenu)
        .parent().clone().children('a')
        .attr("href", "http://www.google.com")
        .text(advantage.content.addMeToSvcsMenu).parent()
        .insertAfter($(advantage.queries.svcsMenu).parent());
    
    // Handle authentication for the PP portal
    // $(advantage.content.userPppCredsGrabber).insertAfter($('div#wrapper'));

    // This is an insertion below the sort bar

    /*
     * For now don't do this

    advantage.insertions.sortbar = $(advantage.queries.sortbar);
    advantage.insertions.sortbar.next().clone()
        .attr("id", "pp-insertion")
        .html(
            advantage.content.addMeToSortbar1
            + advantage.insertions.sortbar.text()
            + advantage.content.addMeToSortbar2)
        .insertAfter(advantage.insertions.sortbar);

     */


    // This is an insertion in the search results
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

    var tags = advantage.tags;
    var listingHeader =
	$(advantage.queries.itemMatch).has('tr td input[checked="checked"]').
            children('tbody').children('tr:first-child');
	// $(advantage.queries.itemMatch).parent().parent().parent().children('tr:first-child');
    var itemTitle = $(advantage.queries.itemSearch);
    var itemQueryStr = itemTitle.text();
    var itemDetails = itemTitle.parent().parent().parent().next().css('background-color', '#FFBBBB');
    console.log('search for: ' + itemQueryStr);
    searchMe(itemQueryStr,3, function (data) {
      var resultsToDisplay =
          '<tr><td colspan=0>' +
            tags.itemSrchResContainer +
                tags.itemSrchResCollapsed +
                  'Click Here to See Data from Prices Paid Portal' +
                '</div>' +
                tags.itemSrchResExpanded +
                  tags.itemSrchResTblHdrRow +
                  tags.itemSrchResTblHdrData +
                      'Results from searching Prices Paid Portal for '  +
                          itemQueryStr +
                  '</td></th>' +
                  tags.itemSrchResTblHdrRow +
                      'Results from searching Prices Paid Portal for '  +
                          itemQueryStr +
                  '</td></th>' +
                  tags.itemSrchResTblHdrRow +
                      // tags.itemSrchResTblVerRule +
                      // tags.itemSrchResTblData +

                      '<td class="search-result-class">Unit Price</td>' +
                      '<td valign="middle" bgcolor="#AAAAFF"' +
                          'class="greyVertRuleCenter">&nbsp;</td>' +
                      '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
                      '<td class="search-result-class">Contractor</td>' +
                      '<td valign="middle" bgcolor="#AAAAFF"' +
                          'class="greyVertRuleCenter">&nbsp;</td>' +
                      '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
                  'Description</td>' +
                  '</th>';
      $.each(data, function(index, value) {
	resultsToDisplay += '<tr class="item-match-row search-result-row">' +
	  '<td class="item-match-data search-result-data" bgcolor="#AAAAFF"></td>' +
	  '<td valign="middle" bgcolor="#AAAAFF"' +
	  'class="greyVertRuleCenter">&nbsp;</td>' +
	  '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
	  '<td class="search-result-class">' + value.unitPrice + '</td>' +
	  '<td valign="middle" bgcolor="#AAAAFF"' +
	  'class="greyVertRuleCenter">&nbsp;</td>' +
	  '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
	  '<td class="search-result-class">' + value.vendor + '</td>' +
	  '<td valign="middle" bgcolor="#AAAAFF"' +
	  'class="greyVertRuleCenter">&nbsp;</td>' +
	  '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
	  value.productDescription + '</td>' +
	  'class="greyVertRuleCenter">&nbsp;</td>' +
	  '<td align="right" valign="middle" nowrap="nowrap" bgcolor="#AAAAFF">' +
	  '<a href="http://pricespaid.acquisition.gov">More Info</a></td>' +
	  '</tr>';
      });
    resultsToDisplay += '</div></div></td></tr>'
    $(resultsToDisplay).insertBefore(listingHeader);
  });
});
