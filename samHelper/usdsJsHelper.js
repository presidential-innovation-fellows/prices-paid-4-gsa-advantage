// The UsdsJsHelper is a domain and browser agnostic library
// It provides a mechanism for adding user-assistance to 'frozen'
// or legacy web applications
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper

var $;

var UsdsJsHelper = function() {
    'use strict';
};

UsdsJsHelper.prototype.pageContent = {};

UsdsJsHelper.prototype.loadFieldHandlers = function(pageId, siteData) {
        'use strict';
        var currentPage, pos, RIGHT_SHIFT_AMOUNT;
        $.each(siteData.pages, function(index, page) {
            if (page.page_name === pageId) {
                UsdsJsHelper.loadFieldHandlersForPage(page);
                return false;
            }
            return true;
        });
}

UsdsJsHelper.prototype.loadFieldHandlersForPage = function(currentPage) {

        if ((currentPage !== undefined) && (currentPage.form_fields !== undefined)) {
            $.each(currentPage.form_fields, function(text, field) {
                $('input[title="' + field.token + '"]').on('mouseenter mouseleave focus focusout',
                    { field: field},function(ev) {
                var digitsOnly, currentField,  errorOccurred, errorMessage, hintText, hoverHtmlDiv;
                currentField = ev.data.field;
                switch(ev.type) {
                    case 'mouseenter':  // display a quick hint
                    pos = $(this).position();
                    if (currentField.required === "true") {
                        hintText =  "<br>" + currentField.quickHint + "<br>(required)";
                    } else {
                        hintText = "<br>" + currentField.quickHint + "<br>(optional)";
                    }
                    hoverHtmlDiv = $('<div class="quick_hint" id="display-hover-text">'
                        + hintText + '</div>');
                    RIGHT_SHIFT_AMOUNT = 400;
                    hoverHtmlDiv.css({
                        "left": (pos.left + RIGHT_SHIFT_AMOUNT),
                        "font-size": "150%"});
                    hoverHtmlDiv.insertAfter(this);
                    break;

                    case 'mouseleave':  // stop displaying hover
                    $('div.quick_hint#display-hover-text').remove();
                    break;

                    case 'focus':   // display info in helper
                    $('p.field-focus').html('info for active field:<br>' + currentField.focus);
                    break;

                    case 'focusout':    // validate
                    if ((currentField.required === 'false') && (this.value === "")) {
                        break;  // if optional, then don't validate a blank entry
                    }
                    errorOccurred = false;
                    errorMessage = "Error:\n";
                    switch (currentField.validator.type) {
                        case "alpha-string":
                        if (this.value.indexOf(" ") !== -1) {
                        errorMessage += "no spaces allowed\n";
                        errorOccurred = true;
                        }
                        if (this.value.length > currentField.validator.rules.length) {
                        errorMessage += "maximum length: " + currentField.validator.rules.length;
                        errorOccurred = true;
                        }
                        if (errorOccurred === true) {
                        alert(errorMessage);
                        this.focus();
                        this.select();
                        }
                        break;

                        case "us-phone":
                        digitsOnly = this.value.replace(/\D/g,"");
                        if (digitsOnly.length !== 10) {
                        alert(errorMessage + "Telephone numbers must have 10 digits");
                        this.focus();
                        this.select();
                        } else {
                        this.value = '(' + digitsOnly.substr(0,3) + ')'
                           +  digitsOnly.substr(3,3) + '-' + digitsOnly.substr(6,4);
                    }
                    break;

                    case "email":
                    if (!this.value.match( /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)) {
                        alert(errorMessage + this.value + ' is not a valid email address');
                        this.focus();
                        this.select();
                    }
                    break;

                    case "confirm":

                    $.each(currentPage.form_fields, function(text, confirmField) {
                        if (confirmField.token === field.validator.rules.matchField) {
                            var str1 = $('input[title="' + field.token + '"]').val();
                            var str2 = $('input[title="' + confirmField.token + '"]').val();
                            if (str1 !== str2) {
                                alert(errorMessage + str1 + '\nand ' + str2 +' do not match');
                                $('input[title="' + field.token + '"]').focus();
                                $('input[title="' + field.token + '"]').select();
                            }
                            return false;
                        }
                    });
                    break;

                    default:
                    break;
                    }
                    break;

                    default:
                    break;
                }
                });
            });
        }
    };

UsdsJsHelper.prototype.contentForPgItm = function (htmlContent, pageToken, itemToken) {
        'use strict';
        var content, page, items;
        page = this.pageContent;
        if (!page) {
            return null;
        }
        if (page.length === undefined) {
            var items = $(htmlContent).filter('.helper_page[title=' + pageToken + ']');
            $.each(items.children(), function(index, item) {
                page[ item.title ] = item;
            });
        }
        if (itemToken === undefined) {
            return this.pageContent;
        } else {
            $.each(this.pageContent, function(index, item) {
                if (item.title === itemToken) {
                    content = item;
                    return false;
                } else {
                    return true;
                }
            });
            return content;
        }
    };

UsdsJsHelper.prototype.progressForPage = function(pageId, siteData) {
        'use strict';
        var progress = 0;
        $.each(siteData.pages, function(index, page) {
            if (page.page_name === pageId) {
                progress = page.progress;
                return false;
            }
            return true;
        });
        return progress;
    };
