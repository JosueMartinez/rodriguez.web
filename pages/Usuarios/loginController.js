'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'Notification', function ($scope, $location, authService, Notification) {

    $scope.loginData = {
        userName: "",
        password: "",
        client_id: "clientApp"
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/bonos');

        },
        function (err) {
            Notification.error({ message: 'Usuario y/o contraseña incorrecta', positionY: 'bottom', delay: 5000 });
        });
    };

}]);