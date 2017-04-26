(function () {
    var prod = angular.module('producto', []);
   
//    Servicios para productos
    prod.service('productoServ', ['$http', 'settings', function ($http, settings) {

            this.obtenerCategorias = function () {
                return $http.get(settings.baseUrl + "categorias")
                    .then(function (response) {
                        return response.data;
                    });
            };
            //fin categorias
            

            this.obtenerProductos = function () {
                return $http.get(settings.baseUrl + "productos")
                    .then(function (response) {
                        return response.data;
                    });
                //fin productos
            };

            this.obtenerMedidas = function () {
                return $http.get(settings.baseUrl + "medidas")
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
            console.log(data);
             $scope.categorias = data;
        });

        productoServ.obtenerProductos().then(function(data){
            console.log(data);
            $scope.productos = data;
        });

        //modal para agregar productoController
        $scope.modalProducto = function (page, size) {

            $scope.modalProductoDia = $uibModal.open({
                animation: true,
                size: size,
                templateUrl: page,
                scope: $scope,
                controller: 'productoModalController',
                controllerAs: 'producto'
            });
        };

        //modal para agregar productoController
        $scope.modalCategoria = function (page, size) {

            $scope.modalCategoriaDia = $uibModal.open({
                animation: true,
                size: size,
                templateUrl: page,
                scope: $scope,
                controller: 'categoriaModalController',
                controllerAs: 'categoria'
            });
        };
    });

    prod.controller('categoriaModalController', ['settings', function ($uibModalInstance, $scope, $http, settings) {
        $scope.crearCategoria = function(){
            var categoria = $scope.categoria;
            
            //hacer POST request
            $http.post(settings.baseUrl + 'categorias',categoria)
                .then(function(response){
                    console.log(response.data);
                },function(response){
                    console.log(response.data);
                });
        };
    }]);

    prod.controller('productoModalController', ['settings', function ($uibModalInstance, $scope, productoServ, $http, settings) {
        //obteniendo categorias para poblar combobox
        productoServ.obtenerCategorias().then(function(data){
            // $scope.categorias = data;
        });
        //obteniendo categorias para poblar combobox
        productoServ.obtenerMedidas().then(function(data){
            // $scope.medidas = data;
        });
        //creando el producto cuando se hace submit desde el modal
        $scope.crearProducto = function () {
            
            var producto = $scope.producto;
            producto.medidaId = producto.medida.id;
            producto.categoriaId = producto.categoria.id;

            //hacer POST request
            $http.post(settings.baseUrl + 'productos',producto)
                .then(function(response){
                    console.log(response.data);
                },function(response){
                    console.log(response.data);
                });
        };
    }]);


})();