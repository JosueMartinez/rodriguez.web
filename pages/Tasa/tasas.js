var tasa = angular.module('tasas', []);

tasa.service('tasaServ', ['$http', 'settings', 'localStorageService', function ($http, settings, localStorageService) {
    var authData = localStorageService.get('authorizationData');
    this.obtenerTasas = function () {
        return  $http({
            method: 'GET',
            url: settings.baseUrl + "tasas",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
        }).then(function (response) {
            return response.data;
        });
    };

    this.obtenerHistorial = function(moneda){
        
        return  $http({
            method: 'GET',
            url: settings.baseUrl + "monedas/"+moneda.id+"/historial",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
        }).then(function (response) {
            return response.data;
        });
    };

    this.obtenerMonedas = function(){
        return  $http({
            method: 'GET',
            url: settings.baseUrl + "monedas",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
        }).then(function (response) {
            return response.data;
        });
    };

    this.guardarTasa = function(tasa){
        return $http({
            method: 'POST',
            url: settings.baseUrl + "tasas",
            data: tasa,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
        }).then(function successCallback(response) {
            return  response;
        }, function errorCallback(response) {
            return response;
        });
    };
}]);

tasa.controller('tasaController', function ($scope, localStorageService, tasaServ, $uibModal) {
    $scope.pagina = "Tasas de Cambio";
    $scope.sitio = "Tasas del día";
    $scope.tasas = "";

    $scope.tasaInput = 1.00;

    var authData = localStorageService.get('authorizationData');
    if(authData){
        tasaServ.obtenerTasas().then(function(data){
             $scope.tasas = data;
        });
    }else{
        $location.path('/login');
    }

    //modal para agregar productoController
    $scope.modalNuevaTasa = function (page, size) {

        $scope.modalTasa= $uibModal.open({
            animation: true,
            size: size,
            templateUrl: page,
            scope: $scope,
            controller: 'tasaModalController as tasa'
        }).closed.then(function(){
            tasaServ.obtenerTasas().then(function(data){
                 $scope.tasas = data;
            });
        });
    };

    $scope.historial = function (moneda, page, size){
        $scope.monedaSeleccionada = moneda;
        $scope.modalHistorial= $uibModal.open({
            animation: true,
            size: size,
            templateUrl: page,
            scope: $scope,
            controller: 'historialModalController as hist'
        });
    };

    $scope.modalHistorialTasa = function(page,size){
        $scope.modalHistorial= $uibModal.open({
            animation: true,
            size: size,
            templateUrl: page,
            scope: $scope,
            controller: 'historialModalController as hist'
        });
    };
});

tasa.controller('historialModalController', function(tasaServ,$scope, $uibModalInstance){
    tasaServ.obtenerHistorial($scope.monedaSeleccionada).then(function(data){
        $scope.historial = data;
    });
});

tasa.controller('tasaModalController', function (tasaServ, $scope, $uibModalInstance){
    //obteniendo monedas para poblar combobox
    tasaServ.obtenerMonedas().then(function(data){
        $scope.monedas = data;
    });

    //creando la tasa cuando se hace submit desde el modal
    $scope.crearTasa = function () {

        var tasa = $scope.tasa;
        tasa.monedaId = tasa.moneda.id;

        //hacer POST request
        tasaServ.guardarTasa(tasa)
        .then(function(response){
            if(response.status.toString().includes("20")){
                alert("Se ha cambiado la tasa");
                $uibModalInstance.close();
            }else{
                alert(response.data.Message);
            }
        });
    };
});