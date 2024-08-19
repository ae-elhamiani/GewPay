<?php

namespace Gwepay\Gateway;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

use Gwepay\Gateway\Gwepay_Validator;
use Gwepay\Gateway\Gwepay_Payment_Handler;

class Gwepay_WC_Gateway extends \WC_Payment_Gateway {

    private $validator;
    protected $api_key;
    protected $store_id;
    private $payment_handler;


    public function __construct() {
        $this->id                 = 'gwepay';
        $this->icon               = $this->get_icon(); // Use the get_icon() method
        $this->has_fields         = true;
        $this->method_title       = esc_html__('Gwepay Payment', 'gwepay-payment-gateway');
        $this->method_description = esc_html__('Accept Crypto Payments using Gwepay.', 'gwepay-payment-gateway');
    
        // Initialize the validator
        $this->validator = new Gwepay_Validator();
        $this->payment_handler = new Gwepay_Payment_Handler($this->api_key, $this->store_id);

        // Load the settings
        $this->init_form_fields();
        $this->init_settings();
    
        // Set gateway options from the settings
        $this->title        = $this->get_option('title');
        $this->description  = $this->get_option('description');
        $this->enabled      = $this->get_option('enabled');
        $this->api_key      = $this->get_option('api_key');
        $this->store_id     = $this->get_option('store_id');
    
        // Add actions
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));        

    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => esc_html__('Enable/Disable', 'gwepay-payment-gateway'),
                'type'    => 'checkbox',
                'label'   => esc_html__('Enable Gwepay Payment', 'gwepay-payment-gateway'),
                'default' => 'yes',
            ),
            'api_key' => array(
                'title'       => esc_html__('API Key', 'gwepay-payment-gateway'),
                'type'        => 'text',
                'description' => esc_html__('Enter your Gwepay API Key here.', 'gwepay-payment-gateway'),
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => esc_html__('Set Your API Key', 'gwepay-payment-gateway'),
            ),
            'store_id' => array(
                'title'       => esc_html__('Store ID', 'gwepay-payment-gateway'),
                'type'        => 'text',
                'description' => esc_html__('Enter your Gwepay Store ID here.', 'gwepay-payment-gateway'),
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => esc_html__('Set Your Store ID', 'gwepay-payment-gateway'),
            ),
        );
    }

    public function get_icon() {
        ob_start();
        include plugin_dir_path(__FILE__) . '../templates/gwepay-icon.php';
        $icon_html = ob_get_clean();
        return apply_filters('woocommerce_gateway_icon', $icon_html, $this->id);
    }

    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("Gwepay: $message");
        }
    }

    public function payment_fields() {
        echo '<div style="margin-bottom: 10px;">';
        echo '<strong>' . esc_html__('Pay securely using your preferred cryptocurrency. Fast, reliable, and secure transactions for your convenience.', 'gwepay-payment-gateway') . '</strong>';
        echo '</div>';
    }

    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
    
        if ($this->send_order_to_microservice($order_id)) {
            // Save order to database
            $order->update_status('pending', __('Awaiting cryptocurrency payment', 'gwepay-payment-gateway'));
    
            // Empty the cart
            WC()->cart->empty_cart();
    
            // Redirect to the payment page
            return array(
                'result'   => 'success',
                'redirect' => $this->get_payment_url($order_id),
            );
        } else {
            wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to process order.', 'error');
            return;
        }
    }

    private function get_payment_url($order_id) {
        return add_query_arg(
            array(
                'order_id' => $order_id,
                'key'      => wp_create_nonce('gwepay_payment_' . $order_id),
            ),
            home_url('/gwepay-payment/')
        );
    }

    public function process_admin_options() {
        // Override WooCommerce default success message
        add_filter('woocommerce_admin_settings_saving', function($messages) {
            return [];
        });

        $saved = parent::process_admin_options();

        // Validate API Key and Store ID
        $api_key = $this->get_option('api_key');
        $store_id = $this->get_option('store_id');
    
        $this->log("Attempting to validate credentials - API Key: {$api_key}, Store ID: {$store_id}", 'info');

        if ($this->validator->validate_credentials($api_key, $store_id)) {
            $this->log("Credentials validated successfully", 'info');
        } else {
            $this->log("Credential validation failed", 'error');
            \WC_Admin_Settings::add_error(__('Invalid Gwepay API Key or Store ID.', 'woocommerce'));
            $saved = false;
        }

        $this->log("Finished processing admin options. Saved: " . ($saved ? 'true' : 'false'), 'info');

        return $saved;
    }

    private function send_order_to_microservice($order_id) {
        $order = wc_get_order($order_id);
        $items = array();
        $store_id = $this->store_id;
        $merchant_id = substr($store_id, 0, strrpos($store_id, '-'));

        foreach ($order->get_items() as $item_id => $item) {
            $product = $item->get_product();
            $items[] = array(
                'productId' => $product->get_id(),
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'price' => $item->get_total()
            );
        }

        $order_data = array(
            'merchantId' => $merchant_id,
            'storeId' => $this->store_id,
            'orderId' => $order->get_id(),
            'amount' => floatval($order->get_total()),
            'currency' => $order->get_currency(),
            'customerEmail' => $order->get_billing_email(),
            'items' => $items,
            'createdAt' => date('Y-m-d H:i:s'),       // Default value, using current timestamp

        );

        $response = wp_remote_post('http://payment-service:5006/api/orders', array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($order_data),
            'timeout' => 30
        ));

        if (is_wp_error($response)) {
            $this->log("Error sending order to microservice: " . $response->get_error_message());
            return false;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($body['success']) && $body['success']) {
            $this->log("Order successfully sent to microservice. Custom ID: " . $body['customId']);
            return true;
        } else {
            $this->log("Error response from microservice: " . json_encode($body));
            return false;
        }
    }
}
?>
