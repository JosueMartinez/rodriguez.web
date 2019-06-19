(function() {
    var bonos = angular.module('bonos', ['base64']);

    //Servicio para bonos
    bonos.service('bonoServ', ['$http', 'settings', 'localStorageService', 'utilitiesServ', function($http, settings, localStorageService, utilitiesServ) {

        var functions = {
            obtenerBonos: function() {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonos",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function(response) {
                        return response.data;
                    });
                }
            },

            obtenerBonosPagados: function() {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonosPagados",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function(response) {
                        return response.data;
                    });
                }

            },

            detalleBono: function(id) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonos/" + id,
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function(response) {
                        return response.data;
                    });
                }
            },

            imprimirTicket: function(id) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'GET',
                        url: settings.baseUrl + "bonos/" + id,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + authData.token
                        }
                    }).then(function(response) {
                        var bono = response.data;
                        bono.Cliente.nombreCompleto = bono.Cliente.Nombres + ' ' + bono.Cliente.Apellidos;
                        bono.NombreDestinoCompleto = bono.NombreDestino + ' ' + bono.ApellidoDestino;
                        bono.montoRD = utilitiesServ.formatearNumero(bono.Monto * bono.Tasa.Valor);
                        bono.FechaCompra = utilitiesServ.formatearFecha(bono.FechaCompra);
                        bono.CedulaDestino = utilitiesServ.formatearCedula(bono.CedulaDestino);
                        var string = construirRecibo(bono);

                        var printWindow = window.open();
                        console.log(printWindow);
                        printWindow.document.open('text/plain')
                        printWindow.document.write(string);
                        printWindow.document.close();
                        //printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    });
                }
            },

            pagarBono: function(id) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    return $http({
                        method: 'PUT',
                        url: settings.baseUrl + "bonos/" + id + "/pagar",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token }
                    }).then(function(response) {
                        response.error = false;
                        return response;
                    }, function(response) {
                        response.error = true;
                        return response;
                    });
                }
            }
        }

        return functions;

    }]);



    bonos.controller('bonoController', function($scope, bonoServ, localStorageService, $location, $window, Notification, $interval) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";

        var authData = localStorageService.get('authorizationData');

        $scope.obtenerPagados = function() {
            if (authData) {
                bonoServ.obtenerBonosPagados().then(function(data) {
                    $scope.bonosPagados = data;
                    $scope.bonosPagados.forEach(function(element) {
                        // element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                        element.NombreDestinoCompleto = element.NombreDestino + ' ' + element.ApellidoDestino;
                        element.MontoRd = element.Monto * element.Tasa.Valor;
                    }, this);

                });
            } else {
                $location.path('/login');
            }
        };

        $scope.obtenerBonos = function() {
            if (authData) {
                bonoServ.obtenerBonos().then(function(data) {
                    $scope.bonos = data;
                    $scope.bonos.forEach(function(element) {
                        // element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                        element.NombreDestinoCompleto = element.NombreDestino + ' ' + element.ApellidoDestino;
                        element.MontoRd = element.Monto * element.Tasa.Valor;
                    }, this);

                });
            } else {
                $location.path('/login');
            }
        };

        //leida inicial
        $scope.obtenerBonos();

        //refresh cada 1 minuto
        $scope.intervalPromise = $interval(function() {
            console.log('reloading');
            $scope.obtenerBonos();
        }, 60000);

        $scope.pagarBono = function(id) {
            var confirmar = $window.confirm("¿Seguro de querer pagar el bono?");
            if (confirmar) {
                bonoServ.pagarBono(id).then(function(response) {
                    if (!response.error) {

                        Notification.success({ message: 'Se ha pagado con éxito', delay: 5000 });
                        bonoServ.obtenerBonos(authData).then(function(data) {
                            $scope.bonos = data;
                        });
                    } else {
                        Notification.error({ message: 'Ha ocurrido un error', positionY: 'bottom', delay: 5000 });
                    }
                });
            }
        };

        $scope.imprimirTicket = function(id) {
            var confirmar = $window.confirm("¿Seguro de querer imprimir el recibo?");
            if (confirmar) {
                bonoServ.imprimirTicket(id);
            }
        }


    });

    bonos.controller('bonoDetalleController', function($scope, $stateParams, bonoServ, $uibModal, localStorageService, $window) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";
        $scope.bono = {};
        var authData = localStorageService.get('authorizationData');

        bonoServ.detalleBono($stateParams.id).then(function(data) {
            $scope.bono = data;
            // $scope.bono.metodoPago = paypalService.getPayment($scope.bono.paypalId);
            $scope.bono.Cliente.nombreCompleto = $scope.bono.Cliente.Nombres + ' ' + $scope.bono.Cliente.Apellidos;
            $scope.bono.NombreDestinoCompleto = $scope.bono.NombreDestino + ' ' + $scope.bono.ApellidoDestino;
            $scope.bono.montoRD = $scope.bono.Monto * $scope.bono.Tasa.Valor;
        });

        $scope.pagarBono = function(id) {
            var confirmar = $window.confirm("¿Seguro de querer pagar el bono?");
            if (confirmar) {
                bonoServ.pagarBono(id).then(function(data) {
                    bonoServ.detalleBono(id).then(function(data) {
                        $scope.bono = data;
                        $scope.bono.Cliente.nombreCompleto = $scope.bono.Cliente.Nombres + ' ' + $scope.bono.Cliente.Apellidos;
                        $scope.bono.NombreDestinoCompleto = $scope.bono.NombreDestino + ' ' + $scope.bono.ApellidoDestino;
                        $scope.bono.montoRD = $scope.bono.Monto * $scope.bono.Tasa.Valor;
                    });
                });
            }
        };

        $scope.imprimirTicket = function(id) {
            var confirmar = $window.confirm("¿Seguro de querer imprimir el recibo?");
            if (confirmar) {
                bonoServ.imprimirTicket(id);
            }
        }
    });
})();

var construirRecibo = function(bono) {
    var recibo = '<div id="recibo" data-ng-controller="bonoDetalleController">';
    recibo += '<h4 style="text-align: center">Supermercado Rodriguez</h4>';
    recibo += '<small style="text-align: center">Carretera Veragua-Gaspar Hernandez, Espaillat, R.D.</small>';
    recibo += '<small style = "text-align: center">809-739-0788 </small><br />';
    recibo += '<h6 style="text-align:center;">RECIBO DE PAGO</h6>'
    recibo += '<table>';
    recibo += '<tr><th>Referencia</th><th>Fecha</th></tr>';
    recibo += '<tr><td>' + bono.Id + '</td><td>' + bono.FechaCompra + '</td></tr>';
    recibo += '</table>';
    recibo += '<p><b>Remitente</b></p>';
    recibo += '<p>' + bono.Cliente.NombreCompleto + '</p>';
    recibo += '<p><b>Destinatario</b></p>';
    recibo += '<p>' + bono.NombreDestinoCompleto + '<br/>' + bono.CedulaDestino + '</p>';
    recibo += '<p><b>Monto</b></p>';
    recibo += '<p>RD$' + bono.montoRD + '</p>';
    recibo += '';
    recibo += '</div>';

    return recibo;
}


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