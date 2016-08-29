var socket = io.connect();

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

function submitClicked() {

    var index = document.getElementById("inputIndex").value,
        example = document.getElementById("inputExample").value,
        next = document.getElementById("inputNext").value;


    if (index == "" || example == "") {

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        toastr["warning"]("...", "Fill in all fields");
        return;

    }

    socket.emit('submitClicked', {
        inputIndex: index,
        inputExample: example,
        inputNext: next
    }, function(msg) {

        if (msg.error != null) {

            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }

            toastr["warning"](msg.error, "Something went wrong:");

            document.getElementById("vacancyList").innerHTML = "";

        } else {

            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }

            toastr["success"]("...", "Success!");

            document.getElementById("vacancyList").innerHTML = "";

            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active'>Vacancy Selector: " + msg.data.selector + "</li>"
            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active'>Navigation Selector: " + msg.data.nextSelector + "</li>"

            for (var i=0; i<msg.data.links.length;i++) {
                document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'>" + msg.data.links[i] + "</li>";
            }

            if (msg.data.more) {

                socket.on('moreData', function(data) {
                    for (var i=0; i<data.length;i++) {
                        document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'>" + data[i] + "</li>"
                    }
                });
            }

        }

    });

}