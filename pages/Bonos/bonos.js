(function () {
    var bonos = angular.module('bonos', ['base64']);

    //Servicio para bonos
    bonos.service('bonoServ', ['$http', 'settings', 'localStorageService', function ($http, settings, localStorageService, Notification) {

        var functions = {
            obtenerBonos: function () {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonos",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function (response) {
                        return response.data;
                    });
                }
            },

            obtenerBonosPagados: function () {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonosPagados",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function (response) {
                        return response.data;
                    });
                }

            },

            detalleBono: function (id) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonos/" + id,
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function (response) {
                        return response.data;
                    });
                }
            },

            imprimirTicket: function (id) {
                alert('mandando a imprimir');
            },

            pagarBono: function (id) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'PUT',
                        url: settings.baseUrl + "bonos/" + id + "/pagar",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function (response) {
                        response.error = false;
                        return response;
                    }, function (response) {
                        response.error = true;
                        return response;
                    });
                }
            }
        }

        return functions;

    }]);



    bonos.controller('bonoController', function ($scope, bonoServ, localStorageService, $location, $window, Notification) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";

        var authData = localStorageService.get('authorizationData');

        $scope.obtenerPagados = function () {
            if (authData) {
                bonoServ.obtenerBonosPagados().then(function (data) {
                    $scope.bonosPagados = data;
                    $scope.bonosPagados.forEach(function (element) {
                        element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                        element.nombreDestinoCompleto = element.nombreDestino + ' ' + element.apellidoDestino;
                        element.montoRd = element.monto * element.tasa.valor;
                    }, this);

                });
            } else {
                $location.path('/login');
            }
        };


        if (authData) {
            bonoServ.obtenerBonos().then(function (data) {
                $scope.bonos = data;
                $scope.bonos.forEach(function (element) {
                    element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                    element.nombreDestinoCompleto = element.nombreDestino + ' ' + element.apellidoDestino;
                    element.montoRd = element.monto * element.tasa.valor;
                }, this);

            });
        } else {
            $location.path('/login');
        }

        $scope.pagarBono = function (id) {
            var confirmar = $window.confirm("¿Seguro de querer pagar el bono?");
            if (confirmar) {
                bonoServ.pagarBono(id).then(function (response) {
                    if (!response.error) {
                        Notification.success({ message: 'Se ha pagado con éxito', delay: 5000 });
                        bonoServ.obtenerBonos(authData).then(function (data) {
                            $scope.bonos = data;
                        });
                    } else {
                        Notification.error({ message: 'Ha ocurrido un error', positionY: 'bottom', delay: 5000 });
                    }
                });
            }
        };

        $scope.imprimirTicket = function (id) {
            var confirmar = $window.confirm("¿Seguro de querer imprimir el recibo?");
            if (confirmar) {
                bonoServ.imprimirTicket(id);
            }
        }


    });

    bonos.controller('bonoDetalleController', function ($scope, $stateParams, bonoServ, $uibModal, localStorageService, $window) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";
        $scope.bono = {};
        var authData = localStorageService.get('authorizationData');

        bonoServ.detalleBono($stateParams.id).then(function (data) {

            $scope.bono = data;
            // $scope.bono.metodoPago = paypalService.getPayment($scope.bono.paypalId);
            $scope.bono.cliente.nombreCompleto = $scope.bono.cliente.nombres + ' ' + $scope.bono.cliente.apellidos;
            $scope.bono.nombreDestinoCompleto = $scope.bono.nombreDestino + ' ' + $scope.bono.apellidoDestino;
            $scope.bono.montoRD = $scope.bono.monto * $scope.bono.tasa.valor;
        });

        $scope.pagarBono = function (id) {
            var confirmar = $window.confirm("¿Seguro de querer pagar el bono?");
            if (confirmar) {
                bonoServ.pagarBono(id).then(function (data) {
                    bonoServ.detalleBono(id).then(function (data) {
                        $scope.bono = data;
                        $scope.bono.cliente.nombreCompleto = $scope.bono.cliente.nombres + ' ' + $scope.bono.cliente.apellidos;
                        $scope.bono.nombreDestinoCompleto = $scope.bono.nombreDestino + ' ' + $scope.bono.apellidoDestino;
                        $scope.bono.montoRD = $scope.bono.monto * $scope.bono.tasa.valor;
                    });
                });
            }
        };

        $scope.imprimirTicket = function (id) {
            var confirmar = $window.confirm("¿Seguro de querer imprimir el recibo?");
            if (confirmar) {
                bonoServ.imprimirTicket(id);
            }
        }
    });
})();



// app.factory('paypalService', ['$http', '$q', 'localStorageService', 'settings', '$base64', function ($http, $q, localStorageService, settings, $base64){
//     var serviceBase = settings.PayPalApiUrl;
//     var clienteId = settings.PayPalClientId;
//     var apiSecret = settings.PayPalSecret;
//     var paypalServiceFactory = {};

//     var _login = function (loginData) {
//         var auth = $base64.encode(clienteId + ":" + apiSecret);
//         var data = {"grant_type": "client_credentials"};
//         var deferred = $q.defer();

//         $http({
//             method: 'POST',
//             url: serviceBase + 'oauth2/token?grant_type=client_credentials',
//             // data: data,
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Basic ' + auth}
//         }).then(function(response){
//             localStorageService.set('paypalAuthorization', { token: response.data.access_token});
//             // console.log(response.data.access_token);
//                 // deferred.resolve(response);
//         },function(response){
//                 // deferred.reject(response);
//         });

//         return deferred.promise;
//     };

//     var _getPayment = function(paymentId){
//         var paypalToken = localStorageService.get('paypalAuthorization');
//         if(!paypalToken){
//             _login().then(function(response){
//                 paypalToken = response.data;
//             });
//         }

//         return $http({
//                     method: 'GET',
//                     url: serviceBase + 'payments/payment/' + paymentId,
//                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + paypalToken.token}
//                 }).then(function (response) {
//                     console.log(response.data);
//                     return response.data;
//                 });
//     }

//     paypalServiceFactory.login = _login;
//     paypalServiceFactory.getPayment = _getPayment;

//     return paypalServiceFactory;
// }]);