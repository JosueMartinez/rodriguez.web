   var app = angular.module('rodriguezApp', ['bonos', 'producto', 'directives', 'routing', 
                            'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 
                            'angular-loading-bar']);

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.constant("settings", {
        "baseUrl": "http://smrodriguez.azurewebsites.net/api/",
        "port": "80"
    });

    app.run(['authService', '$location', function (authService,$location) {
          authService.fillAuthData();
          
          if(!authService.authentication.isAuth){
              console.log("NO ESTA LOGEADO");
              $location.path('/login');
          }
    }]);

    app.controller('homeController', function ($scope) {
        $scope.pagina = "Dashboard";
        $scope.sitio = "Control Panel";
    });

    'use strict';
    app.factory('authService', ['$http', '$q', 'localStorageService', 'settings', function ($http, $q, localStorageService, settings) {
        
        var serviceBase = settings.baseUrl;//'http://ngauthenticationapi.azurewebsites.net/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName : ""
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            var deferred = $q.defer();
            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData)
            {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }

        }

        // authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;

    }]);

    'use strict';
    app.controller('loginController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        $scope.login = function () {
            authService.login($scope.loginData).then(function (response) {
                $location.path('/Bonos');
            },
             function (err) {
                 $scope.message = err.error_description;
             });
        };
    }]);
