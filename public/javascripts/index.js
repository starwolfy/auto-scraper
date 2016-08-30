var socket = io.connect();
new Clipboard('#copyButton');
var firstTime = true;
var spinner = "";

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#clearButton').hide();
    $('#copyButton').hide();
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
            ('#clearButton').hide();
            $('#copyButton').hide();

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

            document.getElementById("copyButton").setAttribute("data-clipboard-text", "");
            document.getElementById("vacancyList").innerHTML = "";
            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active'>Vacancy Selector: " + msg.data.selector + "</li>";
            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active'>Navigation Selector: " + msg.data.nextSelector + "</li>";
            document.getElementById("vacancyList").innerHTML += "<li class='list-group-item active' id='amounts'>Vacancies: " + msg.data.vacs + ", pages: 1</li>";

            for (var i=0; i<msg.data.links.length;i++) {
                document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'><a href='" + msg.data.links[i] + "' target='_blank'>" + msg.data.links[i] + "</a></li>"
                var currentAttr = document.getElementById("copyButton").getAttribute("data-clipboard-text");
                document.getElementById("copyButton").setAttribute("data-clipboard-text", currentAttr + msg.data.links[i] + "\n");
            }

            if (msg.data.more) {
                
                var opts = {
                lines: 13
                , length: 13 
                , width: 12
                , radius: 25
                , scale: 0.25
                , corners: 1
                , color: '#000'
                , opacity: 0.15
                , rotate: 0
                , direction: 1
                , speed: 0.5
                , trail: 60
                , fps: 20
                , zIndex: 2e9
                , className: 'spinner'
                , top: '50%'
                , left: '50%'
                , shadow: false
                , hwaccel: false
                , position: 'relative'
                }
                
                if (firstTime) {
                    var target = document.getElementById('spinner')
                    spinner = new Spinner(opts).spin(target);
                } else {
                    var target = document.getElementById('spinner')
                    spinner.spin(target);
                }
                
                
                firstTime = false;

                socket.on('moreData', function(data) {
                    document.getElementById("amounts").innerHTML = "Vacancies: " + data.totalVacs + ", pages: " + data.totalPages;
                    for (var i=0; i<data.vacs.length;i++) {
                        document.getElementById("vacancyList").innerHTML += "<li class='list-group-item'><a href='" + data.vacs[i] + "' target='_blank'>" + data.vacs[i] + "</a></li>"
                        var currentAttr = document.getElementById("copyButton").getAttribute("data-clipboard-text");
                        document.getElementById("copyButton").setAttribute("data-clipboard-text", currentAttr + data.vacs[i] + "\n");
                    }
                });
                
                socket.on('endData', function() {
                    
                    spinner.stop();
                    $('#clearButton').show();
                    $('#copyButton').show();
                    
                });
            } else {
                $('#clearButton').show();
                $('#copyButton').show();
            }

        }

    });

}

function clearClicked() {
    $('#clearButton').hide();
    $('#copyButton').hide();
    document.getElementById("vacancyList").innerHTML = "";
}