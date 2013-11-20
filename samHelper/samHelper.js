// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the SAM application
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper
//
// It requires usdsJsHelper.js be loaded before execution

if (!(localStorage.helperMode && localStorage.helperMode !== 'help')) {
$(document).ready(function() {
    // define the insertion points
    var usdsJsHelper = new UsdsJsHelper();
    var insertionPoints = {
        samInsertionPoint: $('#UIPortalApplication'),
        busa_main_div: $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>'),
        busa_toggle_div:
        $('<div class="busa" id="busa-toggle-div"><p><a href="#" id="busa-toggle">Minimize the SAM Helper</a></p></div>'),
        quickHintDiv:
            $('<div class="quick_hint" id="display-hover-text"></div>'),
        progressDiv: $('<div class="progress" id="progress"></div>')
    };
    
    // insertionPoints.busa_main_div.insertBefore(insertionPoints.samInsertionPoint);
    $('body').prepend('<div id="help-shadow"></div>');
    $('body').prepend(insertionPoints.busa_toggle_div);
    insertionPoints.quickHintDiv.insertAfter(insertionPoints.busa_toggle_div);
    $('div#help-shadow').css({'height':
            $('div.busa#busa-main').css('height')});

    if (sessionStorage.getItem("visible") == null) {
    	sessionStorage.setItem("visible", 'true');
    }

    // contextual page info
    var page_name = $('div.page_heading').text();
    if (page_name) {
        page_name += $('div.sub_heading').text();
    } else {
        page_name = 'SAM.gov';
        $('div#busa-main').hide();
    }

    var pageToken = page_name.replace(/[^A-Za-z0-9]/g, '_');

    // insert the DIVs into the DOM
    var fields, contentItems, progress;

    // Get the field data (for now, from a file, someday from MO server)
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:8124/page?site_name=samHelper&page_name=' + pageToken,
        dataType: "json"
    }).done(function(msg) {
      usdsJsHelper.loadFieldHandlersForPage(msg);
      progress = msg.progress;
      // progress = usdsJsHelper.progressForPage(pageToken, msg);
    // Get the content for the help items
    var pageContent;
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL("samHelper.html"),
        dataType: "html"
    }).done( function(data) {
        pageContent = usdsJsHelper.contentForPgItm(data, pageToken);
        if (msg.page_help) {
            overviewText = '<div class="helper_item overview"' +
            'title="overview_text"><p>' +
            msg.page_help +
            '</p></div>';
        } else if ((pageContent !== undefined) && (pageContent.overview_text !== undefined)) {
            overviewText = pageContent.overview_text.outerHTML;
        } else {
            overviewText = ' ';
        }
        var siteStuff =
        usdsJsHelper.contentForPgItm(data, 'site_info');
        $(siteStuff.site).insertBefore(insertionPoints.samInsertionPoint);
        $('tbody tr.site_help_table_row#site_help_table_row ' +
                        'td.site_help_table_item#page_section').
                    html(overviewText);
        var siteInfo ='<div class="helper_item help_info" title="help">' +
            '<dl>' +
            '<dt><p>Get Help:</p><p>Email</dt>' +
            '<dd>' +
            '<a href="mailto:sam-help@gsa.gov">' +
            'sam-help@gsa.gov</a>' +
            '</dd>' +
            '<dd>' +
            '1-800-xxx-xxxx</a>' +
            '</dd>' +
            '</dl>' +
            '</div>';
        $('tbody tr.site_help_table_row#site_help_table_row ' +
                        'td.site_help_table_item#site_section').
                    html(siteInfo);
        $('tbody tr.site_help_table_row#site_help_table_row ' +
                        'td.site_help_table_item#progress_section').
                    html('<p>Progress:</p><p>' + progress + '%</p>');

        $('dd#button-me').html( '<button id="view-workflow" name="show-mo" type="button">View</button>');
        $('dd#button-me').click(function() {
            $(window.open('', 'workflow',
                'location=no, height=600, width=600').document.body).html(sessionStorage.processMap);
        });
        $('dd#wiz-me').
            html( '<button id="launch-wizard" name="launch-wizard" type="button">Take me to the Wizard</button>');
        $('dd#wiz-me').click(function() {
            $(window.open('', 'wizard',
                'location=no, height=600, width=600').document.body).html("I will be your wizard");
        });
        if (progress === undefined) {
            progress = 'calculating';
        }
    }).fail(function(jqXHR, textStatus) {
        alert('failed to read page content');
    });

    /*
    // you could even blank out wrong choices!
    if (pageToken === 'Create_an_AccountChoose_Account_Type_') {
        $('div.sub_heading').text("");
        $('div.search_entity_results_div2').filter(function() {
              return $(this).css('float') == 'right';
        }).remove();
        /* this version would put an alpha mask over the square
        var hideSysAccount = $('<div class="mask-this">xxxx</div>');
        $(hideSysAccount).css({
            "position": "absolute",
            "border": "2px solid blue",
            "padding": "0px",
            "margin": "0px",
            "background-color": "rgba(0,0,128,0.6)",
            "width":"inherit",
            "height": "inherit"
        });
        var itemToHide = $('div.search_entity_results_div2').filter(function() {
                          return $(this).css('float') == 'right';
                                         });
        itemToHide.prepend($(hideSysAccount));
    }
         */
    // read the JSON workflow data
    sessionStorage.processMap = '{}';
    $.getJSON('http://mo.tynsax.com/api/operations/sam-system-of-award-management-registration-process/map',
    		function(data) {
	sessionStorage.processMap = JSON.stringify(data);
    });

    // define toggle/click/slide behavior
    $('#busa-toggle').click(function() {
        if ( $('div.helper_item[title="site"]').is(":visible") ) {
            $('div.helper_item[title="site"], div#help-shadow').slideUp();
            $(this).text("View assistance for " + page_name);
	    sessionStorage.usdsJsHelperVisible = 'false';
        } else {
            $('div.helper_item[title="site"], div#help-shadow').slideDown();
            $(this).text("Minimize the SAM Helper");
	    sessionStorage.usdsJsHelperVisible = 'true';
        }
    });

    // trigger opening animation
    if (sessionStorage.usdsJsHelperVisible !== 'false') {
        sessionStorage.usdsJsHelperVisible = 'true';
    }

    if ( sessionStorage.usdsJsHelperVisible === 'true') {
        $('div#busa-main').slideDown();
    } else {
        $('div#busa-main').slideUp();
    }
    }).fail(function() {
      alert('failed to read JSON field data');
    });

});
}
