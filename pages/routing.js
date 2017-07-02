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
                templateUrl: '/Pages/Usuarios/login.html',
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
            })
            .state('master.usuarios',{
                url: '/Usuarios',
                templateUrl: '/Pages/Usuarios/usuarios.html',
                controller: 'usuarioController'
            })
            .state('master.tasas',{
                url: '/Tasas',
                templateUrl: '/Pages/Tasa/tasas.html',
                controller: 'tasaController'
            });
    });
})();