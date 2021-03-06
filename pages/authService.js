'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'settings', function ($http, $q, localStorageService, settings) {

    var serviceBase = settings.baseUrl;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName : ""
    };

    var _saveRegistration = function (registration) {
        _logOut();
        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });
    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        var deferred = $q.defer();
        
        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(function(responseToken){
            //obtener usuario real
            $http.get(serviceBase + 'usuarioU/' + loginData.userName, {headers: {'Authorization': 'Bearer ' + responseToken.data.access_token} })
                .then(function(response){
                    localStorageService.set('authorizationData', { token: responseToken.data.access_token, userName: loginData.userName, usuario: response.data });
                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    deferred.resolve(response);
                }, function(response){
                    _logOut();
                    deferred.reject(response);
                });
            
        },function(response){
            _logOut();
                deferred.reject(response);
        });

        return deferred.promise;
    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.usuario = null;

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData)
        {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.usuario = authData.usuario;
        }

    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    return authServiceFactory;
}]);