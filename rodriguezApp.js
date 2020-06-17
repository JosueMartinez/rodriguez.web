   var app = angular.module('rodriguezApp', ['utilities', 'bonos', 'producto', 'directives', 'routing', 'usuarios', 'tasas',
       'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularUtils.directives.dirPagination',
       'angular-loading-bar', 'ui-notification'
   ]);

   app.config(['$locationProvider', function($locationProvider) {
       $locationProvider.hashPrefix('');
   }]);

   app.config(function($httpProvider) {
       $httpProvider.interceptors.push('authInterceptorService');
   });

   app.constant("settings", {
        "baseUrl": "http://localhost:52643/api/",
        "port": "80",
        "PayPalApiUrl": "https://api.sandbox.paypal.com/v1/",
        "PayPalClientId": "AbpLXvsoTb4Qrd1qQbGl6QsllrYC-QSumRWB3rlM6nbBtx01ngomIDdiyF94lZaz47lVsY7Mt5MveM20",
        "PayPalSecret": "EOGvMzgbRC6Bf9YhTwVPQFNNzpHtkKdE_eWlBYMUQhh01CGrvjqYrLTEDZL1w-xt6XNdYfY-Im0qpZ9V"
   });

   app.run(['authService', '$location', function(authService, $location) {
       authService.fillAuthData();

       if (!authService.authentication.isAuth) {
           console.log("NO ESTA LOGEADO");
           $location.path('/login');
       }
   }]);

   app.controller('homeController', function($scope) {
       $scope.pagina = "Dashboard";
       $scope.sitio = "Control Panel";
   });

   'use strict';
   app.controller('loginController', ['$scope', '$location', 'authService', function($scope, $location, authService) {

       $scope.loginData = {
           userName: "",
           password: ""
       };

       $scope.message = "";

       $scope.login = function() {
           authService.login($scope.loginData).then(function(response) {
                   $location.path('/Bonos');
               },
               function(err) {
                   $scope.message = err.error_description;
               });
       };
   }]);