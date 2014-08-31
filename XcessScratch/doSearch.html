// insert some html with javascript in it

function getCookies() {
    chrome.cookies.getAll(
            {},
            function(cookies) { 
                console.log(cookies);
            });
}

var sandbox = '<div id="sandbox"><h1>This is the sandbox</h1>' +
              '<div id="buttonhole"><button id="testbutton" onclick="chrome.cookies.getAll( {}, function(cookies) { console.log(cookies); });">Drink Me</button><div></div>';
$(sandbox).insertBefore('div#main');
(function() {
    $.ajax({
        type: "GET",
        url: "https://gsaxcess.gov/",
        crossDomain: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
        xhrFields: {
            withCredentials: true
        },
        success: function(data, textStatus, jqXHR) {
            console.log('load home page: ' + textStatus);
            $.ajax({
                type: "POST",
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Cache-Control": "max-age=0"
                },
                url: "https://gsaxcess.gov/fedsweb/fedsweb/",
                data: {
                    Continue: "Continue",
                    ICN: ""
                },
                success: function(data, textStatus, jqXHR) {
                    console.log('get login page: ' + textStatus);
                    var response = $(data);
                    var scParam =
                        response.filter('input[name="scParam"]').val();
                    var webpcmtransid = response.filter(
                            'input[name="WEBPCMTRANSID"]').val();
                    var scSecAnswer = response.filter(
                            'input[name="scSecAnswer"]').val();
                    var sellnk = response.filter(
                            'input[name="SELLNK"]').val();
                    var scTXTypViol = response.filter(
                            'input[name="scTXTypViol"]').val();
                    $.ajax({
                        type: "POST",
                        url: "https://gsaxcess.gov/fedsweb/fedswlog/",
                        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
                        crossDomain: true,
                        headers: {
                            "Cache-Control": "max-age=0"
                        },
                        beforeSend: function(xhr){
                            xhr.withCredentials = true;
                        },
                        data: {
                            scParam: scParam,
                            SELLNK: "",
                            scLid: "GOVUSE",
                            scPassword: "GOVUSE",
                            'Login.x': "21",
                            'Login.y': "6",
                            scSecAnswer: "",
                            scTXTypViol: "",
                            WEBPCMTRANSID: webpcmtransid,
                            scAction: "Y"
                        },
                        success: function(data, textStatus, jqXHR) {
                            console.log('log in: ' + textStatus);
                            var response = $(data);
                            var scParam =
                                response.filter('input[name="scParam"]').val();
                            var scSelDLSCNo = response.filter(
                                'input[name="scSelDLSCNo"]').val();
                            var ajaxData = {
                                    scParam: scParam,
                                    scGSName: "RADIO",
                                    scGSOptn: "1",
                                    scOption: "00",
                                    SELLNK: sellnk,
                                    ROW: "1",
                                    scSelDLSCNo: "+",
                                    SAVEDATA: "",
                                    WEBPCMTRANSID: webpcmtransid
                            };
                            var accept = {
                                text: "text/html"
                            };
                            $.ajax({
                                type: 'POST',
                                url: "https://gsaxcess.gov/fedsweb/pubw1000/",
                                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
                                crossDomain: true,
                                headers: {
                                    "Cache-Control": "max-age=0"
                                },
                                beforeSend: function(xhr){
                                       xhr.withCredentials = true;
                                           },
                                accepts: accept,
                                contentType: "application/x-www-form-urlencoded",
                                data: ajaxData,
                                success: function(data, textStatus, jqXHR) {
                                    var response = $(data);
                                    console.log('search completed');
                                },
                                complete: function (jqXHR, textStatus) {
                                    console.log('search POST returned: ' + textStatus);
                                }
                           });
                        }
                    });
                }
            });
         }
      });
})();
