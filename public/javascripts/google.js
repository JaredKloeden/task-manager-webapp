(function () {
    gapi.load('auth2', function () {
        /* Ready. Make a call to gapi.auth2.init or some other API */
        gapi.auth2.init({ client_id: '335947766900-g7sam2plsiq165hq68d3d9oa1q8lralc.apps.googleusercontent.com' });
    });
})();

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}