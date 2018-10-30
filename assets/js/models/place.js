var Position = function(lat,lng){
	this.lat = ko.observable(lat);
	this.lng = ko.observable(lng);
}

var Place = function(name, position,info){
	this.name = ko.observable(name);
	this.position = ko.observable(new Position(position));
	this.info = ko.observable(info);
}