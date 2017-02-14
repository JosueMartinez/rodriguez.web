(function(){
    var app = angular.module('rodriguezApp', ['directives', 'routing']);

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

    app.controller('homeController', function ($scope) {
        $scope.pagina = "Dashboard";
        $scope.sitio = "Control Panel";
    });

    app.controller('bonoController', function($scope){
        $scope.pagina = "Bonos";
        $scope.sitio = "Listado";
        $scope.bonosList = bonos;
    });

    app.controller('productoController', function ($scope) {
        $scope.pagina = "Productos";
        $scope.sitio = "Listado";
    });



    // Objectos para prueba antes de que se inserte en la bd
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