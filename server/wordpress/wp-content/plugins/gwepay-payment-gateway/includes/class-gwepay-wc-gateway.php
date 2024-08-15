<?php

if (!defined('ABSPATH')) {
    exit;
}

// Include validators
require_once plugin_dir_path(__FILE__) . 'class-gwepay-api-validator.php';
require_once plugin_dir_path(__FILE__) . 'class-gwepay-store-validator.php';
require_once plugin_dir_path(__FILE__) . 'class-gwepay-validator-factory.php';

class Gwepay_WC_Gateway extends WC_Payment_Gateway {

    private $api_key;
    private $store_id;
    private $api_validator;
    private $store_validator;

    public function __construct() {
        $this->id                 = 'gwepay';
        $this->icon               = ''; // URL to your payment gateway's icon.
        $this->has_fields         = true; // Set to true to display custom fields.
        $this->method_title       = 'Gwepay';
        $this->method_description = 'Accept payments using Gwepay.';

        // Load the settings.
        $this->init_form_fields();
        $this->init_settings();

        // Define user settings.
        $this->title        = $this->get_option('title');
        $this->description  = $this->get_option('description');
        $this->enabled      = $this->get_option('enabled');
        $this->api_key      = $this->get_option('api_key');
        $this->store_id     = $this->get_option('store_id');

        // Initialize Validators using Factory
        $this->api_validator = Gwepay_Validator_Factory::create_api_validator();
        $this->store_validator = Gwepay_Validator_Factory::create_store_validator();

        // Actions and filters.
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => 'Enable/Disable',
                'type'    => 'checkbox',
                'label'   => 'Enable Gwepay Payment',
                'default' => 'yes'
            ),
            'api_key' => array(
                'title'       => 'API Key',
                'type'        => 'text',
                'description' => 'Enter your Gwepay API Key here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'Your API Key...',
            ),
            'store_id' => array(
                'title'       => 'Store ID',
                'type'        => 'text',
                'description' => 'Enter your Gwepay Store ID here.',
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => 'Your Store ID...',
            ),
            
        );
    }

    

    public function payment_fields() {
        if ($this->description) {
            echo wpautop(wp_kses_post($this->description));
        }
    
        // Path to the custom button template
        $template_path = plugin_dir_path(__FILE__) . '../templates/gwepay-checkout-button.php';
    
        if (file_exists($template_path)) {
            // Pass the gateway instance to the template
            $gateway = $this; // Assign $this to $gateway
            include $template_path;
        } else {
            error_log('Gwepay template file not found: ' . $template_path);
        }
    }
    

    public function process_admin_options() {
        $saved = parent::process_admin_options();

        // Validate the API Key and Store ID
        $api_key_valid = $this->api_validator->validate($this->get_option('api_key'));
        $store_id_valid = $this->store_validator->validate($this->get_option('store_id'));

        if (!$api_key_valid) {
            WC_Admin_Settings::add_error(__('Invalid API Key. Please check and try again.', 'gwepay-payment-gateway'));
            $saved = false;
        }

        if (!$store_id_valid) {
            WC_Admin_Settings::add_error(__('Invalid Store ID. Please check and try again.', 'gwepay-payment-gateway'));
            $saved = false;
        }

        if ($saved) {
            WC_Admin_Settings::add_message(__('API Key and Store ID validated successfully.', 'gwepay-payment-gateway'));
        }

        return $saved;
    }
}
