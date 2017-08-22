var u = angular.module('usuarios', []);

u.service('usuarioServ', ['$http', 'settings', 'localStorageService', function ($http, settings, localStorageService, Notification){
    var functions = {

        getUsuarios: function(){
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "usuarios",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                }).then(function (response) {
                    return response.data;
                });
            }
        }
    }

    return functions;
}]);

u.controller('usuarioController', function ($scope, localStorageService, Notification, $location, usuarioServ){
    $scope.pagina = "Usuarios";
    $scope.sitio = "Administración & Acceso al Sistema";

    var authData = localStorageService.get('authorizationData');
    var usuario = authData.usuario;
    
    if(authData){
        if(usuario.rol.descripcion !== 'Empleado'){
            usuarioServ.getUsuarios().then(function(data){
                $scope.usuarios = data;
            });
        }else{
            Notification.error({ message: 'No cuenta con permisos para acceder a administración', positionY: 'bottom', delay: 5000 });
            $location.path('/bonos');
        }
    }else {
        $location.path('/login');
    }
});