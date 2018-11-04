/**
 * Google Map
 */

var map;
var markers = [];
var infoWindow;
var wikipediaService = new WikipediaService();

function init() {	
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13
	});
	map.addListener('click',function(){
		closeInfoWindow();
	});

	const placesService = new PlacesService();
	const viewModel = new ViewModel(placesService);
	ko.applyBindings(viewModel);

	viewModel.places.subscribe((places)=>{
		removeMarkers();
		addMarkers(map,places);
	});
	
	viewModel.filteredPlaces.subscribe((places)=>{
		removeMarkers();
		addMarkers(map,places);
	});

	viewModel.selectedPlace.subscribe((place)=>{
		closeMenu();
		const marker = getMarkerForPlace(place);
		if (marker) {
			onPlaceSelected(marker,place);
		}
	});

	viewModel.loadPlaces();
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
			return ()=>{onPlaceSelected(marker, place)};
		}(marker))
	});
	map.fitBounds(bounds);
	map.setCenter(bounds.getCenter());
}

function removeMarkers(){
	markers.forEach((marker)=>marker.setMap(null));
	markers = [];
}

function onPlaceSelected(marker, place){
	closeInfoWindow();
	
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
