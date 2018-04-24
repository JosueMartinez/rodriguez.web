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
                    response.error = true
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
                    response.error = true;
                    return response;
                });
            };

            this.borrarProducto = function(id){
                return $http({
                    method: 'DELETE',
                    url: settings.baseUrl + "productos/" + id,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authData.token}
                }).then(function successCallback(response) {
                    return  response;
                }, function errorCallback(response) {
                    response.error = true;
                    return response;
                });
            };
    }]);
//   Fin de servicios para productos

    prod.controller('productoController', function ($scope, $uibModal, $log, $document, $http, productoServ, localStorageService, $location, $window, Notification) {
        $scope.pagina = "Productos & Categorias";
        $scope.sitio = "Manejo de Productos y Categorias para Listas de Compras";
        
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
                productoServ.borrarProducto(id).then(function(response){
                    if(!response.error){
                        Notification.success({ message: 'Producto borrado', delay: 5000 });
                        productoServ.obtenerProductos(authData).then(function(data){
                             $scope.productos = data;
                        });
                    }else{
                        Notification.error({ message: 'No se ha podido borrrar el producto', positionY: 'bottom', delay: 5000 });
                    }
                    
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
            }).closed.then(function(){
                productoServ.obtenerProductos(authData).then(function(data){
                    $scope.productos = data;
                });
            });;
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
            }).closed.then(function(){
                productoServ.obtenerCategorias(authData).then(function(data){
                    $scope.categorias = data;
                });
            });;
        };
    });

    prod.controller('categoriaModalController', function ($uibModalInstance, productoServ, $scope, Notification) {
        var categoria = {};

        this.crearCategoria = function(){
            categoria.descripcion = this.descripcion;
            console.log(categoria);
            productoServ.guardarCategoria(categoria)
                .then(function(response){
                    if(!response.error){
                        Notification.success({ message: 'Se ha creado la categoría con éxtio', delay: 5000 });
                        // $scope.categorias.push(response.data);
                        $uibModalInstance.close();
                    }else{
                        Notification.error({ message: 'Ha ocurrido un error', positionY: 'bottom', delay: 5000 });
                    }
                });
        };
    });

    prod.controller('productoModalController', function ($uibModalInstance, productoServ, $scope, $http, settings, Notification) {
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
            producto.MedidaId = producto.Medida.Id;
            producto.CategoriaId = producto.Categoria.Id;

            //hacer POST request
            productoServ.guardarProducto(producto)
            .then(function(response){
                if(!response.error){
                    Notification.success({message: 'Se ha creado el producto ' + response.data.Nombre, delay: 5000 });
                    // alert("Se ha creado el producto " + response.data.nombre);
                    // $scope.productos.push(response.data);
                    $uibModalInstance.close();
                }else{
                    Notification.error({ message: 'No se ha podido guardar el producto', positionY: 'bottom', delay: 5000 });
                    // alert(response.data.Message);

                }
            });
        };
    });


})();