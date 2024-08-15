jQuery(function($) {
    $('#gwepay-pay-button').on('click', function(e) {
        e.preventDefault();
        alert('Gwepay payment button clicked!');
        $('form.checkout').submit();
    });
});
