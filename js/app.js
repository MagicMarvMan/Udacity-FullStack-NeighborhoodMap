'use strict';

var map;



var Location = function(data) {
	var self = this;

	this.title = "";
	if(typeof data.title !== 'undefined') {
			this.title = data.title;
			console.log("Using predefined title: "+self.title);
	}

	console.log("Location initializes with name "+data.title);
	
	this.pre_data = data;
	this.latitude = data.lat;
	this.longitude = data.long;
	this.url = "";
	this.street = "";
	this.city = "";
	this.phone = "";
	this.address = "";
	this.main_category = "";
	this.formatted_title = "";
	this.categories = "";

	this.visible = ko.observable(true);

	$.ajax({
		method:"get",
		url:"https://api.foursquare.com/v2/venues/search",
		data:{
			ll:self.latitude+","+self.longitude,
			v:"20170801",
			client_id:"PLTZT1HHN0Q20XAE5TRDFUPJLV3YKW4F5ZA00SJYPVTOHO5B",
			client_secret:"RMJKT5CTWVEIFUEKRSAAF01TTABE53IA2OU4IGA4ZRPL1TBV",
			limit:"1"
		}
	}).done(function(resp) {
		console.log(resp);
		self.foursquare_response = resp.response.venues[0];
		self.address = "<pre>" + self.foursquare_response.location.formattedAddress[0] + "<br>" + self.foursquare_response.location.formattedAddress[1] + "<br>" + self.foursquare_response.location.formattedAddress[2] + "</pre>";
		

		self.main_category = self.foursquare_response.categories[0].name;
		self.formatted_title = "<b>"+self.foursquare_response.name+" ("+self.main_category+")</b>";
		self.complete_title = self.foursquare_response.name+" ("+self.main_category+")";
		self.id = self.foursquare_response.id;

		if(self.title == "") {
			self.title = self.foursquare_response.name;
		}

	});


	
	this.content = '<div class="info-window"><span class="title"><b>'+self.formatted_title+'</b></span>'+self.address+'</div>';

	this.iw = new google.maps.InfoWindow({content:self.content});

	this.mark = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat,data.long),
		map:map,
		title:self.complete_title
	});


	this.mark.addListener('click',function() {
		self.content = '<div class="info-window"><span class="title"><b>'+self.formatted_title+'</b></span>'+self.address+'</div>';
		self.iw.setContent(self.content);
		self.iw.open(map,this);
		self.mark.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			self.mark.setAnimation(null);
		},2100);
	});

	this.showWindowOnClick = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

	this.sm = ko.computed(function() {
		if(this.visible() === true) {
			this.mark.setMap(map);
		} else {
			this.mark.setMap(null);
		}
		return true;
	}, this);

	self.iw.setContent(self.contentString);
}

function AppViewModel() {
	var self = this;

	this.query = ko.observable("");

	this.allLocations = ko.observableArray([]);

	map = new google.maps.Map(document.getElementsByTagName('mapframe')[0], {
		zoom:12,
		center:{lat:50.113929,lng:8.680652}
	});

	console.log("Intialized map!");

	mapLocations.forEach(function(item) {
		self.allLocations.push(new Location(item));
		console.log("Pushed new item to locations");
	});

	this.filtered = ko.computed(function() {
		var filt = self.query().toLowerCase();
		if(!filt) {
			self.allLocations().forEach(function(loc) {
				loc.visible(true);
			});
			return self.allLocations();
		} else {
			return ko.utils.arrayFilter(self.allLocations(), function(loc) {
				var str = loc.title.toLowerCase();
				var res = (str.search(filt) >= 0);
				loc.visible(res);
				return res;
			}
		}
	}, self);

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