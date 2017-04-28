(function(){
    var route = angular.module('routing',['ngRoute']);

    route.config(function ($routeProvider){
        $routeProvider
            .when("/", {
                templateUrl: "/Pages/home.html",
                controller: 'homeController'
            })
            // Routing para bono
            .when("/Bonos", {
                templateUrl: "/Pages/Bonos/bonos.html",
                controller: 'bonoController'
            })
            .when("/Bonos/:id", {
                templateUrl: "Pages/Bonos/bono.html",
                controller: 'bonoDetalleController'
            })
            // Fin Routing para bono
            .when("/Productos", {
                templateUrl: "/Pages/Productos/productos.html",
                controller: 'productoController'

            })
            .when("/Prueba404", {
                templateUrl: "/Pages/404.html"
            })
            .otherwise({
                redirectTo: "/Pages/404.html"
            });
    });
})();