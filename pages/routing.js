(function(){
    var route = angular.module('routing', ['ngRoute', 'ui.router','LocalStorageModule']);

    route.config(function ($urlRouterProvider,$stateProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('master',{
                abstract: true,
                templateUrl: '/master.html'
            })
            .state('loginLayout',{
                abstract: true,
                templateUrl: '/loginLayout.html'
            })
            .state('master.home',{
                url: "/",
                templateUrl: "/Pages/Bonos/bonos.html",
                controller: 'bonoController'
            })
            .state('loginLayout.login',{
                url: '/login',
                templateUrl: '/Pages/Login/login.html',
                controller: 'loginController'
            })
            .state('master.bonos',{
                url: '/Bonos',
                templateUrl: '/Pages/Bonos/bonos.html',
                controller: 'bonoController'
            })
            .state('master.bonoDetail',{
                url: '/Bonos/:id',
                templateUrl: "Pages/Bonos/bono.html",
                controller: 'bonoDetalleController'
            })
            .state('master.productos',{
                url: '/Productos',
                templateUrl: '/Pages/Productos/productos.html',
                controller: 'productoController'
            });
    });

    // route.config(function ($routeProvider){
    //     $routeProvider.when("/", {
    //         templateUrl: "/Pages/Bonos/bonos.html",
    //         controller: 'bonoController'
    //     })
    //     .when("/login",{
    //         templateUrl: "/Pages/Login/login.html",
    //         controller: 'loginController'
    //     })
    //     .when("/Bonos", {
    //         templateUrl: "/Pages/Bonos/bonos.html",
    //         controller: 'bonoController'
    //     })
    //     .when("/Bonos/:id", {
    //         templateUrl: "Pages/Bonos/bono.html",
    //         controller: 'bonoDetalleController'
    //     })
    //     .when("/Productos", {
    //         templateUrl: "/Pages/Productos/productos.html",
    //         controller: 'productoController'
    //     })
    //     .otherwise({
    //         redirectTo: "/"
    //     });
    // });


})();