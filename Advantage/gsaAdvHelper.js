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
        + '</div>'
    },
    queries: {
        svcsMenu:
        'div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]',
        sortbar:
        'div#wrapper div#container div#main table tbody tr td div#sortbarDeptView',
        searchresult:
        'body div#wrapper div#container-fluid div#main-alt table tbody tr td table#pagination.pagin',
        listings:
        'div#container-fluid div#main table tbody tr td table tbody tr td table.greybox tbody tr td.greyVertRuleCenter'
    },
    insertions: {}
};

$(document).ready(function() {
    // This is a left menu replacement
    $(advantage.queries.svcsMenu)
        .parent().clone().children('a')
        .attr("href", "http://www.google.com")
        .text(advantage.content.addMeToSvcsMenu).parent()
        .insertAfter($(advantage.queries.svcsMenu).parent());
    
    // This is an insertion below the sort bar
    advantage.insertions.sortbar = $(advantage.queries.sortbar);
    advantage.insertions.sortbar.next().clone()
        .attr("id", "pp-insertion")
        .html(
            advantage.content.addMeToSortbar1
            + advantage.insertions.sortbar.text()
            + advantage.content.addMeToSortbar2)
        .insertAfter(advantage.insertions.sortbar);

    // This is an insertion in the search results
    $(advantage.queries.searchresult).next().clone().attr("class", "search-result")
        .html(advantage.content.searchResultHeader
          + advantage.content.searchResultItem1
          + chrome.extension.getURL("images/jpf.png")
          + advantage.content.searchResultItem2
          + advantage.content.searchResultItem1
          + chrome.extension.getURL("images/robert.png")
          + advantage.content.searchResultItem2
          + advantage.content.searchResultItem1
          + chrome.extension.getURL("images/greg.png")
          + advantage.content.searchResultItem2
          + advantage.content.searchResultFooter)
        .insertAfter( advantage.queries.searchresult);

    // This is an insertion in to the item display
    var origPrice, ppListingQ, ppNewListing, ppListingItems, diamond, newDiamond;
    ppListingQ = $(advantage.queries.listings).parent();
    ppNewListing = ppListingQ.clone().attr("id","pp-recommendation");
    ppListingItems = ppListingQ.children('td[class!="greyVertRuleCenter"]');
    origPrice = parseFloat(ppListingItems.children('strong').first().text().substr(1));
    ppListingItems.children('strong').text('$' + (0.87 * origPrice).toFixed(2));
    diamond = $(ppListingItems.selector + 'span.black10pt font a').first();
    diamond.clone().insertAfter(diamond).children('img').attr("src", chrome.extension.getURL("images/pp-diamond-icon.gif"));
    ppNewListing.insertAfter(ppListingQ);
});
