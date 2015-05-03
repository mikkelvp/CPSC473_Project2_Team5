var main = function() {
    
    
    
};

// Google+ Login function
function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
            // Update the app to reflect a signed in user
            // Hide the sign-in button now that the user is authorized, for example:
            document.getElementById('signinButton').setAttribute('style', 'display: none');
        // This sample assumes a client object has been created.
        // To learn more about creating a client, check out the starter:
        //  https://developers.google.com/+/quickstart/javascript
        gapi.client.load('plus','v1', function(){
            var request = gapi.client.plus.people.get({
                'userId': 'me'
             });
            request.execute(function(resp) {
                console.log('Retrieved profile for:' + resp.displayName);
            });
        });
    } else {
            // Update the app to reflect a signed out user
            // Possible error values:
            //   "user_signed_out" - User is signed-out
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatically log in the user
            console.log('Sign-in state: ' + authResult['error']);
    }
}


$(document).ready(main);