/**
 * Angular module wrapping facebookConnectPlugin.js for PhoneGap/Cordova.
 * Let's you test Facebook interaction either on a device/emulator (native), or in a browser (JS SDK).
 *
 * Based on OpenFB library by Christophe Coenraets @ccoenraets: https://github.com/ccoenraets/OpenFB
 *
 * For a facebookConnectPlugin.js example, see https://github.com/phonegap/phonegap-facebook-plugin/tree/develop
 * 
 * @author Duncan Smith @dunc_smiff
 * @version 0.1
 */
angular.module('facebookConnectPlugin', [])

    .factory('FBC', function ($rootScope, $q, $window, $http) {

        var fbAppId,
            tokenStore = window.sessionStorage,	// override in init
            runningInCordova;

        document.addEventListener("deviceready", function () {
            runningInCordova = true;
        }, false);

        /**
         * Initialize the module. You must use this function and initialize the module with an appId before you can
         * use any other function.
         * @param appId - The id of the Facebook app
		 * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
         */
        function init(appId, store) {
			console.log('FBC init');
		
            fbAppId = appId;
			if (store) tokenStore = store;
			
			if (!window.cordova) {
				console.log('No Cordova - using browser init');
				
				window.fbAsyncInit = function() {
					facebookConnectPlugin.browserInit(fbAppId);
				}; 
				
			}
        }

        /**
         * Login to Facebook. If running in a Browser, the OAuth workflow happens in a a popup window.
         * @param fbScope - The set of Facebook permissions requested
         */
        function login(fbScope) {
			console.log('FBC login');

            if (!fbAppId) {
                return error({error: 'Facebook App Id not set.'});
            }

            fbScope = fbScope || '';

            deferredLogin = $q.defer();

            logout();

			facebookConnectPlugin.login( ["email"],
			
				function success(response) {
					if (response.status == 'connected') {
						console.log('FBC connected');
						
						// Not strictly necessary to store token, but can be used by app to check if logged in
						tokenStore['fbtoken'] = response.token;
						
						deferredLogin.resolve();
					}
					else {
						alert('not connected');
						deferredLogin.reject();
					}
				},
				
				function error(response) {
					console.log('login error');
					deferredLogin.reject(response);
				});
			
            return deferredLogin.promise;

        }

        /**
         * Application-level logout: we simply discard the token.
         */
        function logout() {
			tokenStore['fbtoken'] = undefined;
        }

        /**
         * Helper function to de-authorize the app
         * @param success
         * @param error
         * @returns {*}
         */
        function revokePermissions() {
			// return api({method: 'DELETE', path: '/me/permissions'})
                // .success(function () {
                    // console.log('Permissions revoked');
                // });
        }

        /**
         * Lets you make any Facebook Graph API request.
         * @path: path in the Facebook graph: /me, /me.friends, etc. Required.
		 * @permissions: for native API call. Optional array of strings.
         */
        function api(path, permissions) {
			console.log('api: ' + path);

			var deferred = $q.defer();
		
            permissions = permissions || [];
		
			facebookConnectPlugin.api(path, permissions, // path, permissions,
				function success(response) {
					console.log('api success: ' + JSON.stringify(response));
					deferred.resolve(response);
				},
				function error(response) { 
					//e.g. response = "(#200) Requires extended permission: read_stream"
					console.log('api failed: ' + JSON.stringify(response));
					deferred.reject(response);
				}); 
		
			//todo: handle auth exception
            // return $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
                // .error(function(data, status, headers, config) {
                    // if (data.error && data.error.type === 'OAuthException') {
                        // $rootScope.$emit('OAuthException');
                    // }
                // });
				
			return deferred.promise;
        }

		//todo: these helpers are pretty pointless at the moment
		
        /**
         * Helper function for a POST call into the Graph API
         * @param path
         * @param permissions
         * @returns {*}
         */
        function post(path, permissions) {
            return api(path, permissions);
        }

        /**
         * Helper function for a GET call into the Graph API
         * @param path
         * @param permissions
         * @returns {*}
         */
        function get(path, permissions) {
            return api(path, permissions);
        }

        return {
			init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            post: post,
            get: get
        }

    });
