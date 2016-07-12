angular.module('authorization',['ngResource','ui.router','ui.bootstrap.showErrors','validation.match','authorization.services']);

angular.module('authorization').config(['$stateProvider','$urlRouterProvider','$httpProvider',

    function($stateProvider,$urlRouterProvider,$httpProvider){
    $urlRouterProvider.otherwise("/");
    $httpProvider.interceptors.push('AuthHttpRequestInterceptor');
     $stateProvider
     .state('login', {
      url: "/login/",
      templateUrl: 'app/authorization/login.tpl.html',
      controller: 'AuthController'
    })
    .state('signup',{
      url: "/signup/",
      templateUrl : 'app/authorization/signup.tpl.html',
      controller: 'AuthController'
    })
    .state('settings',{
         url: "/settings/",
         templateUrl : 'app/authorization/settings.tpl.html',
         controller: 'SettingsController'
     });
}
]);

angular.module('chats').factory('chatsocket',function(){
    var socket = io.connect("http://localhost:3000");
    return socket;
});

angular.module('authorization').controller('SettingsController',['$scope','$resource','$state','$location','AuthService','$window','$rootScope',
 function($scope,$resource,$state,$location,AuthService,$window,$rootScope){
     //$location.protocol() + "://" + $location.host() + ":" + $location.port()                    
     $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+"/files/profile.png";
     
     
     
}]);


angular.module('authorization').controller('AuthController',['$scope','$resource','$state','$location','AuthService','$window','$rootScope','chatsocket',
        function($scope,$resource,$state,$location,AuthService,$window,$rootScope,chatsocket){
        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };

        $scope.errorExists = false;
           $scope.signup = function(){
                $scope.$broadcast('show-errors-check-validity'); 
                if ($scope.singupForm.$valid){
                  AuthService.signup({username: $scope.email,password: $scope.password},function(result){
                    console.log(" result "+JSON.stringify(result));
                    if(!result['type']){
                            $scope.errorExists = true;
                            $scope.loginErrorMessage = result['data'];
                    }else{
                            console.log(" username :"+$rootScope.currentUser.username);
                           // chatsocket.emit('user:login',{username: $rootScope.currentUser.username});
                            $location.path('/') 
                    }
                });
              }   
          }//signup
        
        
         $scope.login = function(){
             $scope.$broadcast('show-errors-check-validity'); 
             if ($scope.loginForm.$valid){
 AuthService.login({'username':$scope.email,'password':$scope.password},function(result){
                     if(!result['type']){
                         $scope.errorExists = true;
                         $scope.loginErrorMessage = result['data'];
                    }else{
                        console.log(" $$$ response from AuthService.login, info returned : "+JSON.stringify(result));
                        // chatsocket.emit('user:login',{username: $rootScope.currentUser.username});
                        $location.path("/") 
                    }
                 });
            }
        }//login

        $scope.logout = function(){
            console.log('$$$$$ logout called.. ');
          // chatsocket.emit('user:logout',{email: $rootScope.currentUser.email});
            AuthService.logout(function(result){
                if(result['status'] == 200){
                    $location.path('/login/');
                } 
            });
        }
    }
]);
