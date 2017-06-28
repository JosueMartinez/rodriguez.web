(function () {
    var prod = angular.module('producto', []);
   
//    Servicios para productos
    prod.service('productoServ', ['$http', 'settings', 'localStorageService', function ($http, settings, localStorageService) {
            var authData = localStorageService.get('authorizationData');
            this.obtenerCategorias = function () {
                return  $http({
                    method: 'GET',
                    url: settings.baseUrl + "categorias",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function (response) {
                    return response.data;
                });
            };
            //fin categorias
            

            this.obtenerProductos = function (authData) {

                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "productos",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function (response) {
                    return response.data;
                });
                //fin productos
            };

            this.obtenerMedidas = function () {
                return $http({
                    method: 'GET',
                    url: settings.baseUrl + "medidas",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function (response) {
                    return response.data;
                });
                //fin medidas
            };

            this.guardarCategoria = function(categoria){
                return $http({
                    method: 'POST',
                    url: settings.baseUrl + "categorias",
                    data: categoria,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function successCallback(response) {
                    return  response;
                }, function errorCallback(response) {
                    return response;
                });
            };

            this.guardarProducto = function(producto){
                return $http({
                    method: 'POST',
                    url: settings.baseUrl + "productos",
                    data: producto,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function successCallback(response) {
                    return  response;
                }, function errorCallback(response) {
                    return response;
                });
            };

            this.borrarProducto = function(id){
                return $http({
                    method: 'DELETE',
                    url: settings.baseUrl + "productos/" + id,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function successCallback(response) {
                    alert("Se ha borrado el producto " + response.nombre);
                    return  response;
                }, function errorCallback(response) {
                    alert("El producto esta siendo usado en listas de compras y no se puede borrar");
                    return response;
                });
            };
    }]);
//   Fin de servicios para productos

    prod.controller('productoController', function ($scope, $uibModal, $log, $document, $http, productoServ, localStorageService, $location, $window) {
        $scope.pagina = "Productos & Categorias";
        $scope.sitio = "este es el sitio";
        
        var authData = localStorageService.get('authorizationData');
        if(authData){
            productoServ.obtenerCategorias(authData).then(function(data){
                 $scope.categorias = data;
            });

            productoServ.obtenerProductos(authData).then(function(data){
                $scope.productos = data;
            });
        }else{
            $location.path('/login');
        }
        
        $scope.borrar = function(id){
            var confirmar = $window.confirm("¿Seguro de querer borrar el producto?");
            if(confirmar){
                productoServ.borrarProducto(id).then(function(data){
                    productoServ.obtenerProductos(authData).then(function(data){
                        $scope.productos = data;
                    });
                });
            }
        };

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

    prod.controller('categoriaModalController', function ($uibModalInstance, productoServ, $scope) {
        var categoria = {};

        this.crearCategoria = function(){
            categoria.descripcion = this.descripcion;
            console.log(categoria);
            productoServ.guardarCategoria(categoria)
                .then(function(response){
                    if(response.status.toString().includes("20")){
                        alert("Se ha creado la categoría " + response.data.descripcion);
                        $scope.categorias.push(response.data);
                        $uibModalInstance.close();
                    }else{
                        alert(response.data.Message);
                    }
                });
        };
    });

    prod.controller('productoModalController', function ($uibModalInstance, productoServ, $scope, $http, settings) {
        //obteniendo categorias para poblar combobox
        productoServ.obtenerCategorias().then(function(data){
            // $scope.categorias = data;
        });

        //obteniendo categorias para poblar combobox
        productoServ.obtenerMedidas().then(function(data){
            $scope.medidas = data;
        });

        //creando el producto cuando se hace submit desde el modal
        $scope.crearProducto = function () {
            
            var producto = $scope.producto;
            producto.medidaId = producto.medida.id;
            producto.categoriaId = producto.categoria.id;

            //hacer POST request
            productoServ.guardarProducto(producto)
            .then(function(response){
                if(response.status.toString().includes("20")){
                    alert("Se ha creado el producto " + response.data.nombre);
                    $scope.productos.push(response.data);
                    $uibModalInstance.close();
                }else{
                    alert(response.data.Message);
                }
            });
        };
    });


})();