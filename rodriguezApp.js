(function(){
  var app = angular.module('rodriguezApp', ['directives', 'routing', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

    app.controller('homeController', function ($scope) {
        $scope.pagina = "Dashboard";
        $scope.sitio = "Control Panel";
    });

    app.controller('bonoController', function ($scope, $routeParams){

        if ($routeParams.id){
            $scope.pagina = "Bono";
            $scope.sitio = "Detalles";
            //TODO a consultar con servicio
            $scope.bono = {'id': '134','remitente': 'Juan Perez','destinatario': 'Hector Gomez','fecha': '2016-03-21','monto': 4500.00,'estado': 'Emitido'}
        }else{
            $scope.pagina = "Bonos";
            $scope.sitio = "Listado";
            $scope.bonosList = bonos;
        }
    });

    app.controller('productoController', function ($scope, $uibModal, $log, $document, $http) {
        $scope.pagina = "Productos & Categorias";
        $scope.sitio = "";
        
        //obteniendo categorias
        $http.get("http://rodriguez.api/api/categorias")
        .then(function(response) {
          $scope.categorias = response.data;
          console.log('categorias: ' + response.data);
        })
        .catch(function(response) {
          console.error('Error cargando categorias', response.status, response.data);
        });
        //fin categorias

        //obteniendo productos
        // $scope.productos = productos;
        $http.get("http://rodriguez.api/api/productos")
        .then(function(response) {
          $scope.productos = response.data;
          console.log('productos: ' + response.data);
        })
        .catch(function(response) {
          console.error('Error cargando productos', response.status, response.data);
        });
        //fin productos
    });

    app.controller('ModalDemoCtrl', function ($uibModal, $log, $document) {
      var $ctrl = this;
      $ctrl.items = ['item1', 'item2', 'item3'];

      $ctrl.animationsEnabled = true;

      $ctrl.open = function (size, parentSelector) {
        var parentElem = parentSelector ? 
          angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/pages/Productos/agregarProducto.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: size,
          appendTo: parentElem,
          resolve: {
            items: function () {
              return $ctrl.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $ctrl.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $ctrl.openComponentModal = function () {
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          component: 'modalComponent',
          resolve: {
            items: function () {
              return $ctrl.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $ctrl.selected = selectedItem;
        }, function () {
          $log.info('modal-component dismissed at: ' + new Date());
        });
      };

      $ctrl.openMultipleModals = function () {
        $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: 'stackedModal.html',
          size: 'sm',
          controller: function($scope) {
            $scope.name = 'bottom';  
          }
        });

        $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title-top',
          ariaDescribedBy: 'modal-body-top',
          templateUrl: 'stackedModal.html',
          size: 'sm',
          controller: function($scope) {
            $scope.name = 'top';  
          }
        });
      };

      $ctrl.toggleAnimation = function () {
        $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
      };
    });

    app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
      var $ctrl = this;
      $ctrl.items = items;
      $ctrl.selected = {
        item: $ctrl.items[0]
      };

      $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
      };

      $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });

    var bonos = [{

            'id': '134',
            'remitente': 'Juan Perez',
            'destinatario': 'Hector Gomez',
            'fecha': '2016-03-21',
            'monto': 4500.00,
            'estado': 'Emitido'
        },
        {
            'id': '134',
            'remitente': 'Juan Perez',
            'destinatario': 'Hector Gomez',
            'fecha': '2016-03-21',
            'monto': 4500.00,
            'estado': 'Emitido'
        },
        {
            'id': '134',
            'remitente': 'Juan Perez',
            'destinatario': 'Hector Gomez',
            'fecha': '2016-03-21',
            'monto': 4500.00,
            'estado': 'Emitido'
        }];






})();