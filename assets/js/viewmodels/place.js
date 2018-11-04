var ViewModel = function(placesService){
	var self = this;
	
	this.placesService = placesService;

	this.places = ko.observableArray([]);

	this.filteredPlaces = ko.observableArray([]);
	
	this.selectedPlace = ko.observable({});

	this.filterTerm = ko.observable("");

	this.filterTerm.subscribe(function(newValue){
		const filterTerm = newValue.trim().toLowerCase()
		if(!filterTerm || filterTerm.length == 0){
			self.filteredPlaces(self.places());
		}else{
			self.filteredPlaces(self.places().filter((it)=>it.name().toLowerCase().indexOf(filterTerm) !== -1))
		}
	});

	this.selectPlace = function(place){
		self.selectedPlace(place);
	}

	this.favoritePlace = function(place){

	}

	this.loadPlaces = function(){
		const places = self.placesService.loadPlaces().map((place)=>new Place(
			place.name,
			place.position,
			place.wikipediaTitle,
			place.favorite || false
		));
		self.places(places);
		self.filteredPlaces(places);
	}
}