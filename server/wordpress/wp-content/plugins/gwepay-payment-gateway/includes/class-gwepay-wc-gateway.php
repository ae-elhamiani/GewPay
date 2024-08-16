<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

require_once(plugin_dir_path(__FILE__) . 'Gwepay_Validator.php');

class Gwepay_WC_Gateway extends WC_Payment_Gateway {
    private $validator;
    protected $api_key;
    protected $store_id;

    public function __construct() {
        $this->id                 = 'gwepay';
        $this->icon               = ''; // URL to the icon should be here
        $this->has_fields         = false;
        $this->method_title       = 'Gwepay';
        $this->method_description = 'Accept payments using Gwepay.';

        $this->validator = new Gwepay_Validator();

        // Load the settings
        $this->init_form_fields();
        $this->init_settings();

        // Define user set variables
        $this->title        = $this->get_option('title');
        $this->description  = $this->get_option('description');
        $this->enabled      = $this->get_option('enabled');
        $this->api_key      = $this->get_option('api_key');
        $this->store_id     = $this->get_option('store_id');

        // Actions
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        add_action('woocommerce_api_gwepay_callback', array($this, 'webhook'));

        $this->log("Gwepay_WC_Gateway initialized");
    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => 'Enable/Disable',
                'type'    => 'checkbox',
                'label'   => 'Enable Gwepay Payment',
                'default' => 'yes'
            ),
            'title' => array(
                'title'       => 'Title',
                'type'        => 'text',
                'description' => 'This controls the title which the user sees during checkout.',
                'default'     => 'Gwepay Payment',
                'desc_tip'    => true,
            ),
            'description' => array(
                'title'       => 'Description',
                'type'        => 'textarea',
                'description' => 'Payment method description that the customer will see on your checkout.',
                'default'     => 'Pay securely using Gwepay.',
            ),
            'api_key' => array(
                'title'       => 'API Key',
                'type'        => 'text',
                'description' => 'Enter your Gwepay API Key here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxx',
            ),
            'store_id' => array(
                'title'       => 'Store ID',
                'type'        => 'text',
                'description' => 'Enter your Gwepay Store ID here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'store_xxxxxxxxxxxxxxxx',
            ),
        );
    }


    public function process_payment($order_id) {
        // Payment processing logic goes here
        // This is just a placeholder
        $order = wc_get_order($order_id);
        $order->update_status('on-hold', __('Awaiting Gwepay payment', 'woocommerce'));
        
        // Reduce stock levels
        wc_reduce_stock_levels($order_id);
        
        // Remove cart
        WC()->cart->empty_cart();
        
        // Return thankyou redirect
        return array(
            'result'   => 'success',
            'redirect' => $this->get_return_url($order),
        );
    }

    public function webhook() {
        // Webhook handling logic goes here
        $this->log("Webhook received");
        // Implement your webhook logic here
    }

    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("Gwepay: $message");
        }
    }

    public function process_admin_options() {
        $this->log("Starting to process admin options", 'info');
        $saved = parent::process_admin_options();
    
        // Validate API Key and Store ID
        $api_key = $this->get_option('api_key');
        $store_id = $this->get_option('store_id');
    
        $this->log("Attempting to validate credentials - API Key: {$api_key}, Store ID: {$store_id}", 'info');
    
        if ($this->validator->validate_credentials($api_key, $store_id)) {
            $this->log("Credentials validated successfully", 'info');
            WC_Admin_Settings::add_message(__('Gwepay settings validated successfully.', 'woocommerce'));
        } else {
            $this->log("Credential validation failed", 'error');
            WC_Admin_Settings::add_error(__('Invalid Gwepay API Key or Store ID.', 'woocommerce'));
            $saved = false;
        }
    
        $this->log("Finished processing admin options. Saved: " . ($saved ? 'true' : 'false'), 'info');
        return $saved;
    }
}

// Add the Gateway to WooCommerce
function add_gwepay_gateway_class($methods) {
    $methods[] = 'Gwepay_WC_Gateway';
    return $methods;
}


add_filter('woocommerce_payment_gateways', 'add_gwepay_gateway_class');