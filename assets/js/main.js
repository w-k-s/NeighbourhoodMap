/**
 * Init App
 */

var map;
var markers = [];
var infoWindow;
var viewModel;

function init() {	
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13
	});
	map.addListener('click',function(){
		closeInfoWindow();
		closeMenu();
	});

	const placesService = new PlacesService();
	const wikipediaService = new WikipediaService();
	viewModel = new ViewModel(placesService, wikipediaService);
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

	viewModel.placeInfo.subscribe((placeInfo)=>{
		const marker = getMarkerForPlace(placeInfo.place);
		if(marker){
			infoWindow = new google.maps.InfoWindow({
					content: placeInfo.info,
					maxWidth: 300
			});
			infoWindow.open(map, marker);
		}
	})

	viewModel.loadPlaces();
}

function onPlaceSelected(marker, place){
	closeInfoWindow();
	toggleBounce(marker);
	viewModel.loadPlaceInfo(place);
}

/**
 * Map - Markers
 */

function addMarkers(map,places){
	var bounds = new google.maps.LatLngBounds();
	places.forEach((place)=>{
		marker = new google.maps.Marker({
			title: place.name(),
	    	position: new google.maps.LatLng(place.position().lat(), place.position().lng()),
	    	map: map,
	    	animation: google.maps.Animation.DROP,
	    	icon: getPinImage(place)
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

function getPinImage(place){
	const pinColor = place.favorite() ? 'FFDF00' : 'ff0000';
	const url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor;
	return new google.maps.MarkerImage(url,
    	new google.maps.Size(21, 34),
    	new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
}

function removeMarkers(){
	markers.forEach((marker)=>marker.setMap(null));
	markers = [];
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

/**
 * Map - Info Window
 */

function closeInfoWindow(){
	if(infoWindow){
		infoWindow.close();
		infoWindow = null;
	}
}

/**
 * Hamburger Menu
 */

const menu = document.getElementsByTagName("aside")[0];
const container = document.getElementById("container");
const widthPx = window.getComputedStyle(menu, null).getPropertyValue("width");

function isMenuOpen(){
	return menu.style.left == '0px';
}

function openMenu(){
	menu.style.left = 0;
	container.style.marginLeft = widthPx;
}

function closeMenu(){
	menu.style.left = '-'+widthPx;
	container.style.marginLeft = 0;
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
