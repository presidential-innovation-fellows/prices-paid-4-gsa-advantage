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

