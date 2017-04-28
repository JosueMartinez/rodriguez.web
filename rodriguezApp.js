(function () {
    var app = angular.module('rodriguezApp', ['bonos','producto', 'directives', 'routing', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

    app.constant("settings", {
        "baseUrl": "http://smrodriguez.azurewebsites.net/api/",
        "port": "80"
    })

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

    app.controller('homeController', function ($scope) {
        $scope.pagina = "Dashboard";
        $scope.sitio = "Control Panel";
    });

    // app.controller('bonoController', function ($scope, $routeParams) {
    //     if ($routeParams.id) {
    //         $scope.pagina = "Bono";
    //         $scope.sitio = "Detalles";

    //         //TODO a consultar con servicio
    //         $scope.bono = { 'id': '134', 'remitente': 'Juan Perez', 'destinatario': 'Hector Gomez', 'fecha': '2016-03-21', 'monto': 4500.00, 'estado': 'Emitido' }
    //     } else {
    //         $scope.pagina = "Bonos";
    //         $scope.sitio = "Listado";
    //         $scope.bonosList = [];
    //     }
    // });
})();