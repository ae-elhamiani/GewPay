<?php

// // commented plugin 
// /*
// Plugin Name: GWEPAY Crypto Payment Gateway
// Description: Accept payments using Gwepay.
// Version: 1.4
// Author: GWENOD
// Text Domain: gwepay-payment-gateway
// */


if (!defined('ABSPATH')) {
    exit;
}


// Ensure the settings are reset on activation
register_activation_hook(__FILE__, 'gwepay_reset_options');
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'gwepay_add_configure_link');

function gwepay_reset_options() {
    delete_option('woocommerce_gwepay_settings'); // Delete any saved options to ensure a clean slate
}

add_action('plugins_loaded', 'gwepay_init_gateway', 11);
function gwepay_init_gateway() {
    // Check if WooCommerce is active
    if (!class_exists('WC_Payment_Gateway')) {
        add_action('admin_notices', function() {
            echo '<div class="error"><p>' . esc_html__('GwePay requires WooCommerce to be active.', 'gwepay-payment-gateway') . '</p></div>';
        });
        return;
    }

    require_once plugin_dir_path(__FILE__) . 'includes/Gwepay_Validator.php';
    require_once plugin_dir_path(__FILE__) . 'includes/class-gwepay-wc-gateway.php';


    // Register the gateway with WooCommerce
    add_filter('woocommerce_payment_gateways', 'add_gwepay_gateway_class');
    add_filter('woocommerce_payment_gateways_webhook_classes', 'add_gwepay_webhook_class');
    error_log("GwePay: Gateway added to WooCommerce payment methods");
}

function add_gwepay_webhook_class($webhooks) {
    $webhooks['gwepay'] = 'WC_Gwepay_Webhook_Handler';
    return $webhooks;
}

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


add_action('woocommerce_blocks_loaded', 'gwepay_register_block_support');
function gwepay_register_block_support() {
    error_log("GwePay: Attempting to register block support");
    if (class_exists('Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType')) {
        error_log("GwePay: AbstractPaymentMethodType class exists");
        $file_path = plugin_dir_path(__FILE__) . 'includes/class-gwepay-blocks-support.php';
        if (file_exists($file_path)) {
            require_once $file_path;
            error_log("GwePay: Loaded class-gwepay-blocks-support.php");
            add_action(
                'woocommerce_blocks_payment_method_type_registration',
                function($registry) {
                    error_log("GwePay: Attempting to register Gwepay_Blocks_Support");
                    if (class_exists('Gwepay\Gateway\Gwepay_Blocks_Support')) {
                        $registry->register(new Gwepay\Gateway\Gwepay_Blocks_Support());
                        error_log("GwePay: Successfully registered Gwepay_Blocks_Support");
                    } else {
                        error_log("GwePay: Gwepay_Blocks_Support class does not exist");
                    }
                }
            );
        } else {
            error_log("GwePay: class-gwepay-blocks-support.php file not found");
        }
    } else {
        error_log("GwePay: AbstractPaymentMethodType class does not exist");
    }
}


add_action('admin_enqueue_scripts', 'gwepay_enqueue_block_scripts');
add_action('wp_enqueue_scripts', 'gwepay_enqueue_block_scripts');
function gwepay_enqueue_block_scripts() {
    error_log("GwePay: Attempting to enqueue block scripts");
    if (function_exists('wp_enqueue_script') && function_exists('wp_register_script')) {
        $script_path = plugin_dir_path(__FILE__) . 'assets/js/gwepay-button.js';
        if (file_exists($script_path)) {
            wp_register_script(
                'gwepay-blocks-integration',
                plugins_url('assets/js/gwepay-button.js', __FILE__),
                ['wp-element', 'wp-components', 'wp-blocks', 'wc-blocks-registry'],
                filemtime($script_path),
                true
            );
            wp_enqueue_script('gwepay-blocks-integration');
            error_log("GwePay: Successfully enqueued block scripts");
        } else {
            error_log("GwePay: gwepay-button.js file not found");
        }
    } else {
        error_log("GwePay: wp_enqueue_script or wp_register_script function not available");
    }
}

add_action('init', 'handle_custom_order_status_update');
function handle_custom_order_status_update() {
    if (isset($_GET['update_order_status']) && $_GET['update_order_status'] == 1) {
        $order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
        $status = isset($_POST['status']) ? sanitize_text_field($_POST['status']) : '';

        if ($order_id && in_array($status, ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'])) {
            $order = wc_get_order($order_id);
            if ($order) {
                $order->update_status($status);
                wp_send_json_success(['message' => "Order status updated to $status."]);
            } else {
                wp_send_json_error(['message' => 'Invalid order ID.']);
            }
        } else {
            wp_send_json_error(['message' => 'Missing or invalid order ID or status.']);
        }
        exit;
    }
}

