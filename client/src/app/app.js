angular.module('app', [
    'ngResource'
    ,'ui.router'
    ,'ngStorage'
    ,'authorization'
    ,'authorization.services'
    ,'ngCookies'
    ,'chats'
    ,'chat.services'
]);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
        .state('index', {
        url: "/",
        templateUrl: "app/index.tpl.html"
    });
}]);

/*angular.module('app').factory('chatsocket',function(){
    var socket = io.connect("http://localhost:3000");
    return socket;
}); 
*/

angular.module('app').controller('AppCtrl', ['$scope','$cookieStore','$location','AuthService','$rootScope','chatsocket','$localStorage', function($scope,$cookieStore,$location,AuthService,$rootScope,chatsocket,$localStorage) {
    $scope.myInit = function(){
        if($localStorage.token){
            AuthService.currentUser(function(result){
                console.log("Current user AppCtrl : "+JSON.stringify(result));
            });
        }
    };

    
    
    $scope.jobs = [
        {name:'job1'},
        {name:'job2'},
        {name:'job3'},
        {name:'job4'}
    ];
    
    $scope.moveup = function(index){
        console.log("index of row is : "+index);
        if(index>0){
            var temp = $scope.jobs[index-1];
            $scope.jobs[index-1] = $scope.jobs[index];
            $scope.jobs[index] = temp;
        }
    }
    
    
    var swapArrayElements = function(arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    };
    
    
    
        chatsocket.on('test',function(data){
                console.log("test event caught: "+JSON.stringify(data));
         });
       
    chatsocket.on('notify:client',function(){
        console.log("notify:client event caught");
        if($localStorage.token){
            AuthService.currentUser(function(result){
                chatsocket.emit('join:app',{message:result.username+" joined "});
            });
        }
    });
    

    var accessLevels = {
        'user': ['user'],
        'admin': ['admin','user']
    };


    $rootScope.hasAccess = function(level){
        if($rootScope.currentUser && accessLevels[$rootScope.currentUser['role']]){
            if(accessLevels[$rootScope.currentUser['role']].indexOf(level) > -1)
                return true;
            else
                return false;
        }else
            return false;
    }


    $scope.logout = function(){
        chatsocket.emit('user:logout',{email: $rootScope.currentUser.email});
        AuthService.logout(function(result){
            console.log("Response after logout: "+JSON.stringify(result));
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$location','AuthService','$rootScope', function($scope,$location,AuthService,$rootScope) {    
    $scope.logout = function(){
        AuthService.logout(function(result){
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);
