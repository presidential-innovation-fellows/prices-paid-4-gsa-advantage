//
// This file lives at:
//

(function() {

    $(document).ready(function() {
       var cart_info = 'Item for Cart Builder\n\n' +
           'Product ID: ' + $('input#productId').val() +
           '\nProduct ID 1: ' + $('input#productId_1').val() +
           '\nProduct Name: ' + $('meta[itemprop="name"]').attr("content") +
           '\nPrice: ' + $('#ciItemPrice').val();
       $('.addToCart_btn').html('C2++ (get it?)').
           on('click', function(ev) {
               ev.stopImmediatePropagation();
               alert(cart_info);
           });
    });
})();
