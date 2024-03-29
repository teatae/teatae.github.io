const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};

const dcrypt = window.dcrypt;

var txtTypeHome = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
};

txtTypeHome.prototype.tick = function () {
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

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
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
    document.getElementById("clock").innerHTML = new Date().toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    setTimeout(startTime, 1000);
}

const fetchWeatherLambda = async (cityVal) => {
    const params = {
        FunctionName: "taeLambdaWeather",
        Payload: JSON.stringify({ city: cityVal }),
    };

    const result = await window.lambda.invoke(params).promise();
    const responsePayload = JSON.parse(result.Payload);
    return responsePayload;
};

const x = "lmao";
const fetchWeather = async (city, force) => {
    if (city !== undefined && city !== null && city !== "" && (force || document.getElementById("name").innerHTML.toLowerCase() !== city.toLowerCase())) {
        const unit = "metric";
        const request_url = "https://api.openweathermap.org/data/2.5/weather?appid=" + dcrypt(x, "38366e3f696e3e36386c3c386e3a3c6e3d3e383b693c3d696e366d3a366c3b36") + "&q=" + city + "&units=" + unit + "&mode=json";
        const response = await fetch(request_url);
        const myJson = await response.json(); //extract JSON from the http response
        //const myJson = await fetchWeatherLambda(city); //Using AWS Lambda
        //if (myJson.cod == 200) {
        console.log(myJson);
        if (response.ok) {
            var imageData = "";
            var weatherId = myJson.weather[0].id + "";
            switch (weatherId.charAt(0)) {
                case "2":
                    imageData = "stormy";
                    break;
                case "3":
                    imageData = "rainy";
                    break;
                case "5":
                    imageData = "rainy";
                    break;
                case "6":
                    imageData = "snowy";
                    break;
                case "7":
                    imageData = "foggy";
                    break;
                case "8":
                    switch (weatherId.charAt(2)) {
                        case "0":
                            imageData = "sunny";
                            break;
                        case "1":
                            imageData = "partlycloudy";
                            break;
                        default:
                            imageData = "cloudy";
                            break;
                    }
                    break;
                default:
                    imageData = "pigeon";
                    break;
            }
            document.getElementById("name").innerHTML = myJson.name;
            document.getElementById("weatherImg").src = "assets/" + imageData + ".webp";
            if (imageData == "partlycloudy") {
                document.getElementById("description").innerHTML = "partly cloudy";
            } else {
                document.getElementById("description").innerHTML = imageData;
            }
            document.getElementById("temp").innerHTML = myJson.main.temp + " °C";
            document.getElementById("feelsLike").innerHTML = myJson.main.feels_like + " °C";
        } else {
            document.getElementById("name").innerHTML = "City is not recognized";
            document.getElementById("weatherImg").src = "assets/pigeon.webp";
            document.getElementById("description").innerHTML = "Try again";
            document.getElementById("temp").innerHTML = "";
            document.getElementById("feelsLike").innerHTML = "";
        }
    }
};

function search(ele) {
    if (event.key === "Enter") {
        weatherClick.click();
        const input = ele.value.trim();
        if (input) {
            fetchWeather(ele.value, true);
            document.getElementById("city").focus();
            ele.value = "";
        }
    }
}

function fetchMobileWeather(ele) {
    weatherClick.click();
    const input = ele.value.trim();
    if (input) {
        fetchWeather(input, false);
        document.getElementById("city").focus();
        ele.value = "";
    }
}

/*
const ai = String(window.dcrypt(x, "7c64223a676a5d597c3d583d697d664b75384a777f3b675b3c4d636d6449457f566e36426b37373c376e5964415a634965467b"));
const model = "text-davinci-003";
const apiUrl = "https://api.openai.com/v1/engines/" + model + "/completions";
const currDay = new Date();
var fullLog = "Tae-Suzanne was born in Montréal, Québec. She is chinese and cambodian.\n";
fullLog = fullLog + "Tae-Suzanne is to be refered as Tae or Suzanne.\n";
fullLog = fullLog + "Tae has a Bachelor's Degree in Computer Science from Université de Montréal. She graduated in 2022.\n";
fullLog = fullLog + "Tae currently lives in Montréal. Today is " + currDay + ".\n";
fullLog = fullLog + "Her email is tae@taetae.ca. Her phone number is (438)765-4320. Her LinkedIn is linkedin.com/in/taesuzanne.\n";
fullLog = fullLog + "Her home page is the first icon (house icon) of her website.\n";
fullLog = fullLog + "Her resume page is the second icon (card icon) of her website.\n";
fullLog = fullLog + "Her contact page is the third icon (chat bubble icon) of her website.\n";
fullLog = fullLog + "Her AI assistant page is the fourth icon (otter icon) of her website.\n";
fullLog = fullLog + "Her weather page is the fifth icon (cloud icon) of her website.\n";
fullLog = fullLog + "Her thank you page is the sixth and last icon (coding icon) of her website.\n";
fullLog = fullLog + "Her GitHub is teatae.\n";
fullLog = fullLog + "Programming languages that she knows are Python, Julia, HTML, CSS, JavaScript, Java, PHP, VBS, VBA (Excel), SQL (MySQL, DB2) and VHDL.\n";
fullLog = fullLog + "She is familiar with these operating systems (Windows,Ubuntu) and these IDE (VSCode, Jupyter Notebook, Intellij Idea, Eclipse, Android Studio).\n";
fullLog = fullLog + "She speaks French and English fluently. She is currently interested in scikit-learn and AWS.\n";
fullLog = fullLog + "Skilled in automation, shell scripting, Full-Stack, Python, and relational databases, she is experienced in software development and improving systems.\n";
fullLog = fullLog + "She is currently a Software Developer at FUZE Logistics. She was employed there since June 2021.";
fullLog = fullLog + "At Fuze Logistics, she built entire internal applications, such as a Web application (used: JS, PHP, REST API, Python), Databases and server (used: MariaDB, Apache),";
fullLog = fullLog + "an Invoice reporter (used: VBS, VBA, Python, DB2, ETL), some Web scrapers (used: Python, Selenium, Beautiful Soup), ";
fullLog = fullLog + "produced UML documentation (used: Visual Paradigm) and helped provide alternative solutions.\n";
fullLog = fullLog + "She also had professionnal experience as an intern as a Backend Developer for Desjardins from September 2021 to December 2021.";
fullLog = fullLog + "In that internship, she produced IMAC (Inventory Move, Add & Change) delta reports of ATM data with Java (Tomcat, Eclipse), created JUnit tests";
fullLog = fullLog + "and used Scrum methodology, Agile development\n";
fullLog = fullLog + "Her side projects include The Gentleman Project (2022), a Lightweight web-based projectional editor in which she implemented the Drag and Drop features.";
fullLog = fullLog + "She also made a replica of UNIQLO Wakeup,";
fullLog = fullLog + "an Alarm clock application that visually and acoustically displays time and weather that Uses Android Studio Emulator, JavaScript, React Native, Redux, NodeJS.";
fullLog = fullLog + "During her academic studies, she made an advanced Flappy Bird with (Java GUI, OOP), Snake the game, Minesweeper, Sudoku solver with (HTML, JavaScript, jQuery, CSS).\n";
fullLog = fullLog + "On fourth icon of her personal website navigation bar (teatae.github.io), she implemented a page for an AI assistant";
fullLog = fullLog + "to help users on her website know more about her work.\n";
fullLog = fullLog + "That AI loves otters, it replies with hard known facts about Tae or fun facts to the users.\n";
fullLog = fullLog + "That AI avoids questions about her age, her pets, her family, her siblings or about any of her education preceding university in a cute manner.\n";
fullLog = fullLog + "The following is a conversation between that cute and quirky AI assistant and a user on her website.\n User:";

function appendMessage(message, sender) {
    const div = document.createElement("div");
    if (sender == "user") {
        div.classList.add("message", "typed-static-1", sender);
    } else {
        div.classList.add("message", "typed-static-1", sender, "purple");
    }
    div.innerHTML = message;
    chatlog.appendChild(div);
    chatlog.scrollTop = chatlog.scrollHeight;
    if (chatlog.childElementCount > 2) {
        chatlog.removeChild(chatlog.firstElementChild);
    }
}

const fetchGPT = async (input) => {
    
    fullLog = fullLog + input + "\n AI:";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ai}`,
        },
        body: JSON.stringify({
            prompt: fullLog,
            temperature: 0.6,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.7,
            n: 1,
            stop: [" User:", " AI:"],
        }),
    };
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json(); //extract JSON from the http response
    if (response.ok) {
        const reply = data.choices[0].text.trim();
        fullLog = fullLog + reply + "\n User:";
        appendMessage(reply, "bot");
        chatClick.click();
        document.getElementById("input-message").focus();
    }
    
    //appendMessage("Oops! This section is under maintenance. The AI assistant API has reached the requests per minute limit.", "bot");
    //chatClick.click();
    //document.getElementById("input-message").focus();
};

function onSendClick(ele) {
    if (event.key === "Enter") {
        chatClick.click();
        const input = ele.value.trim();
        if (input) {
            appendMessage(input, "user");
            fetchGPT(input);
            ele.value = "";
        }
    }
}

function fetchReplyGPT(ele) {
    chatClick.click();
    const input = ele.value.trim();
    if (input) {
        appendMessage(input, "user");
        fetchGPT(input);
        ele.value = "";
    }
}
*/

function changeColor(event) {
  const links = document.querySelectorAll('.nav');
  links.forEach(link => link.classList.remove('clicked'));
  event.target.classList.add('clicked');
}

const weatherClick = document.querySelector('a[href="#weather"]');
const chatClick = document.querySelector('a[href="#chat"]');

// Smooth scrolling to section with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = document.querySelector('header').offsetHeight; // Adjust this if necessary
    const offsetTop = target.offsetTop - headerHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  });
});

window.onload = function () {
    const navLinks = document.querySelectorAll('.nav');
    navLinks[0].classList.add('clicked');
    
    var elements = document.getElementsByClassName("typewrite");
    var el = document.getElementById("typed-main");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    elements = document.getElementsByClassName("typewrite1");
    el = document.getElementById("typed-main1");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    elements = document.getElementsByClassName("typewrite2");
    el = document.getElementById("typed-main2");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    elements = document.getElementsByClassName("typewrite3");
    el = document.getElementById("typed-main3");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    elements = document.getElementsByClassName("typewrite4");
    el = document.getElementById("typed-main4");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    elements = document.getElementsByClassName("typewrite5");
    el = document.getElementById("typed-main5");
    if (el) {
        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute("data-type");
            var period = elements[i].getAttribute("data-period");
            if (toRotate) {
                new txtTypeHome(el, JSON.parse(toRotate), period);
            }
        }
    }

    if (document.getElementById("typedtext")) {
        txtTypeAbout();
    }

    if (document.getElementById("clock")) {
        startTime();
    }

    if (document.getElementById("weather")) {
        fetchWeather("montreal", true);
    }

    let date1 = new Date();
    let date2 = new Date("08/28/2023"); // August 29 2023
    const deltaDays = (date1, date2) => {
        let diffMs = date1.getTime() - date2.getTime();
        let diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        return diffDays;
    };
    var days = "";
    if (deltaDays(date1, date2) == 0) {
        days = "resume updated today";
    } else if (deltaDays(date1, date2) == 1) {
        days = "resume updated a day ago";
    } else {
        days = "resume updated " + deltaDays(date1, date2) + " days ago";
    }

    var resume1 = document.getElementById("resume1");
    var resume2 = document.getElementById("resume2");
    resume1.title = days;
    resume2.title = days;
    resume3.title = days;
    resume1.alt = days;
    resume2.alt = days;
    resume3.alt = days;

    const chatlog = document.getElementById("chatlog");
};
