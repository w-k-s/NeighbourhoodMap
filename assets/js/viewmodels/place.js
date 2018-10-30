var ViewModel = function(places){
	var self = this;
		
	self.favoritePlaces = ko.observableArray(places);

	this.filteredPlaces = ko.observableArray(places);
	
	self.selectedPlace = ko.observable({});

	self.filterTerm = ko.observable("");
	self.filterTerm.subscribe(function(newValue){
		const filterTerm = newValue.trim().toLowerCase()
		if(!filterTerm || filterTerm.length == 0){
			self.filteredPlaces(self.favoritePlaces());
		}else{
			self.filteredPlaces(self.favoritePlaces().filter((it)=>it.name.toLowerCase().indexOf(filterTerm) !== -1))
		}
	});

	self.selectPlace = function(place){
		self.selectedPlace(place);
	}
}