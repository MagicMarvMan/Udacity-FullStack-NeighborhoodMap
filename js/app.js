<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="robots" content="index,follow,noarchive">
	<title>Frankfurt, Germany &raquo; Neighborhood Mao</title>
	<meta name="description" content="This is a little map with my favourite spots in Frankfurt, Germany.">
	<meta name="keywords" content="frankfurt,frankfurt am main,frankfurt karte,frankfurt sehenswürdigkeiten">
	<meta name="creator" content="Marvin S. / https://marvnet.de">
	<meta name="author" content="Marvin S. / https://marvnet.de">
</head>
<body>
<script src="js/knockout-3.4.2.js"></script>
<script src="js/jquery-3.2.1.min.js"></script>
<!--<script src="js/app.js"></script>-->
<script>

'use strict';

var map;

var mapLocations = [
	{
		title: 'MyZeil (Shopping Center)',
		lat: 50.114354,
		long: 8.681447
	}
];

var Location = function(data) {
	console.log("Location initializes with name "+data.title);
	var self = this;
	this.latitude = data.lat;
	this.longitude = data.long;
	this.url = "";
	this.street = "";
	this.city = "";
	this.phone = "";

	this.visible = ko.observable(true);

	this.content = '<div class="info-window"><span class="title"><b>'+data.title+'</b></span></div>';

	this.iw = new google.maps.InfoWindow({content:self.content});

	this.mark = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat,data.long),
		map:map,
		title:data.title
	});

	this.sm = ko.computed(function() {
		if(this.visible() === true) {
			this.mark.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	self.iw.setContent(self.contentString);
}

function AppViewModel() {
	var self = this;

	this.query = ko.observable("");

	this.locations = ko.observableArray([]);

	map = new google.maps.Map(document.getElementsByTagName('body')[0], {
		zoom:12,
		center:{lat:50.113929,lng:8.680652}
	});

	console.log("Intialized map!");

	mapLocations.forEach(function(item) {
		self.locations.push(new Location(item));
		console.log("Pushed new item to locations");
	});

	console.log("Initialized appviewmodel!");

	//this.mapElem.style.height = window.innerHeight - 50;

}

function loadEverything() {
	ko.applyBindings(new AppViewModel());
	console.log("Loaded everything!");
}

function error() {
	alert("An error occured!");
	console.log("An error occured!!");
}
</script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDf7eLQTk4WpT-FO_ZL7YkUeFcB8QlOLRk&callback=loadEverything&libraries=places" onerror="error()"></script>
</body>
</html>