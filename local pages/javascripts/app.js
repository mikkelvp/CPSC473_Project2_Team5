 var map;
          $(document).ready(function(){
            map = new GMaps({
              el: '#map',
              lat: 33.882322,
              lng: -117.886511
            });        
     // click on current address button
    $("#showMyLocation").click(function (event) {
        event.preventDefault();
        $(this).html('Determining address...');

        // to show the red marker 
         GMaps.geolocate({
        success: function(position){
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          var geocoder = new google.maps.Geocoder();
          var latLng   = new google.maps.LatLng(latitude,longitude);

          map.setCenter(latitude, longitude);
          map.addMarker({
                lat: latitude,
                lng: longitude,
                icon:{ // custom marker for current location
                url: 'http://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/32/location_pin.png'
                },
                title: 'You are here'
              });
             geocoder.geocode({
                'latLng': latLng
            }, function (results, status) {    
            // to show your current address
                for (var i = 0; i < results[0].address_components.length; i++) {
                    var address = results[0].address_components[i];
                    if (address.types[0] == "postal_code") {
                        $('#zipcode').html(address.long_name);
                        $('#showMyLocation').hide();
                        $("#current").val(results[0].formatted_address);
                    }
                }
            });
        },
        error: function(error){
          alert('Geolocation failed: '+error.message);
        },
        not_supported: function(){
          alert("Your browser does not support geolocation");
        },
      });
    });

// find the source (current) and distenation location on the map
 $('#search').click(function(e) {
        e.preventDefault();
        var address=[];

        address[0]= $('#current').val().trim();
        address[1]= $('#distenation').val().trim();
for (var x=0; x<2; x++)
{
        GMaps.geocode({
          address: address[x],
          callback: function(results, status){
            if(status=='OK'){
              var latlng = results[0].geometry.location;
              map.setCenter(latlng.lat(), latlng.lng());
              map.addMarker({
                lat: latlng.lat(),
                lng: latlng.lng(),
              });
            }
          }
        });
    }

      });

});
