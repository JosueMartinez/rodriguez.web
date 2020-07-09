(function() {
    var bonos = angular.module('bonos', ['base64']);

    //Servicio para bonos
    bonos.service('bonoServ', ['$http', 'settings', 'localStorageService', 'utilitiesServ', function($http, settings, localStorageService, utilitiesServ) {

        var tabIndex = 0;

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
                        var string = construirRecibo(bono);

                        var printWindow = window.open();
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
            },

            setCurrentTab: function(tab){
                tabIndex = tab;
            },

            getCurrentTab: function(){
                return tabIndex;
            }
        }

        return functions;

    }]);



    bonos.controller('bonoController', function($scope, bonoServ, localStorageService, $location, $window, Notification, $interval, utilitiesServ) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";

        var authData = localStorageService.get('authorizationData');

        $scope.obtenerPagados = function() {
            if (authData) {
                bonoServ.obtenerBonosPagados().then(function(data) {
                    $scope.bonosPagados = data;
                    $scope.bonosPagados.forEach(function(element) {
                        element.CedulaDestino = utilitiesServ.formatearCedula(element.CedulaDestino);
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
                    $scope.bonos.forEach(function (element) {
                        element.CedulaDestino = utilitiesServ.formatearCedula(element.CedulaDestino);
                    }, this);
                });
            } else {
                $location.path('/login');
            }
        };

        //leida inicial
        $scope.activeTabIndex = bonoServ.getCurrentTab();   //necesario para cuando se regresa al listado desde detalle de bono
        if($scope.activeTabIndex == 0){
            $scope.obtenerBonos();
        }

        //refresh cada 1 minuto
        $scope.intervalPromise = $interval(function() {
            $scope.obtenerBonos();
        }, 60000);

        $scope.pagarBono = function(id) {

            Swal.fire({
                title: '¿Seguro de querer pagar este bono?',
                text: "Se impirmira su ticket",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) { 
                    
                    bonoServ.pagarBono(id).then(function (response) {
                        if (!response.error) {
                            Notification.success({ message: 'Se ha pagado con éxito', delay: 5000 });
                            $scope.imprimirTicket(id,false);
                            $scope.obtenerBonos();
                        } else {
                            Notification.error({ message: 'Ha ocurrido un error', positionY: 'bottom', delay: 5000 });
                        }
                    });
                }
            })
        };

        $scope.imprimirTicket = function(id, ask) {
            if(ask){
                Swal.fire({
                    title: '¿Seguro de querer imprimir el recibo?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed)
                        bonoServ.imprimirTicket(id);
                });
            }else{
                bonoServ.imprimirTicket(id);
            }            
        }


    });

    bonos.controller('bonoDetalleController', function($scope, $stateParams, bonoServ, $uibModal, localStorageService, $window, utilitiesServ, $location, Notification) {
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";
        $scope.bono = {};
        // $scope.activeTabIndex = 0;
        var authData = localStorageService.get('authorizationData');

        bonoServ.detalleBono($stateParams.id).then(function(data) {
            $scope.bono = data;
            $scope.bono.CedulaDestino = utilitiesServ.formatearCedula($scope.bono.CedulaDestino);
            $scope.bono.CedulaRemitente = utilitiesServ.formatearCedula($scope.bono.CedulaRemitente);
            $scope.bono.telefonoRemitente = utilitiesServ.formatearTelefono($scope.bono.telefonoRemitente);
            $scope.bono.TelefonoDestino = utilitiesServ.formatearTelefono($scope.bono.TelefonoDestino);
        });

        $scope.pagarBono = function(id) {
            Swal.fire({
                title: '¿Seguro de querer pagar este bono?',
                text: "Se impirmira su ticket",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    bonoServ.pagarBono(id).then(function (response) {
                        if (!response.error) {
                            Notification.success({ message: 'Se ha pagado con éxito', delay: 5000 });
                            $scope.imprimirTicket(id, false);
                            bonoServ.detalleBono($stateParams.id).then(function (data) {
                                $scope.bono = data;
                                $scope.bono.CedulaDestino = utilitiesServ.formatearCedula($scope.bono.CedulaDestino);
                                $scope.bono.CedulaRemitente = utilitiesServ.formatearCedula($scope.bono.CedulaRemitente);
                                $scope.bono.telefonoRemitente = utilitiesServ.formatearTelefono($scope.bono.telefonoRemitente);
                                $scope.bono.TelefonoDestino = utilitiesServ.formatearTelefono($scope.bono.TelefonoDestino);
                            });
                        } else {
                            Notification.error({ message: 'Ha ocurrido un error', positionY: 'bottom', delay: 5000 });
                        }
                    });
                }
            })
        };

        $scope.imprimirTicket = function(id, ask) {
            if(ask){
                Swal.fire({
                    title: '¿Seguro de querer imprimir el recibo?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed)
                        bonoServ.imprimirTicket(id);
                });
            }else{
                bonoServ.imprimirTicket(id);
            }
        };

        $scope.goto = function (page, tabIndex) {
            bonoServ.setCurrentTab(tabIndex);
            $location.path(page);
        };
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
    recibo += '<p>' + bono.Remitente + '</p>';
    recibo += '<p><b>Destinatario</b></p>';
    recibo += '<p>' + bono.Destinatario + '<br/>' + bono.CedulaDestino + '</p>';
    recibo += '<p><b>Monto</b></p>';
    recibo += '<p>RD$' + bono.Monto * bono.Tasa + '</p>';
    recibo += '';
    recibo += '</div>';

    return recibo;
}