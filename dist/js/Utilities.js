(function() {
    var utilities = angular.module('utilities', ['base64']);

    utilities.service('utilitiesServ', [function() {
        var functions = {
            formatearFecha: function(fechaCompra) {
                let current_datetime = new Date(fechaCompra);
                let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear() + " " + (current_datetime.getHours() - 12) + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()

                if (current_datetime.getHours() > 12) {
                    formatted_date += " PM";
                } else {
                    formatted_date += " AM";
                }

                return formatted_date;
            },
            formatearCedula: function(cedula) {
                return cedula.substring(0, 3) + "-" + cedula.substring(3, 10) + "-" + cedula.substring(10);
            },
            formatearNumero: function(num) {
                return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }
        };

        return functions;
    }]);
})();