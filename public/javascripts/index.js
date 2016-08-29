var socket = io.connect();

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

function submitClicked() {

    var index = document.getElementById("inputIndex").value,
        example = document.getElementById("inputExample").value,
        next = document.getElementById("inputNext").value,
        interval = document.getElementById("inputInterval").value,
        requestVal = document.getElementById("inputRequestAmount").value;


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
        inputNext: next,
        inputInterval: interval,
        inputRequestVal: requestVal
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
            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active' id='amounts'>Vacancies: " + msg.data.vacs + ", pages: 1</li>"

            for (var i=0; i<msg.data.links.length;i++) {
                document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'>" + msg.data.links[i] + "</li>";
            }

            if (msg.data.more) {
                
                var opts = {
                lines: 13 // The number of lines to draw
                , length: 13 // The length of each line
                , width: 12 // The line thickness
                , radius: 25 // The radius of the inner circle
                , scale: 0.25 // Scales overall size of the spinner
                , corners: 1 // Corner roundness (0..1)
                , color: '#000' // #rgb or #rrggbb or array of colors
                , opacity: 0.15 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 0.5 // Rounds per second
                , trail: 60 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: 'spinner' // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: false // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'relative' // Element positioning
                }
                var target = document.getElementById('spinner')
                var spinner = new Spinner(opts).spin(target);

                socket.on('moreData', function(data) {
                    document.getElementById("amounts").innerHTML = "Vacancies: " + data.totalVacs + ", pages: " + data.totalPages;
                    for (var i=0; i<data.vacs.length;i++) {
                        document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'>" + data.vacs[i] + "</li>"
                    }
                });
                
                socket.on('endData', function() {
                    
                    document.getElementById("spinner").outerHTML = "";
                    
                });
            }

        }

    });

}