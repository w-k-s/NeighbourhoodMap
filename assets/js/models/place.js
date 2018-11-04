var Position = function(lat,lng){
	this.lat = ko.observable(lat);
	this.lng = ko.observable(lng);
}

var Place = function(name, position,wikipediaTitle, favorite){
	self = this;
	this.name = ko.observable(name);
	this.position = ko.observable(new Position(position.lat,position.lng));
	this.wikipediaTitle = ko.observable(wikipediaTitle);
	this.favorite = ko.observable(favorite);
}