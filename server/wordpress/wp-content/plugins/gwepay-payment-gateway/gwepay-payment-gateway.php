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


// Ensure the settings are reset on activation
register_activation_hook(__FILE__, 'gwepay_reset_options');

function gwepay_reset_options() {
    delete_option('woocommerce_gwepay_settings'); // Delete any saved options to ensure a clean slate
}


function gwepay_init_gateway() {
    // Check if WooCommerce is active
    if (!class_exists('WC_Payment_Gateway')) {
        add_action('admin_notices', function() {
            echo '<div class="error"><p>' . esc_html__('GwePay requires WooCommerce to be active.', 'gwepay-payment-gateway') . '</p></div>';
        });
        return;
    }

    // Include necessary classes
    require_once plugin_dir_path(__FILE__) . 'includes/Gwepay_Validator.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-wc-gateway.php';

    // Register the gateway with WooCommerce
    add_filter('woocommerce_payment_gateways', 'add_gwepay_gateway_class');

    error_log("GwePay: Gateway added to WooCommerce payment methods");
}

// Add the Configure link to the plugin on the plugins page
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'gwepay_add_configure_link');
add_action('plugins_loaded', 'gwepay_init_gateway', 11);

function gwepay_add_configure_link($links) {
    $settings_link = '<a href="' . esc_url(admin_url('admin.php?page=wc-settings&tab=checkout&section=gwepay')) . '">' . esc_html__('Configure', 'gwepay-payment-gateway') . '</a>';
    array_unshift($links, $settings_link); 
    return $links;
}

// Add the Gateway to WooCommerce
function add_gwepay_gateway_class($methods) {
    $methods[] = 'Gwepay\Gateway\Gwepay_WC_Gateway';
    return $methods;
}


?>
