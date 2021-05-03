const url_ = window.location.origin;

$('document').ready(function() {
	checkCookieChecked();
});

$("#login-form").submit(function(event){
	event.preventDefault();

	var email = document.getElementById('email').value;
	var pass = document.getElementById('senha').value;
	var check = document.getElementById("lembreme");
	
	if (check.checked == true){
		setCookieChecked("CheckBox", "true", "30");
	}else if  (check.checked == false){
		setCookieChecked("CheckBox", "false", "30");
	}

	fetch(url_ + "/api/session", {
		method: "POST",
		body: new URLSearchParams(`email=${email}&password=${encodeURIComponent(pass)}`)
	}).then(res => {
		switch(res.status){
			case 200:
				window.location = url_;
				var emBase64 = btoa(pass);
				setCookie('JSESSIONIDD', email, '30');
				setCookiePass('COOKIEID', emBase64, '30');
			break;
			case 400:
				Swal.fire({
					type: 'error',
					title: 'Acceso Negado',
					text: 'Usuario Bloqueado.'
				})
			break;
			case 401:
				Swal.fire({
					imageUrl: './images/logo/logo.png',
					imageWidth: 150,
					imageHeight: 80,
					imageAlt: 'Custom image',
					title: 'Login Inválido!',
					text: 'Nombre de usuario o contraseña incorrecta.'
				})
			break;
		}

	})
});

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookiePass(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  	var c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
	  	if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function getCookiePass(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  	var c = ca[i];
	  	while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
	  	if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	var username = getCookie("JSESSIONIDD");
	var password = getCookiePass("COOKIEID");
	var deBase64 = atob(password);
	if (username != "") {
		document.getElementById("email").value = username;
		document.getElementById("senha").value = deBase64;
	}
}

function setCookieChecked(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookieChecked() {
	var check = getCookie("CheckBox");

	if (check === "true") {
		checkIn();
		checkCookie();
		$('#email').css("background"," #ffffe8");
		$('#senha').css("background"," #ffffe8");
	}
	if(check === "false"){ 
		uncheck();
	}
}

function checkIn() {
    document.getElementById("lembreme").checked = true;
}

function uncheck() {
    document.getElementById("lembreme").checked = false;
}