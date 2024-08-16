<?php
/*
Plugin Name: GWEPAY Crypto Payment Gateway
Description: Accept payments using Gwepay.
Version: 1.0
Author: GWENOD
Text Domain: gwepay-payment-gateway
*/

if (!defined('ABSPATH')) {
    exit;
}

function gwepay_init_gateway() {
    // Check if WooCommerce is active
    if (!class_exists('WC_Payment_Gateway')) {
        add_action('admin_notices', function() {
            echo '<div class="error"><p>GwePay requires WooCommerce to be active.</p></div>';
        });
        return;
    }

    // Include necessary classes
    require_once plugin_dir_path(__FILE__) . 'includes/Gwepay_Validator.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-wc-gateway.php';

    // Register the gateway with WooCommerce
    add_filter('woocommerce_payment_gateways', function($gateways) {
        if (!in_array('Gwepay_WC_Gateway', $gateways)) {
            $gateways[] = 'Gwepay_WC_Gateway';
        }
        return $gateways;
    });

    error_log("GwePay: Gateway added to WooCommerce payment methods");
}

add_action('plugins_loaded', 'gwepay_init_gateway', 11);

// Activation and deactivation hooks
register_activation_hook(__FILE__, 'gwepay_activate');
register_deactivation_hook(__FILE__, 'gwepay_deactivate');

function gwepay_activate() {
    // Activation tasks
}

function gwepay_deactivate() {
    // Deactivation tasks
}
