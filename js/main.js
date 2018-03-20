//Deploy to Production
function onclick_slide(selector_button, selector_slider){
	$(selector_button).click(function(){$(selector_slider).show(500);});
	$(selector_slider).mouseleave(function(){$(selector_slider).hide(500);});
}
var planner_control = {
	init: function(){
	},
	add: function(section_id,element_id, type , new_lat, new_lng){
		$.ajax({
			url: 'my_account/load_popup_add_to_my_trip',
			type: 'POST',
			data: {
					section_id: section_id,
					element_id: element_id,
					new_lat: new_lat,
					new_lng: new_lng
			},
			success:function (data) {
				var $pop_up = data;
				$('body').append($pop_up);
			}
		});
	},
	close_popup: function () {
		$('#popup_add').remove();
	},
	// add to my collection old
	add_collection: function(section_id,element_id, type ){ 
		$.ajax({
			url: 'my_account/collection_add/',
			type: "GET",
			data: {
				'section_id':section_id,
				'element_id':element_id
			},
			dataType:'json',
			success: function(data) {
				if(data.error_msg){
					alert(data.error_msg);
				}
					
				if(!data.result){
					return ;
				}
				var $target = $('.planner_collection_add_'+section_id+'_'+element_id), icon = $target.find('em');
				$target.addClass('btn-cancle').unbind('click').attr('onclick','');
				icon.addClass('fa-minus-circle').removeClass('fa-plus-circle');
				$('#trip_planner_box_collection').html(data.collection);
				$('#trip_planner_box_calendar').html(data.calendar);
				
				if(typeof(type !=='undefined'))
				{
					location.reload();
				}
			}
		});
	},
	auto_add_collection: function(section_id,element_id ,callback){
		$.ajax({
			url: 'my_account/add_collection_get_collection_id',
			type: 'POST',
			dataType: 'json',
			data: {
				'section_id':section_id,
				'element_id':element_id
			},
			success:function (data) {
				callback(data);
			}
		});
		
	},
	get_curret_position: function(calendar_id, num_day, callback){
		$.ajax({
			url: 'my_account/get_current_position_calendar_rounting_ajax',
			type: 'POST',
			dataType: 'json',
			data: {
				calendar_id: calendar_id, 
				start_day: num_day
			},
			success: function(data){
				position_current = data.position;
				callback(data.position);
			}
		});
	},
	select_on_change: function () {
		$('.select_day').on('change', function(event) {
			var calendar_id = $(this).closest('li').attr('calendar_id');
			var element_id = $(this).closest('ul').attr('element_id');
			var section_id = $(this).closest('ul').attr('section_id');
			var lang = $(this).closest('ul').attr('lang');
			var new_lat = $(this).closest('ul').attr('new_lat');
			var new_lng = $(this).closest('ul').attr('new_lng');
			var num_day = $(this).val();
			var cur_lat = $('option:selected', this).attr('cur_lat');
			var cur_lng = $('option:selected', this).attr('cur_lng');
			var cur_position = $('option:selected', this).attr('cur_position');
			var nostra_key = $(this).closest('ul').attr('nostra_key');
			var position = cur_position + 1;
			var collection_id = 0;
			var position_current = 0;
			if (!new_lat) {}
			if (num_day > 0) {
				planner_control.auto_add_collection(section_id,element_id,function(id){
					collection_id = id.collection_id;
					console.log("calendar_id :"+calendar_id +" collection_id:"+collection_id+" num_day:"+num_day+" cur_position:"+cur_position+" cur_lat:"+cur_lat+" cur_lng:"+cur_lng+" new_lat:"+new_lat+" new_lng:"+new_lng+" nostra_key:"+ nostra_key);
					if(cur_lat != '' && cur_lng != '' && new_lat != '' &&  new_lng != ''){
						calculate_routing.get_routing(calendar_id, collection_id, num_day, position, cur_lat, cur_lng, new_lat, new_lng, nostra_key, '',planner_control.ajax_add_collection_to_my_trip);
					}else{
						planner_control.ajax_add_collection_to_my_trip(calendar_id, collection_id, num_day, position, '', '');
					}
				});
			}
		});
	},
	ajax_add_collection_to_my_trip: function(calendar_id, collection_id, num_day, position, resultsObj, item_id){
	    $.ajax({
	        type: 'POST',
	        dataType: 'json',
	        url: 'my_account/add_collection_to_my_plan_by_main_popup',
	        data: {
	        	'calendar_id':calendar_id,
	        	'collection_id':collection_id,
	        	'num_day':num_day,
	        	'position':position,
	        	'route_detail':resultsObj
	        },
			success: function (data) {
				if(data.error_msg){
					alert(data.error_msg);
				}
				if(!data.result){
					return ;
				} else {
					alert(data.success_msg);

				}
			}
	    });
    }   
},
bookmark_control = {
	saved_search: function(btn, title, link){
		var btn = $(btn);
		$.ajax({
			url: "my_account/saved_search_add/",
			data:{
				'title':title,
				'link':link
			},
			dataType:'json',
			cache: false,
			success: function(data){
				if(data.text){
					alert(data.text);
				}
				if(data.result){
					btn.unbind('click').attr('onclick', '').addClass('btn-cancle').removeClass('btn-submit');
				}
			}
		});
	}
},
trip_planner_control = {
	init: function(){
	},
	add: function(suggest_id, start_date, type ,start_destination, end_destination, photo_path){
		var result = [''];
		if(photo_path.length != 0){
			result= photo_path.split('/');
		}
		$.ajax({
			url: 'my_account/save_trip_suggestion_to_my_trip/',
			type: "GET",
			data: {
				'start_date':start_date,
				'suggest_id':suggest_id,
				'start_destination': start_destination,
				'end_destination': end_destination,
				'photo': photo_path,
				'photo_path': result[result.length - 1],
			},
			dataType:'json',
			success: function(data) {
				if(data.error_msg){
					alert(data.error_msg);
				}
				if(!data.result){
					return ;
				}
				alert(data.sec_msg);

			}
		});
	},
	delete: function(calendar_profile_id) {
		var del_confirm = confirm('Are you sure you want to delete?');
		if (del_confirm) {
			$.ajax({
				url: 'my_account/remove_my_trip/',
				type: "POST",
				data: {
					'calendar_profile_id':calendar_profile_id
				},
				dataType:'json',
				success: function(data) {
					if(data.error_msg){
						alert(data.error_msg);
					}
					if(!data.result){
						return ;
					}
					// alert(data.sec_msg);
					$("#box_"+calendar_profile_id).remove();
				}
			});
		}
	}
},
// calculate_routing = {
// 	init: function(){
// 	},
// 	get_routing: function(calendar_id, collection_id, num_day, position, start_destination, end_destination, nostra_key, callback){ 
// 	   objParam = getObjectFindBetweenPlace.getParam(start_destination, end_destination, nostra_key);
// 	    $.ajax({ 
// 	        type: "POST", 
// 	        url: "https://map.tourismthailand.org/TATService/InfoServices.svc/FindTravelingInfo",
// 	        data:JSON.stringify(objParam), 
// 	        success: function (obj) { 
// 	        	console.log(obj)
// 	             callback(calendar_id, collection_id, num_day, position, start_destination, end_destination, obj.Result);
// 	        } 
// 	    }); 
// 	} 

// },

calendar_planner = {
	delete: function(calendar_profile_id) {
		var del_confirm = confirm('Are you sure you want to delete?');
		if (del_confirm) {
			$.ajax({
				url: 'my_account/remove_my_trip/',
				type: "POST",
				data: {
					'calendar_profile_id':calendar_profile_id
				},
				dataType:'json',
				success: function(data) {
					if(data.error_msg){
						alert(data.error_msg);
					}
					if(!data.result){
						return ;
					}
					// alert(data.sec_msg);
					// $("#box_"+calendar_profile_id).remove();
					window.location=base_url+'my_account/my_plan';
				}
			});
		}
	}
}
calculate_routing = {
	init: function(){
	},
	get_routing: function(calendar_id, collection_id, num_day, position, cur_lat, cur_long, new_lat, new_long, nostra_key, item_id, callback){ 
	   // objParam = getObjectFindBetweenPlace.getParam(start_destination, end_destination, nostra_key);
	   if(cur_lat != '' && cur_long != '' && new_lat != '' &&  new_long != ''){
		   	  $.ajax({ 
		        url: "//api.nostramap.com/NostraStandardServices/routeService/RouteTH",
				jsonp: "callback",
				dataType: "jsonp",
				contentType: "application/json",	        
		        data:{
		        	'Key': nostra_key, 
					'Stops': "[{'name':'location_0','lat':"+cur_lat+",'lon':"+cur_long+"},{'name':'location_1','lat':"+new_lat+",'lon':"+new_long+"}]",
					'Mode' : 'CAR',
					'Lang' : 'T'
		        },
		        success: function (obj) { console.log(obj)
		        	if(obj.Result != null){
						$result = jQuery.parseJSON(obj.Result);
			        	if(typeof $result.directions[0] != 'undefined'){
			        		callback(calendar_id, collection_id, num_day, position, $result.directions[0].summary, item_id);
			        	}else{
			        		callback(calendar_id, collection_id, num_day, position, '', item_id);
			        	}
		        	}else{
		        		 callback(calendar_id, collection_id, num_day, position, '', item_id);
		        	}
		        } 
		    }); 
	   }else{
	   		 callback(calendar_id, collection_id, num_day, position, '', item_id);
	   }

	}
},

getObjectFindPlace = {
	getParam: function (destination_start_code, destination_end_code, key_nostra){
	    var objParam = { 
	        'key': key_nostra,
	        'prov_start_code': destination_start_code, 
	        'prov_end_code': destination_end_code
	    }
	    return objParam;
	}
},

getRouteBetweenPlace = {
	getRoute: function(cur_lat, cur_long, new_lat, new_long , nostra_key, id_name, callback){
		$.ajax({ 
	        url: "//api.nostramap.com/NostraStandardServices/routeService/RouteTH",
			jsonp: "callback",
			dataType: "jsonp",
			contentType: "application/json",	        
	        data:{
	        	'Key': nostra_key, 
				'Stops': "[{'name':'location_0','lat':"+cur_lat+",'lon':"+cur_long+"},{'name':'location_1','lat':"+new_lat+",'lon':"+new_long+"}]",
				'Mode' : 'CAR',
				'Lang' : 'T'
	        },
	        success: function (obj) { 
               callback(id_name, obj.Result);  
	        } 
	    }); 
	}
},

getObjectFindBetweenPlace = {
	getParam: function (destination_start_code, destination_end_code, key_nostra){
	    var objParam = { 
	        'key': key_nostra,
	        'prov_start_code': destination_start_code, 
	        'prov_end_code': destination_end_code
	    }
	    return objParam;
	}
},

trip_planner_tools = {
	get_routing: function(planner_id, num_day, position, cur_lat, cur_long, new_lat, new_long, nostra_key, callback){ 
		$.ajax({ 
			url: "//api.nostramap.com/NostraStandardServices/routeService/RouteTH",
			jsonp: "callback",
			dataType: "jsonp",
			contentType: "application/json",	        
	        data:{
	        	'Key': nostra_key, 
						'Stops': "[{'name':'location_0','lat':"+cur_lat+",'lon':"+cur_long+"},{'name':'location_1','lat':"+new_lat+",'lon':"+new_long+"}]",
						'Mode' : 'CAR',
						'Lang' : 'T'
	        },
	        success: function (obj) { 
				if(obj.Result != null){
					$result = jQuery.parseJSON(obj.Result);
		        	if(typeof $result.directions[0] != 'undefined'){
		        		callback(planner_id, num_day, position, $result.directions[0].summary);
		        	}else{
		        		callback(planner_id, num_day, position, '');
		        	}
	        	}else{
	        		 callback(planner_id, num_day, position, '');
	        	}	        	
	        } 
	    }); 
	}
};
var cookie = {
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
	}
};
var redirect = {
	url: function (link_url , lang_code) {
		// if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
			// window.location =link_url;
			// return;
		// }
		cookie.set_cookie('tat_lang', lang_code, 30);
		var cookie_code = cookie.get_cookie('tat_lang');
		if (cookie_code != "") {
			window.location.href=link_url;
		}
	}
};
$(function(){
	$('.select_rediect_on_value').change(function(){
		// if (location.hostname != "localhost" || location.hostname != "127.0.0.1") {
			var lang_code = $('option:selected', this).attr('lang_code');
			cookie.set_cookie('tat_lang', lang_code, 30);
		// }

		window.location.href=$(this).val();
	});
	onclick_slide('.btn_language_menu', '#select_language');
	onclick_slide('.btn_link_menu', '#link_menu');
	$('#inquiry_toggle').click(function(){
		$('#inquiry_toggle a').toggle();
		$('#inquiry_form').slideToggle();
	});

});
