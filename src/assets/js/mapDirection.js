function calculateDirection() {
  var myLatLin = { lat: 50.5039, lng: 4.4699 };
  var mapOptions = {
    center: myLatLin,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  //Create Map
  var map = new google.maps.Map(
    document.getElementById("googleMap"),
    mapOptions
  );

  //Create a directions service object to usethe route method
  var directionsService = new google.maps.DirectionsService();

  // Create a directionRenderer object which we will use to display
  var directionsDisplay = new google.maps.DirectionsRenderer();

  // Bind the directionsRenderer to the map
  directionsDisplay.setMap(map);

  //Create request

  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    // travelMode: google.maps.TravelMode.DRIVING,
    travelMode: "DRIVING",
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  //Pass the request to the route method

  // Displaying the direction result
  directionsService.route(request, (result, status) => {
    if (status == "OK") {
      //Get distance and time
      const output = document.querySelector("#output");
      output.innerHTML =
        "<div class='alert-info'>From: " +
        document.getElementById("from").value +
        ".<br />To: " +
        document.getElementById("to").value +
        ".<br />Driving distance: " +
        result.routes[0].legs[0].distance.text +
        ".<br />Duration" +
        result.routes[0].legs[0].duration.text +
        "</div>";

      //Display route
      directionsDisplay.setDirections(result);
    } else {
      //Delete route from map
      directionsDisplay.setDirections({ routes: [] });

      //center map in Belgium
      map.setCenter(myLatLin);

      //Show error message
      output.innerHTML =
        "<div class='alert-danger' >Couldn't retrieve driving distance.</div>";
    }
  });

  //......
  // Create autocomplete objects for all inputs
  var options = {
    types: ["(cities)"],
  };

  var input1 = document.getElementById("from");
  var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

  var input2 = document.getElementById("to");
  var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
}
