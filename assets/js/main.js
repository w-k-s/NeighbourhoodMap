var places = [{
		name: 'Blue Mosque',
		position: {
			lat: 41.0054,
			lng: 28.9768
		},
		info:"Historic mosque built by Sultan Ahmet in 1609",
	},{
		name: 'Aya Sofya',
		position: {
			lat: 41.0086,
			lng: 28.9802
		},
		info: 'Originally a church, then a mosque and now a museum'
	},{
		name: 'Topkapi Palace',
		position:{
			lat: 41.0115,
			lng: 28.9834
		},
		info: "Historic residence of the ottoman sultans"
	},{
		name: 'Çemberlitas Muhallebicisi',
		position: {
			lat: 41.0080753,
			lng: 28.9716165
		},
		info: 'Authentic Turkish Restaurant'
	},{
		name: 'Cankurtaran Railway station',
		position: {
			lat: 41.0042462,
			lng: 28.9811903
		},
		info: "Old 1920s style railway station"
	}
];

var map;
var markers = [];
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: places[0].position,
	  zoom: 13
	});
	addMarkers(map,places);
}

function addMarkers(map,places){
	var bounds = new google.maps.LatLngBounds();
	places.forEach((place)=>{
		marker = new google.maps.Marker({
			title: place.name,
	    	position: new google.maps.LatLng(place.position.lat, place.position.lng),
	    	map: map,
	    	animation: google.maps.Animation.DROP,
	    });
		markers.push(marker);
		bounds.extend(marker.getPosition());
		marker.addListener('click',function(marker){
			return ()=>{onMarkerClicked(marker)};
		}(marker))
	});
	map.fitBounds(bounds);
	map.setCenter(bounds.getCenter());
}

function removeMarkers(){
	markers.forEach((marker)=>marker.setMap(null));
	markers = [];
}

function onMarkerClicked(marker){
	toggleBounce(marker);
}

function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
	  marker.setAnimation(null);
	} else {
		setTimeout(()=>{
			marker.setAnimation(null)
		},1000);
	  	marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

function getMarkerForPlace(place){
	const matches = markers.filter((marker)=>{return marker.title === place.name});
	return matches.length == 0? null : matches[0];
}

const viewModel = new ViewModel(places);
ko.applyBindings(viewModel);

viewModel.filteredPlaces.subscribe((places)=>{
	removeMarkers();
	addMarkers(map,places);
});

viewModel.selectedPlace.subscribe((place)=>{
	const marker = getMarkerForPlace(place);
	if (marker) {
		onMarkerClicked(marker);
	}
});
