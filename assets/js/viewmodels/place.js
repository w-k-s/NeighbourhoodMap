/**
 * ViewModel: Main View Model of the map application
 * @constructor
 * @param {object} placesService - [placesService]{@link ../services/placesService.js|PlaceService}
 * @param {object} wikipediaService - [wikipediaService]{@link ../services/wikipediaService.js|WikipediaService}
 */
var ViewModel = function(placesService, wikipediaService) {
    var self = this;

    this.placesService = placesService;
    this.wikipediaService = wikipediaService;

    /* property observable array of place models */
    this.places = ko.observableArray([]);

    /* observable array of filtered place models */
    this.filteredPlaces = ko.observableArray([]);

    /* observable for the currently selected place */
    this.selectedPlace = ko.observable({});

    /* observable for the current instantaneousFilterTerm */
    this.instantaneousFilterTerm = ko.observable("");
    this.delayedFilterTerm = ko.pureComputed(this.instantaneousFilterTerm)
        .extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 400 } });
 
    /* observable for the place info that is displayed */
    this.placeInfo = ko.observable({});

    /* observable for error when loading place info */
    this.placeInfoError = ko.observable("");

    /* Subscribe to changes in instantaneousFilterTerm and update filteredPlaces accordingly */
    this.delayedFilterTerm.subscribe(function(newValue) {
        const filterTerm = newValue.trim().toLowerCase()
        if (!filterTerm || filterTerm.length == 0) {
            self.filteredPlaces(self.places());
        } else {
            self.filteredPlaces(self.places().filter((it) => it.name().toLowerCase().indexOf(filterTerm) !== -1))
        }
    });

    /**
    * @function Updates current selectedPlace value
    * @param {object} place - selected [place model]{@link ../models/place.js|Place}
    */
    this.selectPlace = function(place) {
        self.selectedPlace(place);
    }

    /**
    * @function Toggles favorite field of selected place and triggers saving places.
    * @param {object} place - [place model]{@link ../models/place.js|Place} whose favorite status has changed
    */
    this.favoritePlace = function(place) {
        place.favorite(!place.favorite());
        const places = self.places().map((place) => ko.toJS(place));
        self.placesService.savePlaces(places);
        self.filteredPlaces(self.filteredPlaces());
    }

    /**
    * @async
    * @function Loads list of places. Updates observable {@link places} field and observable {@link filteredPlaces} field.
    */
    this.loadPlaces = function() {
        const places = self.placesService.loadPlaces().map((place) => new Place(
            place.name,
            place.position,
            place.wikipediaTitle,
            place.favorite || false
        ));
        self.places(places);
        self.filteredPlaces(places);
    }

    /**
    * Loads linfo for given place using wikipediaService. Updates observable {@link placeInfo} field
    * @param {object} place - [place model]{@link ../models/place.js|Place} whose info is to be loaded.
    */
    this.loadPlaceInfo = function(place) {
        self.wikipediaService.loadArticle(place.wikipediaTitle(), function(content) {
            self.placeInfo({
                place: place,
                info: content
            });
        }, function(error) {
            console.log(`Error loading place info :${error}`);
            self.placeInfoError(`Error loading place info`);
        });
    }
}