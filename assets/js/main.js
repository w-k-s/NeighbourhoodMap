var map;
var markers = [];
var infoWindow;
var viewModel;

/**
* @function initializes the Map application.
* Should be used as the init callback of Google Maps
* @example
* <script 
	async 
	defer 
	src="https://maps.googleapis.com/maps/api/js?key=KEY&callback=init">
  </script>
*/
function init() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13
    });
    map.addListener('click', function() {
        closeInfoWindow();
        closeMenu();
    });

    const placesService = new PlacesService();
    const wikipediaService = new WikipediaService();
    viewModel = new ViewModel(placesService, wikipediaService);
    ko.applyBindings(viewModel);

    viewModel.places.subscribe((places) => {
        removeMarkers();
        addMarkers(map, places);
    });

    viewModel.filteredPlaces.subscribe((places) => {
        removeMarkers();
        addMarkers(map, places);
    });

    viewModel.selectedPlace.subscribe((place) => {
        closeMenu();
        const marker = getMarkerForPlace(place);
        if (marker) {
            onPlaceSelected(marker, place);
        }
    });

    viewModel.placeInfo.subscribe((placeInfo) => {
        const marker = getMarkerForPlace(placeInfo.place);
        if (marker) {
            infoWindow = new google.maps.InfoWindow({
                content: placeInfo.info,
                maxWidth: 300
            });
            infoWindow.open(map, marker);
        }
    });

    viewModel.placeInfoError.subscribe((errorMessage)=>{
    	window.alert(errorMessage);
    })

    viewModel.loadPlaces();
}

/**
* @function handles place selection
* @param {Object} marker - the marker for the selected place
* @param {Object} place - the selected place
*/
function onPlaceSelected(marker, place) {
    closeInfoWindow();
    toggleBounce(marker);
    viewModel.loadPlaceInfo(place);
}

/**
 * Map - Markers
 */

/**
* @function adds a marker for each of the given places on the given map.
* Zooms map in on the bounds of all places and centers within these bounds.
* @param {Object} map - a google Map instance
@ @paeam {array} places - array of places to mark
*/
function addMarkers(map, places) {
    var bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
        marker = new google.maps.Marker({
            title: place.name(),
            position: new google.maps.LatLng(place.position().lat(), place.position().lng()),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: getPinImage(place)
        });
        markers.push(marker);
        bounds.extend(marker.getPosition());
        marker.addListener('click', function(marker) {
            return () => {
                onPlaceSelected(marker, place)
            };
        }(marker))
    });
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
}

/**
* @function get the pin image that is appropriate for given place.
* e.g. returns a different colored pin for favorite places.
* @param {Object} place - the place whose pin image is needed.
* @returns {Object} a google maps MarkerImage that is appropriate to the place
*/
function getPinImage(place) {
    const pinColor = place.favorite() ? 'FFDF00' : 'ff0000';
    const url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor;
    return new google.maps.MarkerImage(url,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
}

/**
* @function Removes all markers from map
*/
function removeMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
}

/**
* @function Animates the marker (unless already animating) for a specific time
* @param {Object} marker - the marker to animate.
*/
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        setTimeout(() => {
            marker.setAnimation(null)
        }, 1000);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

/**
* @function Finds marker marking given place
* @param {Object} place - the place whose marker is needed.
* @returns {Object} the marker for the given place or null.
*/
function getMarkerForPlace(place) {
    const matches = markers.filter((marker) => marker.title === place.name());
    return matches.length == 0 ? null : matches[0];
}

/**
 * Map - Info Window
 */

/**
* @function closes infowindow if set.
*/
function closeInfoWindow() {
    if (infoWindow) {
        infoWindow.close();
        infoWindow = null;
    }
}

/**
 * Hamburger Menu
 */

/* The menu element */
const menu = document.getElementsByTagName("aside")[0];

/* The map container element */
const container = document.getElementById("container");

/* The width of the menu defined in the css file */
const widthPx = window.getComputedStyle(menu, null).getPropertyValue("width");

/**
* @function determines if side-menu is open
* @returns {boolean} true if the side-menu is open, otherwise false.
*/
function isMenuOpen() {
    return menu.style.left == '0px';
}

/**
* @function opens side menu
*/
function openMenu() {
    menu.style.left = 0;
    container.style.marginLeft = widthPx;
}

/**
* @function closes side menu
*/
function closeMenu() {
    menu.style.left = '-' + widthPx;
    container.style.marginLeft = 0;
}

/* Add click listener to toggle open and close meny when burger button is clicked */
document.getElementById("burger").addEventListener('click', function() {
    if (isMenuOpen()) {
        closeMenu();
    } else {
        openMenu();
    }
});