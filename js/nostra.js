//Deploy to Production
function get_map_nostra (name_start, lat_start, long_start, name_end, lat_end, long_end, callback) {
	var data_content = {
	 	'start': {'name': name_start, 'longitude': long_start, 'latitude': lat_start, 'useCurrent': false },
	 	'end': {'name': name_end, 'longitude': long_end, 'latitude': lat_end, 'useCurrent': false },
 		'method': 'private',
 		'type': 'car'
 	};
	$.ajax({
	 	url: 'https://map.tourismthailand.org/TATService/Share.svc/GetLocationString',
	 	type: 'POST',
	 	dataType: 'json',			 	
		data: JSON.stringify(data_content),
	 	success: function(data){
	 		callback(data.result[0].token);
	 	}
	 });
	 
}

function get_map_nostra_custom (name_start, lat_start, long_start, name_end, lat_end, long_end, method, type,  callback) {
	var data_content = {
	 	'start': {'name': name_start, 'longitude': long_start, 'latitude': lat_start, 'useCurrent': false },
	 	'end': {'name': name_end, 'longitude': long_end, 'latitude': lat_end, 'useCurrent': false },
 		'method': method,
 		'type': type
 	};
	$.ajax({
	 	url: 'https://map.tourismthailand.org/TATService/Share.svc/GetLocationString',
	 	type: 'POST',
	 	dataType: 'json',			 	
		data: JSON.stringify(data_content),
	 	success: function(data){
	 		callback(data.result[0].token);
	 	}
	 });
	 
}