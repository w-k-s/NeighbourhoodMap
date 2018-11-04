var ViewModel = function(placesService, wikipediaService){
	var self = this;
	
	this.placesService = placesService;
	this.wikipediaService = wikipediaService;

	this.places = ko.observableArray([]);

	this.filteredPlaces = ko.observableArray([]);
	
	this.selectedPlace = ko.observable({});

	this.filterTerm = ko.observable("");

	this.placeInfo = ko.observable({});

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
		place.favorite(!place.favorite());
		const places = self.places().map((place)=>ko.toJS(place));
		self.placesService.savePlaces(places);
		self.filteredPlaces(self.filteredPlaces());
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

	this.loadPlaceInfo = function(place){
		self.wikipediaService.loadArticle(place.wikipediaTitle(),function(content){
			self.placeInfo({
				place: place,
				info: content
			});
		},function(error){
			console.log(`Error loading place info: ${error}`);
		});
	}
}