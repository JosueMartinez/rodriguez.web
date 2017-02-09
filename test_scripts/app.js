(function(){
    var app = angular.module('rodriguez', ['directi']);

    app.controller('MainController', ['$http','$log',function($http, $log){
        this.usuario = usuario;
        var test = this;
        test.values = [];

        $http.get('http://rodriguez.api/api/values').then(function successCallback(response) {
            test.values = response.data;
        }, function errorCallback(response) {
            console.alert('no pudo conectarse');
        });
    }]);

    var usuario = {
        nombre: 'Juan Gonzalez',
        edad: 22
    }

})();
