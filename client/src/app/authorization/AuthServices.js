var module = angular.module('authorization.services',['ngResource','ngCookies','ngStorage']);

module.factory("AuthHttpRequestInterceptor",function ($localStorage) {
    return {
        request: function (config) {
            if($localStorage.token)
                config.headers["Authorization"] = 'bearer '+ $localStorage.token; 
            return config;
        }
    };
});

module.factory('AuthService',function($resource,$rootScope,$location,$cookieStore,$localStorage){

  var LoginResource = $resource('/auth/login');
  var LogoutResource = $resource('/auth/logout');
  var SignupResource = $resource('/auth/signup'); 

  function parseToken(token){
        var user = {};
        if(token){
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;  
    }
    
  function urlBase64Decode(str) {
       var output = str.replace('-', '+').replace('_', '/');
       switch (output.length % 4) {
           case 0:
             break;
           case 2:
              output += '==';
              break;
           case 3:
              output += '=';
              break;
           default:
              throw 'Illegal base64url string!';
        }
        return window.atob(output);
   }
 
   function getUserFromToken() {
       var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
           var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
   }


  // The public API of the service
  var service = {
      login: function(user,callback){
	var loginResource = new LoginResource();
	loginResource.email = user.email;
	loginResource.password = user.password;
	loginResource.$save(function(result){
        if(typeof result !== 'undefined'){
            if(result.type){
                $localStorage.token = result.token;
                var user = parseToken(result.token);
                console.log(" data after login : "+JSON.stringify(user));
                $rootScope.currentUser = user;
            }
        }
		callback(result);
	}); 
      },
      logout : function(callback){
	var logoutResource = new LogoutResource();
	logoutResource.$save(function(result){
			$rootScope.currentUser = null;
			$cookieStore.remove('user');
			delete $localStorage.token;
			callback(result);
	});
      },
      signup: function(user,callback){
	var signupResource = new SignupResource();
	signupResource.email = user.email;
	signupResource.password = user.password;
    signupResource.name = user.name;
	signupResource.$save(function(result){
        if(typeof result !== 'undefined'){
            if(result.type){
                $localStorage.token = result.token;
                console.log(" data after sign up : "+JSON.stringify(result));
                var user = parseToken(result.token);
                // $cookieStore.put('user',user);
                $rootScope.currentUser = user;
            }
        }
		callback(result);
	});
      },
     currentUser: function(callback){
     	var token = $localStorage.token;
     	var userData = {};
     	 if (typeof token !== 'undefined') {
             var encoded = token.split('.')[1];
             userData = JSON.parse(urlBase64Decode(encoded));
             userData.type = true;
             if(userData){
               // $cookieStore.put('user',userData);
				$rootScope.currentUser = userData;
             }
             callback(userData);
         }else
           callback({type: false, message:"no user found"});
    }
  }
  return service;
  
});