var module = angular.module('chat.services',['ngResource']);

module.factory('ChatService',function($resource){
    return $resource('chat/:id', 
                     {
        id: '@id'
    },
                     {
        'update': { method:'PUT' }
    },
                     {
        'get': { method: 'GET', isArray: false }
    },
                     {
        'delete': { method: 'DELETE'}
    }
                    );
});