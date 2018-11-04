var ViewModel = function(places){
	var self = this;
		
	self.favoritePlaces = ko.observableArray(places);

	this.filteredPlaces = ko.observableArray(places);
	
	this.selectedPlace = ko.observable({});

	this.filterTerm = ko.observable("");
	this.filterTerm.subscribe(function(newValue){
		const filterTerm = newValue.trim().toLowerCase()
		if(!filterTerm || filterTerm.length == 0){
			self.filteredPlaces(self.favoritePlaces());
		}else{
			self.filteredPlaces(self.favoritePlaces().filter((it)=>it.name().toLowerCase().indexOf(filterTerm) !== -1))
		}
	});

	this.selectPlace = function(place){
		self.selectedPlace(place);
	}
}