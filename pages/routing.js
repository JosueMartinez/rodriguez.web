(function(){
    var route = angular.module('routing',['ngRoute']);

    route.config(function ($routeProvider){
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
            .otherwise({
                redirectTo: "/"
            });
    });
})();