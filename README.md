FacebookConnectPlugin.js AngularJS Wrapper
=====================

An AngularJS wrapper for the official PhoneGap/Cordova Facebook plugin, FacebookConnectPlugin.js.

https://github.com/phonegap/phonegap-facebook-plugin

Based on the awesome OpenFB micro-framework by Christophe Coenraets:

https://github.com/ccoenraets/OpenFB

Unlike OpenFB, FacebookConnectPlugin.js makes use of the native Android/iOS Facebook API if available (and if you can get it working), degrading gracefully if not, i.e. when run in a browser.

## Prerequisites

You'll need to create a Cordova/PhoneGap project and install the FacebookConnectPlugin.js to get things working. Check out the example in the 'Develop' branch of the official Apache Cordova Facebook Plugin:

https://github.com/phonegap/phonegap-facebook-plugin/tree/develop

## Usage

Similar to usage of OpenFB in Christophe Coenraets 'Sociogram' app:

https://github.com/ccoenraets/sociogram-angular-ionic

However, since it uses a promise/deferred instance rather than the Angular $html service, you have to use then() rather than the success() and error() extensions.

e.g. 
<pre>
	FBC.get('/me/friends').then(
			function(result) {
                $scope.friends = result.data;
            },
			function(data) {
                alert(data.error);
            });
</pre>