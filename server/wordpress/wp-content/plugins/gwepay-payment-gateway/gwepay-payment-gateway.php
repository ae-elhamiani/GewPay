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

    // Include the interface and necessary classes
    require_once plugin_dir_path(__FILE__) . 'includes/interfaces/class-gwepay-validator-interface.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-api-validator.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-store-validator.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-validator-factory.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-wc-gateway.php';

    // Register the gateway with WooCommerce
    add_filter('woocommerce_payment_gateways', function($gateways) {
        $gateways[] = 'Gwepay_WC_Gateway';
        return $gateways;
    });
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
