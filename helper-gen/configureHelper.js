// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the SAM application
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper
//
// It requires usdsJsHelper.js be loaded before execution

// if (localStorage.helperMode && localStorage.helperMode === 'configure') {
if (true) {
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
            + '<div class="editor" id="field-table">'
            + '<table class="editor" id="field-table">'
            + '<tbody class="table-body" id="config-table-body"></tbody>'
            + '</table>'
            + '</div>'
            + '</div>');
    var buttonDiv =
        $('<div id="edit-buttons"><p><button type="button" id="generate">Save Changes</button>'
            + '</p><p><button type="button" id="close">Close</button></p></div>');
    buttonDiv.css('font-size', '1.2em');
    $('body').prepend(handleFieldDiv); // find all of the input elements
    var tbody = '';
        tbody += '<tr class="field-record" id="page-help">'
            + '<td class="field-item" class="field-item-name">Page Help</td>'
            + '<td class="field-item" class="field-item-value"colspan="6"><textarea id="page-help-text" cols="200" rows="2"></textarea></td>'
            + '</tr>';
    $('input[title]').each(function(index, element) {
        var elTitle = $(element).attr("title");
        var token = elTitle.replace(/[^A-Za-z0-9]/g, '_');
        tbody += '<tr class="field-record" id="'
            + elTitle + '" token ="' + elTitle + '">'
            + '<td class="field-item field-item-name">' + elTitle + '</td>'
            + '<td class="field-item field-item-name"><p>Required</p></td>'
            + '<td class="field-item field-item-value" id="' + elTitle + '-required">'
                + '<input id="' + elTitle + '-yes" type="radio" name="'
                + elTitle + '"value="true">Yes</input>'
                + '<input id="' + elTitle + '-no" type="radio" name="'
                + elTitle + '" value="false" checked>No</input>';
            tbody += '</td>'
            + '<td class="field-item field-item-name">Validation</td>'
            + '<td class="field-item field-item-value"><select id="' +elTitle + '-validator">'
              + '<option value="none">none</option>'
              + '<option value="alpha-string">alpha-string</option>'
              + '<option value="us-phone">us-phone</option>'
              + '<option value="email">email</option>'
              + '<option value="confirm">confirm</option>'
            + '</select></td>'
            + '<td class="field-item field-item-name">Hint</td>'
            + '<td class="field-item field-item-value"><textarea id="' + elTitle + '-hint" cols="100" rows="1"></textarea><td>'
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
      pageConfiguration = JSON.parse(msg);
      if (pageConfiguration.page_help) {
        $('#page-help-text').html(pageConfiguration.page_help);
      }
      $.each(pageConfiguration.form_fields, function(index, field) {
        $('tr.field-record[id="' + field.token + '"] td select[id="' +
                    field.token + '-validator"]').val(field.validator.type);
        $('tr.field-record[id="' + field.token + '"] td textarea[id="' +
                    field.token + '-hint"]').text(field.quickHint);
      });
    }).fail(function() {
      alert('failed to ping the file merger');
      });

    $('tr.field-record').on("mouseenter", function() {
        $('input[title="' + $(this).attr('id') + '"]').
                    css('background-color', 'red');
        $(this).css('background-color', '#cccccc');
    });
    $('tr.field-record').on("mouseleave", function() {
        $('input[title="' + $(this).attr('id') + '"]').
                    css('background-color', '');
        $(this).css('background-color', '');
    });
        // tbody += '<tr class="field-record" id="site-help">'
    $('button#generate').on("click", function() {
        pageConfiguration.page_help = $('tr#page-help textarea').val();
        if (pageConfiguration.history) {
            pageConfiguration.history.push(new Date().toLocaleString());
        } else {
            pageConfiguration.history = [ new Date().toLocaleString() ];
        }
        $('tr.field-record').each(function(index, element) {
            var selected,
                token = $(element).attr('token');
            var required = $('input[type=radio][name="'
                + token + '"]:checked').val();
            selected = $('select[id="' + token + '-validator"]');
            var quickHint
                = $('textarea[id="' + token + '-hint"]').val();
            $.each(pageConfiguration.form_fields, function(index, field) {
                if (field.token === token) {
                    pageConfiguration.form_fields.splice(index, 1);
                    return false;
                }
            });
            pageConfiguration.form_fields.push( {
                    token: token,
                    required: $('input[type=radio][name="' + token +
                                    '"]:checked').val(),
                    validator: { type: $('select[id="' + token +
                                '-validator"]').val() },
                    quickHint: $('textarea[id="' + token + '-hint"]').val()
                });
        });
        var configAsString = JSON.stringify(pageConfiguration);

        // Post the new data
        $.ajax({
            type: "POST",
            url: 'http://127.0.0.1:8124/page?site_name=samHelper&page_name=' +
                    encodeURIComponent( pageToken),
            dataType: "html",
            data: configAsString
        }).done(function(msg) {
          // console.log(msg);
          alert('Changes saved');
        }).fail(function() {
          alert('failed to ping the file merger');
        });
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
