const crypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

const dcrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};

var txtTypeHome = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

txtTypeHome.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = this.txt;

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

/*
// set up text to print, each item in array is new line
var aboutText = new Array("Université de Montréal Graduate with a Bachelor's degree focused in Computer Science.",
    "Detail oriented, sharp, driven and eager to learn.",
    "Experience in improving systems with automation and shell scripting,",
    "Skilled in Python web scraping, Visual Basic for Applications (VBA) and relational databases."
);

var iSpeed = 22; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = aboutText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines
var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

var txtTypeAbout = function() {
    sContents =  ' ';
    iRow = Math.max(0, iIndex-iScrollAt);
    var destination = document.getElementById("typedtext");
    while ( iRow < iIndex ) {
        sContents += aboutText[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + aboutText[iIndex].substring(0, iTextPos) + "_";
    if ( iTextPos++ == iArrLength ) {
        iTextPos = 0;
        iIndex++;
        if ( iIndex != aboutText.length ) {
            iArrLength = aboutText[iIndex].length;
            setTimeout("txtTypeAbout()", 500);
        }
    } else {
        setTimeout("txtTypeAbout()", iSpeed);
    }
}
*/

function startTime() {
    document.getElementById('clock').innerHTML = (new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    setTimeout(startTime, 1000);
}

const x = 'lmao';
const fetchWeather = async (city, force) => {
    if (city === undefined || city === null || city == "") city="montreal";
    if (force || (document.getElementById('name').innerHTML.toLowerCase() !== city.toLowerCase())) {
        const unit = "metric";
        const request_url = "https://api.openweathermap.org/data/2.5/weather?appid=" + dcrypt(x, "38366e3f696e3e36386c3c386e3a3c6e3d3e383b693c3d696e366d3a366c3b36") + "&q=" + city + "&units=" + unit + "&mode=json";
        const response = await fetch(request_url);
        const myJson = await response.json(); //extract JSON from the http response
        console.log(myJson);
        if (response.ok) {
            var imageData = "";
            var weatherId = myJson.weather[0].id+"";
                switch (weatherId.charAt(0)) {
                    case '2': imageData = "stormy"; break;
                    case '3': imageData = "rainy"; break;
                    case '5': imageData = "rainy"; break;
                    case '6': imageData = "snowy"; break;
                    case '7': imageData = "foggy"; break;
                    case '8':
                    switch (weatherId.charAt(2)) {
                    case '0': imageData = "sunny"; break;
                    case '1': imageData = "partlycloudy"; break;
                    default: imageData = "cloudy"; break;
                } break;
                default: imageData = "unknown"; break;
            }
            document.getElementById('name').innerHTML = myJson.name;
            document.getElementById('weatherImg').src = "assets/"+imageData+".png";
            if (imageData == "partlycloudy") {
                document.getElementById('description').innerHTML = "partly cloudy";
            } else {
                document.getElementById('description').innerHTML = imageData;
            }
            document.getElementById('temp').innerHTML = myJson.main.temp+" °C";
            document.getElementById('feelsLike').innerHTML = myJson.main.feels_like+" °C";
        } else {
            document.getElementById('name').innerHTML = "City is not recognized";
            document.getElementById('weatherImg').src = "assets/unknown.png";
            document.getElementById('description').innerHTML = "Try again";
            document.getElementById('temp').innerHTML = "";
            document.getElementById('feelsLike').innerHTML = "";
        }
    }
}

function search(ele) {
    if(event.key === 'Enter') {
        fetchWeather(ele.value, true);
    }
}

function fetchMobileWeather(ele) {
    fetchWeather(ele.value, false);
}

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    var el = document.getElementById('typed-main');
    if (el) {
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }        
    }

    var elements = document.getElementsByClassName('typewrite1');
    var el = document.getElementById('typed-main1');
    if (el) {
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }        
    }

    var elements = document.getElementsByClassName('typewrite2');
    var el = document.getElementById('typed-main2');
    if (el) {
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }        
    }

    var elements = document.getElementsByClassName('typewrite3');
    var el = document.getElementById('typed-main3');
    if (el) {
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }        
    }
    
    if (document.getElementById('typedtext')) { txtTypeAbout(); }

    if (document.getElementById('clock')) { startTime(); }

    if (document.getElementById('weather')) { fetchWeather("", true); }
    /*
    var days = document.getElementById('days');
    let date1 = new Date();
    let date2 = new Date('03/13/2023');
    const deltaDays = (date1, date2) => {
        let diffMs = date1.getTime() - date2.getTime();
        let diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        return diffDays;
    }
    days.innerHTML = deltaDays(date1, date2);
    */
};
