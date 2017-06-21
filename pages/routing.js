(function(){
    var route = angular.module('routing', ['ngRoute','LocalStorageModule']);

    route.config(function ($routeProvider){
        $routeProvider.when("/", {
            templateUrl: "/Pages/home.html",
            controller: 'homeController'
        })
        .when("/login",{
            templateUrl: "/Pages/Login/login.html",
            controller: 'loginController'
        })
        .when("/Bonos", {
            templateUrl: "/Pages/Bonos/bonos.html",
            controller: 'bonoController'
        })
        .when("/Bonos/:id", {
            templateUrl: "Pages/Bonos/bono.html",
            controller: 'bonoDetalleController'
        })
        .when("/Productos", {
            templateUrl: "/Pages/Productos/productos.html",
            controller: 'productoController'
        })
        .otherwise({
            redirectTo: "/"
        });
        
    });


})();