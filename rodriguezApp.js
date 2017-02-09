(function(){
    var app = angular.module('rodriguezApp', ['directives', 'ngRoute']);

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "/Pages/home.html"
            })
            .when("/Bonos", {
                templateUrl: "/Pages/Bonos/index.html"
            })
            .when("/Productos", {
                templateUrl: "/Pages/Productos/index.html"
            })
    });


})();