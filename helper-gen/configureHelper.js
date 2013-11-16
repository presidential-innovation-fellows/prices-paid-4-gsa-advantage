// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the SAM application
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper
//
// It requires usdsJsHelper.js be loaded before execution

chrome.storage.local.get( 'helperMode', function ( items ) {
if (items.helperMode && items.helperMode === 'configure') {
$(document).ready(function() {

    // create the page token
    var page_name = $('div.page_heading').text();
    if (page_name) {
        page_name += $('div.sub_heading').text();
    } else {
        page_name = 'SAM.gov';
        $('div#busa-main').hide();
    }
    var pageToken = page_name.replace(/[^A-Za-z0-9]/g, '_');
    var pageConfiguration = {
        "page_name": pageToken,
        "form_fields": []
    };

    var handleFieldDiv =
        $('<div class="shadow-editor" id="shadow-frame"></div>'
            + '<div class="editor" id="editor-frame">'
            + '<h2 class="table-title">Configure Fields</h2>' 
            + '<div class="editor" id="field-table">'
            + '<table class="editor" id="field-table">'
            + '<thead class="table-header" id="config-table-header"><tr>'
            + '<td>Field</td><td>Required</td><td>Validator</td><td>Quick Hint</td></tr>'
            + '</thead>'
            + '<tbody class="table-body" id="config-table-body"></tbody>'
            + '</table>'
            + '</div>'
            + '</div>');
    handleFieldDiv.css({
        "min-width": "400",
        "font-size": "1.25em",
        "min-height": "400",
        "background-color": "gray",
        "color": "white",
        "border": "solid red 2px"
    });
    var buttonDiv =
        $('<button type="button" id="generate">Generate Config File</button>'
            + '<button type="button" id="close">Close</button>');
    buttonDiv.css('font-size', '1.2em');
    $('body').prepend(handleFieldDiv); // find all of the input elements
    var tbody = '';
    $('input[title]').each(function(index, element) {
        var elTitle = $(element).attr("title");
        var token = elTitle.replace(/[^A-Za-z0-9]/g, '_');
        tbody += '<tr class="field-record" id="'
            + elTitle + '" token ="' + token + '">'
            + '<td>' + elTitle + '</td>'
            + '<td id="' + elTitle + '-required">';

                tbody += '<input id="' + elTitle + '-yes" type="radio" name="'
                + token + '"value="true">Yes</input>'
                + '<input id="' + elTitle + '-no" type="radio" name="'
                + token + '" value="false" checked>No</input>';
            tbody += '</td>'
            + '<td><select id="' + elTitle + '-validator">'
              + '<option value="none">none</option>'
              + '<option value="alpha-string">alpha-string</option>'
              + '<option value="us-phone">us-phone</option>'
              + '<option value="email">email</option>'
              + '<option value="confirm">confirm</option>'
            + '</select></td>'
            + '<td><textarea id="' + elTitle + '-hint" cols="100" rows="2"></textarea><td>'
            + '</tr>';

    });
    $('tbody.table-body#config-table-body').html(tbody);
    buttonDiv.insertAfter('div.editor#field-table');

    // Get current settings
    $.ajax({
        type: "GET",
        url: 'http://127.0.0.1:8124/page?site_name=samHelper&page_name=' +
                encodeURIComponent( pageToken),
        dataType: "html",
    }).done(function(msg) {
      $.each(JSON.parse(msg).form_fields, function(index, field) {
        $('tr.field-record[id="' + field.token + '"] td select[id="' +
                    field.token + '-validator"]').val(field.validator.type);
        $('tr.field-record[id="' + field.token + '"] td textarea[id="' +
                    field.token + '-hint"]').text(field.quickHint);
      });
      console.log(msg);
    }).fail(function() {
      alert('failed to ping the file merger');
      });

    $('tr.field-record').on("mouseenter", function() {
        $('input[title="' + $(this).attr('id') + '"]').
                    css('background-color', 'red');
    });
    $('tr.field-record').on("mouseleave", function() {
        $('input[title="' + $(this).attr('id') + '"]').
                    css('background-color', '');
    });
    $('button#generate').on("click", function() {
        $('tr.field-record').each(function(index, element) {
            var selected,
                token = $(element).attr('token');
            var required = $('input[type=radio][name="'
                + token + '"]:checked').val();
            selected = $('select#' + token + '-validator');
            var quickHint
                = $('textarea#' + token + '-hint').val();
            pageConfiguration.form_fields.push( {
                    token: token,
                    required: $('input[type=radio][name="' + token +
                                    '"]:checked').val(),
                    validator: { type: $('select#' + token +
                                '-validator').val() },
                    quickHint: $('textarea#' + token + '-hint').val()
                });
        });
        var configAsString = JSON.stringify(pageConfiguration);
        var configWin = window.open();

        // Post the new data
        $.ajax({
            type: "POST",
            url: 'http://127.0.0.1:8124/page?site_name=samHelper&page_name=' +
                    encodeURIComponent( pageToken),
            dataType: "html",
            data: configAsString
        }).done(function(msg) {
          console.log(msg);
          alert(msg);
        }).fail(function() {
          alert('failed to ping the file merger');
          });

        configWin.document.title='Configuration Results';
        var configHeader =
            '<meta http-equiv="Content-Type" content="text/html;charset=utf-8">\n' +
            '<script>' +
            'var foo="bar"' +
            '</script>';

        $(configWin.document.documentElement).children('head').html(configHeader);

        localStorage.pageToken = configAsString;
        $(configWin.document.body).html('<div id="config">' +
                configAsString + '</div>');
                /*
        var range = Win.document.createRange();
        range.selectNodeContents(Win.document.getElementById("config");
        var sel = configWin.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        */

    });
    $('button#close').on("click", function() {
        handleFieldDiv.remove();
    });
    $('td.editor').css({
        "background-color": "white",
        "color": "black",
        "border": "solid black 1px"
    });
    $('h2.table-title').css({
        "font-size": "2em"
    });
});
}
});
