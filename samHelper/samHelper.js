// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the SAM application
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper
//
// It requires usdsJsHelper.js be loaded before execution

$(document).ready(function() {

    // define the insertion points
    var usdsJsHelper = new UsdsJsHelper();
    var insertionPoints = {
        samInsertionPoint: $('#UIPortalApplication'),
        busa_main_div: $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>'),
        busa_toggle_div:
        $('<div class="busa"><p><a href="#" id="busa-toggle">Minimize the SAM Helper</a></p></div>'),
        quickHintDiv:
            $('<div class="quick_hint" id="display-hover-text"></div>'),
        progressDiv: $('<div class="progress" id="progress"></div>')
    };
    insertionPoints.busa_main_div.insertBefore(insertionPoints.samInsertionPoint);
    insertionPoints.busa_toggle_div.insertAfter(insertionPoints.busa_main_div);
    insertionPoints.quickHintDiv.insertAfter(insertionPoints.busa_toggle_div);

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
        url: chrome.extension.getURL("samHelper.json"),
        dataType: "json"
    }).done(function(msg) {
      usdsJsHelper.loadFieldHandlers(pageToken, msg);
      progress = usdsJsHelper.progressForPage(pageToken, msg);
    }).fail(function() {
      alert('failed to read JSON field data');
    });

    // Get the content for the help items
    var pageContent;
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL("samHelper.html"),
        dataType: "html"
    }).done( function(data) {
        pageContent = usdsJsHelper.contentForPgItm(data, pageToken);
        if ((pageContent !== undefined) && (pageContent.overview_text !== undefined)) {
            overviewText = pageContent.overview_text.outerHTML;
        } else {
            overviewText = ' ';
        }
        $('div#busa-content').html( overviewText);
        var helpDiv =$('<div class="helper_item help_info" title="help">\n\
            <dl>\n\
            <dt>Getting Help: Email</dt>\n\
            <dd>\n\
            <a href="mailto:help.with.sam@businessusa.gov">\n\
            help.with.sam@businessusa.gov</a>\n\
            </dd>\n\
            <!-- <dt>see the MO workflow</dt>\n\-->\n\
            <!-- <dd id="button-me"></dd>\n\ -->\n\
            <!-- <dd id="wiz-me"></dd>\n\ -->\n\
            </dl>\n\
            </div>').insertAfter($('div#busa-content'));

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
        $(insertionPoints.progressDiv).html('Progress: ' + progress + ' %');
        $(insertionPoints.progressDiv).insertAfter($(helpDiv));
    }).fail(function(jqXHR, textStatus) {
        alert('failed to read page content');
    });

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
         */
    }
    // read the JSON workflow data
    sessionStorage.processMap = '{}';
    $.getJSON('http://mo.tynsax.com/api/operations/sam-system-of-award-management-registration-process/map',
    		function(data) {
	sessionStorage.processMap = JSON.stringify(data);
    });

    // define toggle/click/slide behavior
    $('#busa-toggle').click(function() {
        if ( $('div#busa-main').is(":visible") ) {
            $('div#busa-main').slideUp();
            $(this).text("View assistance for " + page_name);
	    sessionStorage.usdsJsHelperVisible = 'false';
        } else {
            $('div#busa-main').slideDown();
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
});
