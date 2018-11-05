/**
 * Represents a Geographic position.
 * @constructor
 * @param {float} lat - The latitude of the position.
 * @param {float} lng - The longitude of the position.
 */
var Position = function(lat, lng) {
    this.lat = ko.observable(lat);
    this.lng = ko.observable(lng);
}

/**
 * Represents a Place.
 * @constructor
 * @param {string} name - The name of the place.
 * @param {object} position - The geographic [position]{@link Position} of the place.
 * @param {string} wikipediaTitle - The URL title of the place's wikipedia article.
 * @param {boolean} favorite - Indicates whether the place has been favorited
 */
var Place = function(name, position, wikipediaTitle, favorite) {
    self = this;
    this.name = ko.observable(name);
    this.position = ko.observable(new Position(position.lat, position.lng));
    this.wikipediaTitle = ko.observable(wikipediaTitle);
    this.favorite = ko.observable(favorite);
}