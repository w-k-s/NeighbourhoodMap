/**
 * Default Places
 */
const DEFAULT_PLACES = [{
		name: 'Blue Mosque',
		position: {
			lat: 41.0054,
			lng: 28.9768
		},
		wikipediaTitle: 'Sultan_Ahmed_Mosque',
	},{
		name: 'Aya Sofya',
		position: {
			lat: 41.0086,
			lng: 28.9802
		},
		wikipediaTitle: 'Hagia_Sophia',
	},{
		name: 'Topkapi Palace',
		position:{
			lat: 41.0115,
			lng: 28.9834
		},
		wikipediaTitle: 'Topkapı_Palace',
	},{
		name: 'Column of Constantine',
		position: {
			lat: 41.0080753,
			lng: 28.9716165
		},
		wikipediaTitle: 'Column_of_Constantine'
	},{
		name: 'Grand Bazar',
		position: {
			lat: 41.010581,
			lng: 28.967933
		},
		wikipediaTitle: 'Grand_Bazaar,_Istanbul'
	}
];


const PlacesService = function(){
	this.loadPlaces = function(){
		var places = DEFAULT_PLACES;
		if (localStorage.places) {
			places = JSON.parse(localStorage.places);
		}
		return places;
	};

	this.savePlaces = function(places){
		localStorage.places = JSON.stringify(places);
	}
}