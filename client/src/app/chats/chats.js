angular.module('chats',['ngResource','angularMoment','ui.router','luegg.directives']);

angular.module('chats').config(['$stateProvider','$urlRouterProvider',
              function($stateProvider,$urlRouterProvider){
                     $urlRouterProvider.otherwise("/");
                     $stateProvider
                        .state('chat',{
                                  url: "/chat/",
                                  templateUrl: 'app/chats/chat.tpl.html',
                                  controller: 'ChatsController',
                                  resolve : {
                                      members : function($resource,$q){
                                          return $resource('/chat/member/online').query().$promise;                    
                                      }
                                  },
                                  data: {
                                        authRequired: true,
                                        access: ['user','admin']
                                  }
                        });                               
              }
]);

angular.module('chats').run(function($rootScope,$location){
    return $rootScope.$on("$stateChangeStart", function(event, next) {
        if(next){
            if(next.data){
                if(next.data.authRequired){
                    if($rootScope.currentUser){
                        //do nothing 
                    }else{
                        $location.path('/login/');
                        //not authorized to access chats
                    }
                }
            }
        }else{
           console.log("found nothing for authentication..."); 
        }
    });
});

angular.module('chats').factory('chatsocket',function(){
    var socket = io.connect("http://localhost:3000");
    return socket;
});

angular.module('chats').controller('ChatsController',['$scope','$resource','$state','$location','chatsocket','$rootScope','$http','$resource','members',
                                                      function($scope,$resource,$state,$location,chatsocket,$rootScope,$http,$resource,members){
               $scope.members =  members;                                                  
               $scope.chats = [];
               $scope.message = '';
               $scope.selectedMember = '';
               $scope.stopTimeout = undefined;
               $scope.typing = false;
               $scope.typingLabel = undefined;
               $scope.send = function(){
                   if($scope.message){
                       var data = {
                           message: $scope.message, 
                           create_by: $rootScope.currentUser.name,
                           sender : $rootScope.currentUser.name,
                           senderEmail: $rootScope.currentUser.email,
                           receiver : $scope.selectedMember
                       };
                       $scope.chats.push(data);
                       chatsocket.emit('user:sendmsg',data);
                       $scope.message = '';
                   }
                };//send()
                
                                                          
                chatsocket.on('user:updateList',function(data){
                    if(data){
                        $scope.members = data;
                        $scope.$apply();
                    }
                });
                
            $scope.isActive = function(userName){
                return $scope.selectedMember === userName;
            };                                           
                                                          
            $scope.selectMemberForChat = function(userName){
                if(userName){//checking if userName is valid
                    if($scope.selectedMember){//if selectedMumber was previously set
                        if((userName !== $scope.selectedMember)){
                            //set active
                            $scope.selectedMember = userName;
                            
                            //load previous chats
                            loadPrevChat();
                        }
                    }else{
                        //first time user selection
                        //set active
                        $scope.selectedMember = userName;
                       
                        //load previous chats
                        loadPrevChat();
                    }
                }
            };
               
            var loadPrevChat = function(selectedUserid,loggedInUserid){
                $scope.chats.push({"message":"loaded1","create_by":"Raju","sender":"Raju","senderEmail":"raju@gmail.com","receiver":"Narendra"});
                $scope.chats.push({"message":"loaded2","create_by":"Raju","sender":"Raju","senderEmail":"raju@gmail.com","receiver":"Narendra"});
                
                $scope.chats.push({"message":"loaded3","create_by":"Raju","sender":"Raju","senderEmail":"raju@gmail.com","receiver":"Narendra"});
                
                $scope.chats.push({"message":"loaded4","create_by":"Raju","sender":"Raju","senderEmail":"raju@gmail.com","receiver":"Narendra"});
                
            };
                                                          
            chatsocket.on('user:receivemsg',function(data){
                console.log(JSON.stringify(data));
                $scope.chats.push(data);
                $scope.$apply();
            });
                                                          
            
         var typingTimeout = function() {
             $scope.typing = false;
             chatsocket.emit("user:typing", { status : false,
                                             sender : $rootScope.currentUser.name,
                                             receiver: $scope.selectedMember
                                            });
          };
          
         $scope.emitTypingEvent = function(){
             if (!$scope.typing) {
                 chatsocket.emit("user:typing", { status : true,
                                                  sender : $rootScope.currentUser.name,
                                                  receiver: $scope.selectedMember
                                                });
                 $scope.typing = true;
                 clearTimeout($scope.stopTimeout);
                 $scope.stopTimeout = setTimeout(typingTimeout, 250);
             }
             else{
                 clearTimeout($scope.stopTimeout);
                 $scope.stopTimeout = setTimeout(typingTimeout, 250);
             }
         };
                                                          
        chatsocket.on('user:typing',function(data){
         if(data.status){
            //display as typing
             $scope.typingLabel = data.sender+' is typing';
         }else{
            //stop typing display
             $scope.typingLabel = '';
         }
            $scope.$apply();
        });
               
     }
]);
