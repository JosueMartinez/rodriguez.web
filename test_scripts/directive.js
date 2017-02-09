(function(){
    var dir = angular.module('directi', []);

    dir.directive('superManAtt', function(){
        return{
            restrict: 'A',
            templateUrl: './templates/info.htm'
        };
    });

    dir.directive('superManEl', function(){
        return{
            restrict: 'E',
            templateUrl: './templates/info.htm'
        };
    });
})();