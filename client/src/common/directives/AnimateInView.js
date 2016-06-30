var module = angular.module('animate.directives', []);

module.directive('animateInView', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (element[0].y < $window.innerHeight) {
                angular.element(element).addClass(attr.animateInView);
            }
            angular.element($window).on('scroll', function () {
                if (element[0].getBoundingClientRect().top < $window.innerHeight) {
                    return angular.element(element).addClass(attr.animateInView);
                }
            });
        }
    };
});