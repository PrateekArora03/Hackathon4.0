// application/views/template/header.php
// <script type="text/javascript" src="http://www.geoplugin.net/javascript.gp" ></script>

var geo_ip = {
	get_language: function(callback){
		// if (geoplugin_countryCode() != null) {
			// return geoplugin_countryCode();
		// }
		$.ajax({
			url: '//freegeoip.net/json/',
			type: 'GET',
			success: function (data) {				
				console.log(data);
				callback(data.country_code.toLowerCase());
			}
		});
	},
	get_country_code: function (data){
		if(typeof data == "undefined" || data == null) return "inter";
		geo_ip.set_cookie('tat_lang', data, 30);
		geo_ip.redirect_site(geo_ip.get_cookie('tat_lang'));
	},
	get_language_header:function(){
		var userLang = navigator.language || navigator.userLanguage;
		return userLang;
	},
	get_cookie: function (cname) {
		var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length,c.length);
	        }
	    }
	    return "";
	},
	set_cookie: function(cname, cvalue, exdays){
		var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
			if(window.location.href.indexOf('localhost') == -1){
				if(window.location.href.indexOf('uat.tourismthailand.org') == -1){
					document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=.tourismthailand.org;path=/";
				}else{					
					document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=.uat.tourismthailand.org;path=/";
				}
			}else{
				document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=localhost;path=/";
			}
	},
	check_cookie: function () {
		if (geo_ip.get_cookie('tat_lang') == "") {
			$.ajax({
				url: 'home/load_popup_redirect_language',
				type: 'POST',
				data: {asd: 'test'},
				success: function (data) {
					var $pop_up = data;
					$('body').append($pop_up);
				}
			});
			//geo_ip.set_cookie('tat_lang', geo_ip.get_language(), 30);
			//console.log("set cookie "+geo_ip.get_language());	domain=example.com
		} else {
			if(geo_ip.get_cookie('tat_lang') == 18){
				geo_ip.set_cookie('tat_lang', 'inter', 30);				
				geo_ip.redirect_site(geo_ip.get_cookie('tat_lang'));
			}else{
				geo_ip.redirect_site(geo_ip.get_cookie('tat_lang'));
			}
		}
	},
	redirect_site: function (lang_code) {
		$.ajax({
			url: 'home/redirect_page_language',
			type: 'post',
			dataType: 'json',
			data: {
				lang_code: lang_code
			},
			success: function (data) {
				console.log(lang_code + " " + data);
				
				planner_control.close_popup();
				if (lang_code != "inter") {
					window.location = data;
				} 
			}
		});
	}

};

$(document).ready(function() {
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
	} else {
		if (tatlang == 0) {
			geo_ip.check_cookie();
		}
	}

});