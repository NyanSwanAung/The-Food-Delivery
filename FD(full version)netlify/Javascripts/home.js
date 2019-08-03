/*************** Get data from textbox and Validate if textboxes are empty************************/
function getTextBox_value() {
	var Fname = document.getElementById('form_name').value;
	var Femail = document.getElementById('form_email').value;
	var Fmessage = document.getElementById('form_message').value;
	var errormsg = '';
	if (Fname == '') {
		errormsg += 'Please enter your name! \n';
		document.getElementById('form_name').style.borderColor = '#e63c60';
	}
	if (Femail == '') {
		errormsg += 'Please enter your email! \n';
		document.getElementById('form_email').style.borderColor = '#e63c60';
	}
	if (Fmessage == '') {
		errormsg += 'Please enter your message! \n';
		document.getElementById('form_message').style.borderColor = '#e63c60';
	}
	if (errormsg != '') {
		alert(errormsg);
		return false;
	}
	if ((errormsg = true)) {
		alert('Your message has been sent successfully!!!');
		sendEmail();
		document.getElementById('form_name').style.borderColor = '#008f77';
		document.getElementById('form_email').style.borderColor = '#008f77';
		document.getElementById('form_message').style.borderColor = '#008f77';
	}
}

function sendEmail() {
	var name = document.getElementById('form_name').value;
	var email = document.getElementById('form_email').value;
	var msg = document.getElementById('form_message').value;
	var info = email + ',  Name : ' + name;

	getScript('https://cdn.emailjs.com/sdk/2.3.2/email.min.js', function() {
		(function() {
			emailjs.init('user_aM1gqgo7zJOcvCGIbOxg1');
			var template_params = {
				reply_to: 'reply_to_value',
				from_name: info,
				to_name: 'the food delivery ',
				message_html: msg
			};
			var service_id = 'default_service';
			var template_id = 'template_jS7RqBYv';
			emailjs.send(service_id, template_id, template_params);
		})();
	});
	document.getElementById('form_name').value = null;
	document.getElementById('form_email').value = null;
	document.getElementById('form_message').value = null;
}

// localStorage.clear();
// sessionStorage.clear();
/************************ when button is clicked , go to the top of page *****************************/

window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById('myBtn').style.display = 'block';
	} else {
		document.getElementById('myBtn').style.display = 'none';
	}
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}
/**************************** Image slider animation and button on click next image, previous image ********** */

// contain images in an array
var image = [
	'Pictures/Homepage/main2',
	'Pictures/Homepage/main3',
	'Pictures/Homepage/main4',
	'Pictures/Homepage/main5',
	'Pictures/Homepage/main1_uneditited'
];
var i = image.length;
var dummy = 'img';

// function for next slide
function nextImage() {
	if (i < image.length) {
		i = i + 1;
	} else {
		i = 1;
	}
	slider_content.innerHTML = '<img class = ' + dummy + ' src= ' + image[i - 1] + '.jpg>';
}

// function for prew slide
function prewImage() {
	if (i < image.length + 1 && i > 1) {
		i = i - 1;
	} else {
		i = image.length;
	}
	slider_content.innerHTML = '<img class = ' + dummy + '  src=' + image[i - 1] + '.jpg>';
}
// script for auto image slider
setInterval(nextImage, 3300);

// get location from select box
function getLocation() {
	var e = document.getElementById('selectbox');
	var location = e.options[e.selectedIndex].text;
	var array = location.split(' ');
	sessionStorage.setItem('user-location', array[0]);
}

function getScript(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	// most browsers
	script.onload = callback;
	// IE 6 & 7
	script.onreadystatechange = function() {
		if (this.readyState == 'complete') {
			callback();
		}
	};
	document.getElementsByTagName('head')[0].appendChild(script);
}
