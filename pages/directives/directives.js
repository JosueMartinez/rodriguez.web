(function(){
    var dir = angular.module('directives',[]);

    //Header
    dir.directive('headerDirective', function(){
        return{
            restrict: 'E',
            templateUrl: 'pages/directives/header.html'
        };
    });
    //Fin Header

    //sidebar
    dir.directive('sideBar', function(){
        return{
            restrict: 'E',
            templateUrl: 'pages/directives/sidebar.html'
        };
    });
    //Fin sidebar

    //Footer
    dir.controller('FooterController', function () {
        this.year = new Date().getFullYear();;
        this.version = '1.0.0';
    });  

    dir.directive('footerDirective', function(){
        return{
            restrict: 'E',
            templateUrl: '/pages/directives/footer.html'
        };
    });
    //Fin Footer

    //Content Header
    dir.directive('contentHeader',function(){
        return{
            restrict: 'E',
            templateUrl: '/pages/directives/content-header.html'
        };
    });
    //Fin Content Header

})();