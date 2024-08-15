<?php if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Ensure WooCommerce functions are available.
if ( ! function_exists( 'wc_get_order' ) ) {
    return;
}

// Define inline styles
$button_styles = "
    background-color: #7d4cf0;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
    text-transform: uppercase;
    margin: 10px 0;
    text-decoration: none;
    transition: background-color 0.3s ease;
";

$button_hover_styles = "
    background-color: #6b3ec9;
";

// Output the payment button with inline styles
?>
<div class="gwepay-payment-container">
    <button id="gwepay-pay-button" class="button alt gwepay-button" style="<?php echo esc_attr($button_styles); ?>">
        <!-- <?php echo esc_html( $gateway->get_option( 'button_text' ) ); ?> -->
         Pay With Gwepay
    </button>
</div>

<script type="text/javascript">
jQuery(function($) {
    $('#gwepay-pay-button').on('click', function(e) {
        e.preventDefault();
        alert('Payment button clicked!'); // For testing purposes
        $('form.checkout').submit();
    }).hover(
        function() {
            $(this).css('background-color', '#6b3ec9');
        },
        function() {
            $(this).css('background-color', '#7d4cf0');
        }
    );
});
</script>
