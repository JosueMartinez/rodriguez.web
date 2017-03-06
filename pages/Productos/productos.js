(function () {
    var prod = angular.module('producto', []);
   
    prod.service('productoServ', ['$http', function ($http) {
        
            this.obtenerCategorias = function () {
                return $http.get("http://rodriguez.api/api/categorias")
                    .then(function (response) {
                        return response.data;
                    });
            };

            this.obtenerProductos = function () {
                return $http.get("http://rodriguez.api/api/productos")
                    .then(function (response) {
                        productos = response.data;
                        return productos;
                    });
                //fin productos
            };

            this.print = function () {
                return $http.get("http://rodriguez.api/api/values")
                    .then(function (response) {
                        return response.data;
                    });
                
            };
    }]);

    prod.controller('productoController', function ($scope, $uibModal, $log, $document, $http, productoServ) {
        $scope.pagina = "Productos & Categorias";
        $scope.sitio = "este es el sitio";
        
        productoServ.obtenerCategorias().then(function(data){
            $scope.categorias = data;
        });

        productoServ.obtenerProductos().then(function(data){
            $scope.productos = data;
        });

        //modal para agregar productoController
        $scope.modalProducto = function (page, size, producto) {

            $scope.modal = $uibModal.open({
                animation: true,
                size: size,
                templateUrl: page,
                scope: $scope,
                controller: 'productoModalController',
                controllerAs: 'producto'
            });
        };
    });

    prod.controller('productoModalController', function ($uibModalInstance, $scope) {

        this.crearProducto = function () {
            //TODO validation y crearProducto
            console.log('crear producto');
            alert('test');
        };
    });
})();