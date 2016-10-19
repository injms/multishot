"use strict";

const webshot   = require('webshot');
const express   = require('express');
const app       = express();
const im        = require('imagemagick');

const PORT = 8585;

var listOfSites = [
    {
        url   : "https://support.wwf.org.uk/adopt-a-gorilla",
        name  : "adopt-a-gorilla"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-panda",
        name  : "adopt-a-panda"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-tiger",
        name  : "adopt-a-tiger"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-rhino",
        name  : "adopt-a-rhino"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-an-elephant",
        name  : "adopt-an-elephant"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-an-orang-utan",
        name  : "adopt-an-orang-utan"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-polar-bear",
        name  : "adopt-a-polar-bear"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-penguin",
        name  : "adopt-a-penguin"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-lion",
        name  : "adopt-a-lion"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-leopard",
        name  : "adopt-a-leopard"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-jaguar",
        name  : "adopt-a-jaguar"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-dolphin",
        name  : "adopt-a-dolphin"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-turtle",
        name  : "adopt-a-turtle"
    },
    {
        url   : "https://support.wwf.org.uk/adopt-a-snow-leopard",
        name  : "adopt-a-snow-leopard"
    },
    {
        url : "https://s3-eu-west-1.amazonaws.com/jwt-wwf/index.html",
        name : "tiger-book"
    }
];

var listOfSites = [
    {
        url   : "https://support.wwf.org.uk/tigersx2",
        name  : "tigersx2-october-loyalty-comms"
    }]

var customCSS =
    "#cookie_message{display:none !important;width:1px;height:1px;overflow:hidden;}"
    + ".bluePanel.vertical .oneOffOptions{display:none !important}"
    ;

const options = {
        screenSize: {
            width: 1440,
            height: 720
        },
        shotSize: {
            width: 1440,
            height: "all"
        },
        cookies : [{
            "cookie_banner_shown" : true
        }],
        customCSS : customCSS,
        quality : 100,
        siteType : "url",
        renderDelay : 1000
    };

var takeScreenshots = function( list ) {
    for (var i = 0; i < list.length; i++) {
        console.log('Taking a screenshot of ' + list[i].url)

        var filename = './shots/' + list[i].name;
        var jpg = filename + '.jpg';
        var pdf = filename + '.pdf';
        var url = list[i].url;

        webshot(url, jpg, options, function(err) {
            console.log('Taken a screenshot');
        });
    }
}

var makePDFs = function() {
    for (var i = 0; i < listOfSites.length; i++) {

        var filename = './shots/' + listOfSites[i].name;
        var jpg = filename + '.jpg';
        var pdf = filename + '.pdf';
        var url = listOfSites[i].url;

        im.convert([jpg, '-compress', 'JPEG', pdf],

        function(err, stdout){
          if (err) throw err;
          console.log('stdout:', stdout);
        });

        console.log('Created ' + pdf);
    }
}

var handleRequest = function(request, response){
    try {
        dispatcher.dispatch(request, response);
    }
    catch (err) {
        console.log(err);
    }

}

var showScreenshots = function() {
    console.log(listOfSites[0].name);

    var contents = "<!doctype html><html><head><style>body{font-size:0;}img{display:inline-block;vertical-align:top;width:" + (100 / 14) + "%}</style></head><body>";

    for (var i = 0; i < listOfSites.length; i++) {
        contents += "<img src=\"/shots/" + listOfSites[i].name + ".jpg\">";
    }

    contents += "</body></html>";

    app.use('/shots', express.static('shots'));

    app.get('/', function (request, response) {
      response.send(contents);
    });

    app.listen(PORT, function () {
      console.log('Running on port' + PORT + "!");
    });
}

process.argv
    .forEach(
        function (val, index, array) {
            if ( val === "--snap") {
                takeScreenshots(listOfSites);
            };

            if (val === "--show") {
                showScreenshots();
            };

            if (val === "--pdf") {
                makePDFs();
            };
        }
    );