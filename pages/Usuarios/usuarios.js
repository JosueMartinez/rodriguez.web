var u = angular.module('usuarios', []);

u.service('usuarioServ', ['$http', 'settings', 'localStorageService', function($http, settings, localStorageService, Notification) {
    var functions = {
        obtenerRoles :function () {
            var authData = localStorageService.get('authorizationData');
            if(authData){
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "rol",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                }).then(function (response) {
                    return response.data;
                });
            }
            
        },
        getUsuarios: function() {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "usuarios",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                }).then(function(response) {
                    return response.data;
                });
            }
        },
        createUsuarios: function (data) {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                return $http({
                    method: 'POST',
                    url: settings.baseUrl + "account/register",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token },
                    data:data
                }).then(function (response) {
                    return response.data;
                });
            }
        },
        borrarUsuario : function (id) {
            var authData = localStorageService.get('authorizationData');
            return $http({
                method: 'DELETE',
                url: settings.baseUrl + "usuarios/" + id,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                response.error = true;
                return response;
            });
        },
    }

    return functions;
}]);

u.controller('usuarioController', function ($scope, $uibModal, localStorageService, Notification, $location, usuarioServ, $window) {
    $scope.pagina = "Usuarios";
    $scope.sitio = "Administración & Acceso al Sistema";

    var authData = localStorageService.get('authorizationData');
    var usuario = authData.usuario;

    if (authData) {
        if (usuario.rol.Descripcion !== 'Empleado') {
            usuarioServ.getUsuarios().then(function(data) {
                $scope.usuarios = data;
            });
            usuarioServ.obtenerRoles(authData).then(function (data) {
                $scope.roles = data;
            });
        } else {
            Notification.error({ message: 'No cuenta con permisos para acceder a administración', positionY: 'bottom', delay: 5000 });
            $location.path('/bonos');
        }
    } else {
        $location.path('/login');
    }

    //modal para agregar productoController
    $scope.modalUsuario = function (page, size) {

        $scope.modalUsuarioDia = $uibModal.open({
            animation: true,
            size: size,
            templateUrl: page,
            scope: $scope,
            controller: 'usuarioModalController',
            controllerAs: 'usuario'
        }).closed.then(function () {
            usuarioServ.getUsuarios(authData).then(function (data) {
                $scope.usuarios = data;
            });
        });;
    };

    $scope.borrarUsuario = function (id) {
        Swal.fire({
            title: '¿Seguro de querer borrar este Usuario?',
            text: "Esto no es reversible",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) { 
                usuarioServ.borrarUsuario(id).then(function (response) {
                    if (!response.error) {
                        Notification.success({ message: 'Usuario borrado', delay: 5000 });
                        usuarioServ.getUsuarios(authData).then(function (data) {
                            $scope.usuarios = data;
                        });
                    } else {
                        Notification.error({ message: 'No se ha podido borrrar el Usuario', positionY: 'bottom', delay: 5000 });
                    }

                });
            }
        });
    };
});

u.controller('usuarioModalController', function ($uibModalInstance, usuarioServ, $scope, $http, settings, Notification){
    $scope.crearUsuario = function(){
        var usuario = $scope.usuario;
       console.log(usuario);
        
        var rolId = usuario.RolId.Id;
        usuario.RolId = rolId;
        usuarioServ.createUsuarios(usuario).then(function (response) {
            if (!response.error) {
                Notification.success({ message: 'Se ha creado el usuario ' , delay: 5000 });
                $uibModalInstance.close();
            } else {
                Notification.error({ message: 'No se ha podido guardar el usuario', positionY: 'bottom', delay: 5000 });
            }
        })
    }

    
});

