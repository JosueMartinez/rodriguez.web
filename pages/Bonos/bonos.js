(function () {
    var bonos = angular.module('bonos', ['base64']);

    //Servicio para bonos
    bonos.service('bonoServ', ['$http', 'settings', 'localStorageService' , function ($http, settings,localStorageService) {
        this.obtenerBonos = function(){
            var authData = localStorageService.get('authorizationData');
            if(authData){
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "bonos",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function (response) {
                    return response.data;
                });
            }
                
        }

        this.detalleBono = function(id){
            var authData = localStorageService.get('authorizationData');
            if(authData){
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "bonos/" + id,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function (response) {
                    return response.data;
                });
            }
        }

    }]);

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

    bonos.controller('bonoController', function ($scope, bonoServ, localStorageService, $location){
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";

        var authData = localStorageService.get('authorizationData');
        if(authData){
            bonoServ.obtenerBonos().then(function (data) {
                $scope.bonos = data;
                $scope.bonos.forEach(function(element) {
                    element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                    element.nombreDestinoCompleto = element.nombreDestino + ' ' + element.apellidoDestino;
                    element.montoRd = element.monto * element.tasa.valor;
                }, this);

            }); 
        }else{
            $location.path('/login');
        }
    });

    bonos.controller('bonoDetalleController', function ($scope, $stateParams, bonoServ, $uibModal, localStorageService){
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";
        $scope.bono = {};
        
        
        bonoServ.detalleBono($stateParams.id).then(function(data){
             
            $scope.bono = data;
            // $scope.bono.metodoPago = paypalService.getPayment($scope.bono.paypalId);
            $scope.bono.cliente.nombreCompleto = $scope.bono.cliente.nombres + ' ' + $scope.bono.cliente.apellidos;
            $scope.bono.nombreDestinoCompleto = $scope.bono.nombreDestino + ' ' + $scope.bono.apellidoDestino;
            $scope.bono.montoRD = $scope.bono.monto * $scope.bono.tasa.valor;
        });

        $scope.modalPagar = function (page, size) {

            $scope.modalPagarBono = $uibModal.open({
                animation: true,
                size: size,
                templateUrl: page,
                scope: $scope,
                controller: 'bonoDetalleController',
                controllerAs: 'bono'
            });
        };
    });
})();