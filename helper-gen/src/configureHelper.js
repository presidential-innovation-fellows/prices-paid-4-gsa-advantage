// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the SAM application
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper
//
// It requires usdsJsHelper.js be loaded before execution

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
        $('<div class="editor">'
            + '<h2 class="table-title">Configure Fields</h2>' 
            + '<table class="editor" id="field-table"'
            + '<tr class="table-header">'
            + '<td>Field</td><td>Required</td><td>Validator</td><td>Quick Hint</td></tr>'
            + '</table>'
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
    $('input[title]').each(function(index, element) {
        var elTitle;
        elTitle = $(element).attr("title").replace(/[^A-Za-z0-9]/g, '_');
        // elTitle = $(element).attr("title");
        handleFieldDiv.append('<tr class="field-record" id="'
            + elTitle
            + '"><td>' + elTitle + '</td>'
            // + '<td><select id="required">'
              // + '<option value="true">required</option>'
              // + '<option value="false">optional</option>'
            // + '</select></td>'
            + '<td>Required: '
            + '<input type="radio" name="'
            + elTitle + '"value="true">Yes</input>'
            + '<input type="radio" name="'
            + elTitle + '" value="false">No</input>'
            + '</td>'
            + '<td><select id="validator">'
              + '<option value="none">none</option>'
              + '<option value="alpha-string">alpha-string</option>'
              + '<option value="us-phone">us-phone</option>'
              + '<option value="email">email</option>'
              + '<option value="confirm">confirm</option>'
            + '</select></td>'
            + '<td><textarea id="hint" cols="50" rows="3"></textarea><td>'
            + '</tr></table>'
       );

        handleFieldDiv.append(buttonDiv);
    });
    $('button#generate').on("click", function() {
        $('tr.field-record').each(function(index, element) {
            var newElement = {}, token, validator = {}, selected;
            token = element.id;
            newElement.token = token;
            newElement.required = $('tr#' + token
                + ' td input[type=radio][name='
                + token + ']:checked').val();
            selected = $('tr#' + token
                + ' td select#validator');
            validator.type = selected.val();
            newElement.validator = validator;
            newElement.quickHint
                = $('tr#' + token
                + ' td textarea#hint').val();
            pageConfiguration.form_fields.push(newElement);
        });
        console.log('config complete');
        console.log(JSON.stringify(pageConfiguration));
        $(window.open().document.body).html(JSON.stringify(pageConfiguration));
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
