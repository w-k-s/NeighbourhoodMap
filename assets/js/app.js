var places = [
	"Blue Mosque",
	"Aya Sofya",
	"Topkapi Palace",
	"Pide Keyfi",
	"Cimberlitas"
];

var ViewModel = function(){
	var self = this;
	self.favoritePlaces = ko.observableArray(places);
	this.filteredPlaces = ko.observableArray(places);
	self.filterTerm = ko.observable("");
	self.filterTerm.subscribe(function(newValue){
		const filterTerm = newValue.trim().toLowerCase()
		if(!filterTerm || filterTerm.length == 0){
			self.filteredPlaces(self.favoritePlaces());
		}else{
			self.filteredPlaces(self.favoritePlaces().filter((it)=>it.toLowerCase().indexOf(filterTerm) !== -1))
		}
	});
}

ko.applyBindings(new ViewModel());