(function () {
    var prod = angular.module('producto', []);
   
//    Servicios para productos
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
                        return response.data;
                    });
                //fin productos
            };

            this.obtenerMedidas = function () {
                return $http.get("http://rodriguez.api/api/medidas")
                    .then(function (response) {
                        return response.data;
                    });
                //fin medidas
            };
    }]);
//   Fin de servicios para productos

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

    prod.controller('productoModalController', function ($uibModalInstance, $scope, productoServ, $http) {
        //obteniendo categorias para poblar combobox
        productoServ.obtenerCategorias().then(function(data){
            $scope.categorias = data;
        });
        //obteniendo categorias para poblar combobox
        productoServ.obtenerMedidas().then(function(data){
            $scope.medidas = data;
        });

        $scope.crearProducto = function () {
            
            var producto = $scope.producto;
            producto.medidaId = producto.medida.id;
            producto.categoriaId = producto.categoria.id;
            //hacer POST request
            $http.post('http://rodriguez.api/api/productos',producto)
                .then(function(response){
                    console.log(response.data);
                },function(response){
                    console.log(response.data);
                });


            
        };
    });
})();