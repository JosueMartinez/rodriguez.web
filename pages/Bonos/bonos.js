(function () {
    var bonos = angular.module('bonos', []);

    //Servicio para bonos
    bonos.service('bonoServ', ['$http', 'settings', function ($http, settings) {
        this.obtenerBonos = function(){
            return $http.get(settings.baseUrl + "bonos")
                .then(function (response) {
                    return response.data;
                });
        }

        this.detalleBono = function(id){
            return $http.get(settings.baseUrl + "bonos/" + id)
                .then(function(response){
                    return response.data;
                });
        }

    }]);

    bonos.controller('bonoController', function($scope, bonoServ){
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";

        bonoServ.obtenerBonos().then(function (data) {
            $scope.bonos = data;
            $scope.bonos.forEach(function(element) {
                element.cliente.nombreCompleto = element.cliente.nombres + ' ' + element.cliente.apellidos;
                element.nombreDestinoCompleto = element.nombreDestino + ' ' + element.apellidoDestino;
                element.montoRd = element.monto * element.tasa.valor;
            }, this);
            
        }); 
    });

    bonos.controller('bonoDetalleController', function ($scope, $routeParams, bonoServ, $uibModal){
        $scope.pagina = "Bonos Emitidos";
        $scope.sitio = "Listado de bonos emitidos por clientes";
        $scope.bono = {};
        
        bonoServ.detalleBono($routeParams.id).then(function(data){
            console.log(data);
            $scope.bono = data;
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