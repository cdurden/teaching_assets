$(document).ready(function() {
    $('form').submit(function (e) {
        socket.emit('form_submit', data=getFormData( $(this) ));
        e.preventDefault(); // block the traditional submission of the form.
    });
});
