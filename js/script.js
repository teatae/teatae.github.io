const crypt=(e,t)=>{const a=e=>e.split("").map((e=>e.charCodeAt(0)));return t.split("").map(a).map((t=>a(e).reduce(((e,t)=>e^t),t))).map((e=>("0"+Number(e).toString(16)).substr(-2))).join("")},dcrypt=window.dcrypt;var txtTypeHome=function(e,t,a){this.toRotate=t,this.el=e,this.loopNum=0,this.period=parseInt(a,10)||2e3,this.txt="",this.tick(),this.isDeleting=!1};function startTime(){document.getElementById("clock").innerHTML=(new Date).toLocaleString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0}),setTimeout(startTime,1e3)}txtTypeHome.prototype.tick=function(){var e=this.loopNum%this.toRotate.length,t=this.toRotate[e];this.isDeleting?this.txt=t.substring(0,this.txt.length-1):this.txt=t.substring(0,this.txt.length+1),this.el.innerHTML=this.txt;var a=this,n=200-100*Math.random();this.isDeleting&&(n/=2),this.isDeleting||this.txt!==t?this.isDeleting&&""===this.txt&&(this.isDeleting=!1,this.loopNum++,n=500):(n=this.period,this.isDeleting=!0),setTimeout((function(){a.tick()}),n)};const fetchWeatherLambda=async e=>{const t={FunctionName:"taeLambdaWeather",Payload:JSON.stringify({city:e})},a=await window.lambda.invoke(t).promise();return JSON.parse(a.Payload)},x="lmao",fetchWeather=async(e,t)=>{if(null!=e&&""!==e&&(t||document.getElementById("name").innerHTML.toLowerCase()!==e.toLowerCase())){const t="metric",i="https://api.openweathermap.org/data/2.5/weather?appid="+dcrypt(x,"38366e3f696e3e36386c3c386e3a3c6e3d3e383b693c3d696e366d3a366c3b36")+"&q="+e+"&units="+t+"&mode=json",o=await fetch(i),s=await o.json();if(console.log(s),o.ok){var a="",n=s.weather[0].id+"";switch(n.charAt(0)){case"2":a="stormy";break;case"3":case"5":a="rainy";break;case"6":a="snowy";break;case"7":a="foggy";break;case"8":switch(n.charAt(2)){case"0":a="sunny";break;case"1":a="partlycloudy";break;default:a="cloudy"}break;default:a="unknown"}document.getElementById("name").innerHTML=s.name,document.getElementById("weatherImg").src="assets/"+a+".png",document.getElementById("description").innerHTML="partlycloudy"==a?"partly cloudy":a,document.getElementById("temp").innerHTML=s.main.temp+" °C",document.getElementById("feelsLike").innerHTML=s.main.feels_like+" °C"}else document.getElementById("name").innerHTML="City is not recognized",document.getElementById("weatherImg").src="assets/unknown.png",document.getElementById("description").innerHTML="Try again",document.getElementById("temp").innerHTML="",document.getElementById("feelsLike").innerHTML=""}};function search(e){if("Enter"===event.key){location.href="#weather";e.value.trim()&&(fetchWeather(e.value,!0),document.getElementById("city").focus(),e.value="")}}function fetchMobileWeather(e){location.href="#weather";const t=e.value.trim();t&&(fetchWeather(t,!1),document.getElementById("city").focus(),e.value="")}const ai=String(window.dcrypt(x,"7c64223a676a5d597c3d583d697d664b75384a777f3b675b3c4d636d6449457f566e36426b37373c376e5964415a634965467b")),model="text-davinci-003",apiUrl="https://api.openai.com/v1/engines/"+model+"/completions",currDay=new Date;var fullLog="Tae-Suzanne was born in Montréal, Québec. She is chinese and cambodian.\n";function appendMessage(e,t){const a=document.createElement("div");"user"==t?a.classList.add("message","typed-static-1",t):a.classList.add("message","typed-static-1",t,"purple"),a.innerHTML=e,chatlog.appendChild(a),chatlog.scrollTop=chatlog.scrollHeight,chatlog.childElementCount>2&&chatlog.removeChild(chatlog.firstElementChild)}fullLog+="Tae-Suzanne is to be refered as Tae or Suzanne.\n",fullLog=(fullLog+="Tae has a Bachelor's Degree in Computer Science from Université de Montréal. She graduated in 2022.\n")+"Tae currently lives in Montréal. Today is "+currDay+".\n",fullLog+="Her email is tae@taetae.ca. Her phone number is (438)765-4320. Her LinkedIn is linkedin.com/in/taesuzanne.\n",fullLog+="Her home page is the first icon (house icon) of her website.\n",fullLog+="Her resume page is the second icon (card icon) of her website.\n",fullLog+="Her contact page is the third icon (chat bubble icon) of her website.\n",fullLog+="Her AI assistant page is the fourth icon (otter icon) of her website.\n",fullLog+="Her weather page is the fifth icon (cloud icon) of her website.\n",fullLog+="Her thank you page is the sixth and last icon (coding icon) of her website.\n",fullLog+="Her GitHub is teatae.\n",fullLog+="Programming languages that she knows are Python, Julia, HTML, CSS, JavaScript, Java, PHP, VBS, VBA (Excel), SQL (MySQL, DB2) and VHDL.\n",fullLog+="She is familiar with these operating systems (Windows,Ubuntu) and these IDE (VSCode, Jupyter Notebook, Intellij Idea, Eclipse, Android Studio).\n",fullLog+="She speaks French and English fluently. She is currently interested in scikit-learn and AWS.\n",fullLog+="Skilled in automation, shell scripting, Full-Stack, Python, and relational databases, she is experienced in software development and improving systems.\n",fullLog+="She is currently a Software Developer at FUZE Logistics. She was employed there since June 2021.",fullLog+="At Fuze Logistics, she built entire internal applications, such as a Web application (used: JS, PHP, REST API, Python), Databases and server (used: MariaDB, Apache),",fullLog+="an Invoice reporter (used: VBS, VBA, Python, DB2, ETL), some Web scrapers (used: Python, Selenium, Beautiful Soup), ",fullLog+="produced UML documentation (used: Visual Paradigm) and helped provide alternative solutions.\n",fullLog+="She also had professionnal experience as an intern as a Backend Developer for Desjardins from September 2021 to December 2021.",fullLog+="In that internship, she produced IMAC (Inventory Move, Add & Change) delta reports of ATM data with Java (Tomcat, Eclipse), created JUnit tests",fullLog+="and used Scrum methodology, Agile development\n",fullLog+="Her side projects include The Gentleman Project (2022), a Lightweight web-based projectional editor in which she implemented the Drag and Drop features.",fullLog+="She also made a replica of UNIQLO Wakeup,",fullLog+="an Alarm clock application that visually and acoustically displays time and weather that Uses Android Studio Emulator, JavaScript, React Native, Redux, NodeJS.",fullLog+="During her academic studies, she made an advanced Flappy Bird with (Java GUI, OOP), Snake the game, Minesweeper, Sudoku solver with (HTML, JavaScript, jQuery, CSS).\n",fullLog+="On fourth icon of her personal website navigation bar (teatae.github.io), she implemented a page for an AI assistant",fullLog+="to help users on her website know more about her work.\n",fullLog+="That AI loves otters, it replies with hard known facts about Tae or fun facts to the users.\n",fullLog+="That AI avoids questions about her age, her pets, her family, her siblings or about any of her education preceding university in a cute manner.\n",fullLog+="The following is a conversation between that cute and quirky AI assistant and a user on her website.\n User:";const fetchGPT=async e=>{fullLog=fullLog+e+"\n AI:";const t={method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${ai}`},body:JSON.stringify({prompt:fullLog,temperature:.9,max_tokens:100,top_p:1,frequency_penalty:0,presence_penalty:.7,n:1,stop:[" User:"," AI:"]})},a=await fetch(apiUrl,t),n=await a.json();if(a.ok){const e=n.choices[0].text.trim();fullLog=fullLog+e+"\n User:",appendMessage(e,"bot"),location.href="#chat",document.getElementById("input-message").focus()}};function onSendClick(e){if("Enter"===event.key){location.href="#chat";const t=e.value.trim();t&&(appendMessage(t,"user"),fetchGPT(t),e.value="")}}function fetchReplyGPT(e){location.href="#chat";const t=e.value.trim();t&&(appendMessage(t,"user"),fetchGPT(t),e.value="")}function changeColor(e){document.querySelectorAll(".nav").forEach((e=>e.classList.remove("clicked"))),e.target.classList.add("clicked")}window.onload=function(){document.querySelectorAll(".nav")[0].classList.add("clicked");var e=document.getElementsByClassName("typewrite"),t=document.getElementById("typed-main");if(t)for(var a=0;a<e.length;a++){var n=e[a].getAttribute("data-type"),i=e[a].getAttribute("data-period");n&&new txtTypeHome(t,JSON.parse(n),i)}if(e=document.getElementsByClassName("typewrite1"),t=document.getElementById("typed-main1"))for(a=0;a<e.length;a++){n=e[a].getAttribute("data-type"),i=e[a].getAttribute("data-period");n&&new txtTypeHome(t,JSON.parse(n),i)}if(e=document.getElementsByClassName("typewrite2"),t=document.getElementById("typed-main2"))for(a=0;a<e.length;a++){n=e[a].getAttribute("data-type"),i=e[a].getAttribute("data-period");n&&new txtTypeHome(t,JSON.parse(n),i)}if(e=document.getElementsByClassName("typewrite3"),t=document.getElementById("typed-main3"))for(a=0;a<e.length;a++){n=e[a].getAttribute("data-type"),i=e[a].getAttribute("data-period");n&&new txtTypeHome(t,JSON.parse(n),i)}if(e=document.getElementsByClassName("typewrite4"),t=document.getElementById("typed-main4"))for(a=0;a<e.length;a++){n=e[a].getAttribute("data-type"),i=e[a].getAttribute("data-period");n&&new txtTypeHome(t,JSON.parse(n),i)}document.getElementById("typedtext")&&txtTypeAbout(),document.getElementById("clock")&&startTime(),document.getElementById("weather")&&fetchWeather("montreal",!0);let o=new Date,s=new Date("05/02/2023");const r=(e,t)=>{let a=e.getTime()-t.getTime();return Math.floor(a/864e5)};var l="";l=0==r(o,s)?"resume updated today":1==r(o,s)?"resume updated a day ago":"resume updated "+r(o,s)+" days ago";var c=document.getElementById("resume1"),d=document.getElementById("resume2");c.title=l,d.title=l,resume3.title=l,c.alt=l,d.alt=l,resume3.alt=l;document.getElementById("chatlog")};