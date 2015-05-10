var rideshareControllers = angular.module('rideshareControllers', [])
    .run(function($rootScope, $http) {
        $rootScope.createLocationFromAddress = function(address, saveToDb, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (saveToDb === true) {
                        $http.post('/api/location', {
                                loc: [results[0].geometry.location.A,
                                    results[0].geometry.location.F
                                ],
                                address: results[0].formatted_address
                            })
                            .success(function(data, status, headers, config) {
                                console.log(data);
                                callback(data);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('err');
                                return 'err';
                            });
                    } else {
                        callback({
                            loc: [results[0].geometry.location.A,
                                results[0].geometry.location.F
                            ]
                        });
                    }
                }
            });
        };

        $rootScope.isLoggedIn = function() {
            if (typeof($rootScope.user) !== 'undefined') {
                return true;
            } else {
                return false;
            }
        };
    });