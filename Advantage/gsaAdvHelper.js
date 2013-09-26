// This is the primary JavaScript 'glue' code that ties the app-agnostic
// usdsJsHelper library to the application
//
// This file lives at:
//
// It requires usdsJsHelper.js be loaded before execution

function css(a){
    var o = {};
    var rules = window.getMatchedCSSRules(a.get(0));
    for(var r in rules) {
        o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
    }
    return o;
}
function css2json(css){
    var s = {};
    if(!css) return s;
        if(css instanceof CSSStyleDeclaration) {
            for(var i in css) {
                if((css[i]).toLowerCase) {
                    s[(css[i]).toLowerCase()] = (css[css[i]]);
                }
            }
        } 
    else if(typeof css == "string") {
        css = css.split("; ");          
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        };
    }
    return s;
}

$(document).ready(function() {

    // This is a left menu replacement
    $('div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]')
        .parent().clone().children('a')
        .attr("href", "http://www.google.com")
        .text("Visit Prices Paid").parent()
        .appendTo($('div#sidemenu ul#MenuBar1 li ul li a[href="http://www.gsa.gov/portal/content/105201"]').parent());
    
    // This is an insertion below the sort bar
    var pricesPaidInsertion = 
    $('div#wrapper div#container div#main table tbody tr td div#sortbarDeptView');
    pricesPaidInsertion.next().clone().html('<p>Prices Paid</p><p>'
        + pricesPaidInsertion.text()
        + '</p>visit <a href="https://www.google.com">this site </a>for more info.</p>')
        .css("font-size", "2em")
        .appendTo(pricesPaidInsertion);


    // define the insertion points
    var usdsJsHelper = new UsdsJsHelper();
    var insertionPoints = {
    };
});
