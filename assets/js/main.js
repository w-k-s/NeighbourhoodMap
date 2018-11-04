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

function getPlaces(){
	return DEFAULT_PLACES.map((place)=>new Place(
		place.name,
		place.position,
		place.wikipediaTitle,
		place.favorite || false
	));
}



/**
 * Google Map
 */

var places = getPlaces();
var map;
var markers = [];
var infoWindow;
var wikipediaService = new WikipediaService();

function initMap() {	
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: places[0].position().lat(), lng: places[0].position().lng()},
	  zoom: 13
	});
	map.addListener('click',function(){
		closeInfoWindow();
	});
	addMarkers(map,places);
}

function addMarkers(map,places){
	var bounds = new google.maps.LatLngBounds();
	places.forEach((place)=>{
		marker = new google.maps.Marker({
			title: place.name(),
	    	position: new google.maps.LatLng(place.position().lat(), place.position().lng()),
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
	closeInfoWindow();
	const place = getPlaceForMarker(marker);
	if(place){
		wikipediaService.loadArticle(place.wikipediaTitle(),function(content){
			infoWindow = new google.maps.InfoWindow({
				content: content,
				maxWidth: 300
			});
			infoWindow.open(map, marker);
		},function(error){
			console.log('error');
			console.log(error);
		});
		toggleBounce(marker);
	}
}

function closeInfoWindow(){
	if(infoWindow){
		infoWindow.close();
		infoWindow = null;
	}
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
	const matches = markers.filter((marker)=> marker.title === place.name());
	return matches.length == 0? null : matches[0];
}

function getPlaceForMarker(marker){
	const matches = places.filter((place) => place.name() === marker.title );
	return matches.length == 0? null : matches[0];
}

/**
 * Initialize Application
 */

const viewModel = new ViewModel(places);
ko.applyBindings(viewModel);

viewModel.filteredPlaces.subscribe((places)=>{
	removeMarkers();
	addMarkers(map,places);
});

viewModel.selectedPlace.subscribe((place)=>{
	closeMenu();
	const marker = getMarkerForPlace(place);
	if (marker) {
		onMarkerClicked(marker);
	}
});

const menu = document.getElementsByTagName("aside")[0];
const widthPx = window.getComputedStyle(menu, null).getPropertyValue("width");

function isMenuOpen(){
	return menu.style.left == '0px';
}

function openMenu(){
	menu.style.left = 0;
}

function closeMenu(){
	menu.style.left = '-'+widthPx;
}

document.getElementById("burger").addEventListener('click',function(){
	
	if(menu.style.display === 'none'){
		return;
	}
	
	if(isMenuOpen()){
		closeMenu();
	}else{
		openMenu();
	}
});
