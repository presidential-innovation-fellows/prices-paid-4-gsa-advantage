//
// This file lives at:
//

(function() {
    var authToken = null, p3username = null, p3password = null;
    var advantage = {
        content: {
            addMeToSvcsMenu:
            'See Prices Paid',
            addMeToSortbar1:
            '<h2>Prices Paid</h2><p>Find data on prices paid for <strong>',
            addMeToSortbar2:
            '</strong>.</p><p>Visit the Prices Paid portal for more info.</p>',
            nothing: 'I always forget to skip commas at the end of an object'
        },
        queries: {
            svcsMenu:
            'div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]',
            sortbar:
            'div#wrapper div#container div#main table tbody tr td div#sortbarDeptView',
            itemSearch: 'table tr td font strong',
            nothing: 'this is so I dont have to deal with commas'
        }
    };

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
           numRows: numResults,
           search_string: query,
           psc_pattern: '*',
           p3username: p3username,
           p3password: p3password
           };

      $.getJSON( 'https://pricespaid.acquisition.gov/apisolr', jsonReqData, handleSearchResult);
    }

    var searchQuals = [ "Mfr Part No", "Manufacturer", "Disaster Recovery"];
    var authenticated = false;

    function onItemCredsLoaded(data) {
         $(data).insertBefore('div#sectionheader');
         var credentialsBox =
                $('div.adv-helper#credentials');
         var expandedResults =
                $('div.adv-helper#item-results-expanded');
         var visible =
                ($(credentialsBox).css('visibility') === 'visible') ||
                ($(expandedResults).css('visibility') === 'visible');
         $('button#submit-creds').on('click', function() {
            p3username = $('input#userid').val();
            p3password = $('input#userpassword').val();
            // TODO: make a test call using these credentials
            authToken = true;

            credentialsBox.remove();
            executeTemplate(templateMap, 'item');
         });
    }

    function onItemTemplateLoaded(data) {
         var resultsToDisplay = '';
         var hidden = false;
         $(data).insertBefore('div#sectionheader');
         $('p#toggler').click(function() {
            if (hidden === false) {
                $('div#results').slideUp();
                hidden = true;
                $('p#toggler').text('Click Here to Expand');
            }
            else {
                $('div#results').slideDown();
                hidden = false;
                $('p#toggler').text('Click Here to Hide');
            }
         });
         var itemTitle = $(advantage.queries.itemSearch);
         var itemQueryStr = itemTitle.text();

         $('div.adv-helper#item-results-expanded p#search-results').
                text('Searched for "' + itemQueryStr + '"');
         searchMe(itemQueryStr, 3, function (data) {
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
             $('table#item-match-table tbody').
                        html(resultsToDisplay);
             $('td.popup-info').on('click', function () {
                var item = $(this).attr('id');
                var popupContent =
                    '<div class="more-info""><p>' +
                        data[item].longDescription +
                        '</p><p id="click-to-dismiss">' +
                        '&lsaquo;Click to dismiss&rsaquo;</p>' +
                        '</div>';
                    $(popupContent).insertBefore('td.popup-info#' +
                        item);
                $('div.more-info').on('click', function () {
                    $(this).remove();
                });
             });
        });
    }

    function templateLoadFailed( jqXHR, textStatus, errorThrown ) {
        console.log('ajax failed with error: ' + textStatus);
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

    chrome.runtime.sendMessage({
            'command': 'retrieve',
            'keyName': 'p3userName'
        },
        function(response) {
            if (arguments.length === 0) {
                alert('Error talking to background');
            } else {
                if (response.storage !== 'none') {
                    p3username = response.p3username;
                    chrome.runtime.sendMessage({
                            'command': 'retrieve',
                            'keyName': 'p3password'
                        },
                        function(response) {
                            if (arguments.length === 0) {
                                alert(
                                  'chrome.runtime.sendMessage() returned: ' +
                                  lastError);
                            } else {
                                if (response.storage !== 'none') {
                                    password = response.password;
                                    authToken = true;
                                    executeTemplate(templateMap, 'item');
                                }
                            }
                       }
                    );
                }
        }
    });

    $(document).ready(function() {
        if (document.title === "Product Detail") {
            if (authToken === true) {
                executeTemplate(templateMap, 'item');
            } else {
                executeTemplate(templateMap, 'credentials');
            }
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
})();
