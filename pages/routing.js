(function(){
    var route = angular.module('routing',['ngRoute']);

    route.config(function ($routeProvider){
        $routeProvider
            .when("/", {
                templateUrl: "/Pages/home.html"
            })
            .when("/Bonos", {
                templateUrl: "/Pages/Bonos/bonos.html"
            })
            .when("/Productos", {
                templateUrl: "/Pages/Productos/productos.html"
            })
            .when("/Prueba404", {
                templateUrl: "/Pages/404.html"
            })
            .otherwise({
                redirectTo: "/Pages/404.html"
            });
    });
})();