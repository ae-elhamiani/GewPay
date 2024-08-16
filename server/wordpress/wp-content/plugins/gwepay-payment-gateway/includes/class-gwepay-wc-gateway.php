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

        // Initialize the validator
        $this->validator = new Gwepay_Validator();

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
                'title'   => 'Enable/Disable',
                'type'    => 'checkbox',
                'label'   => 'Enable Gwepay Payment',
                'default' => 'yes',
            ),
            'api_key' => array(
                'title'       => 'API Key',
                'type'        => 'text',
                'description' => 'Enter your Gwepay API Key here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'Set Your API Key',
            ),
            'store_id' => array(
                'title'       => 'Store ID',
                'type'        => 'text',
                'description' => 'Enter your Gwepay Store ID here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'Set Your Store ID',
            ),
        );
    }


    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("Gwepay: $message");
        }
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
            WC_Admin_Settings::add_message(__('Gwepay settings validated successfully.', 'woocommerce'));
        } else {
            $this->log("Credential validation failed", 'error');
            WC_Admin_Settings::add_error(__('Invalid Gwepay API Key or Store ID.', 'woocommerce'));
            $saved = false;
        }

        $this->log("Finished processing admin options. Saved: " . ($saved ? 'true' : 'false'), 'info');

        // Restore WooCommerce default behavior
        remove_filter('woocommerce_admin_settings_saving', '__return_empty_array');

        return $saved;
    }
}

// Add the Gateway to WooCommerce
function add_gwepay_gateway_class($methods) {
    $methods[] = 'Gwepay_WC_Gateway';
    return $methods;
}

add_filter('woocommerce_payment_gateways', 'add_gwepay_gateway_class');
