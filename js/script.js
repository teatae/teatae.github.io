var TxtType = function(el, typedmain, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.typedmain = typedmain;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.typedmain.innerHTML = this.txt;

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

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    var typedmain = document.getElementById('typed-main');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], typedmain, JSON.parse(toRotate), period);
        }
    }
    var old = document.getElementById('old');

    let date_1 = new Date('03/13/2023');
    let date_2 = new Date();

    const days = (date_1, date_2) =>{
    	let difference = date_1.getTime() - date_2.getTime();
    	let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    	return TotalDays;
    }
    old.innerHTML = -days(date_1, date_2);
};