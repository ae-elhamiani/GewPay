<?php

namespace Gwepay\Gateway;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

use Gwepay\Gateway\Gwepay_Validator;

class Gwepay_WC_Gateway extends \WC_Payment_Gateway_CC {

    private $validator;
    protected $api_key;
    protected $store_id;


    public function __construct() {
        $this->id                 = 'gwepay';
        $this->icon               = ''; // Use the get_icon() method
        $this->has_fields         = true;
        $this->method_title       = esc_html__('Gwepay Payment', 'gwepay-payment-gateway');
        $this->method_description = esc_html__('Accept Crypto Payments using Gwepay.', 'gwepay-payment-gateway');
        $this->supports = array(
            'products',
            'refunds',
            'tokenization',
            'add_payment_method',
            'woocommerce-blocks',
        );

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


        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));        
        error_log("GwePay: Gwepay_WC_Gateway constructed with supports: " . print_r($this->supports, true));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));

    }

    public function get_supported_features() {
        return $this->supports;
    }

    public function is_available() {
        $is_available = parent::is_available();
        error_log("GwePay: is_available called, result: " . ($is_available ? 'true' : 'false'));
        return $is_available;
    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => esc_html__('Enable/Disable', 'gwepay-payment-gateway'),
                'type'    => 'checkbox',
                'label'   => esc_html__('Enable Gwepay Payment', 'gwepay-payment-gateway'),
                'default' => 'yes',
            ),
            'store_id' => array(
                'title'       => esc_html__('Store ID', 'gwepay-payment-gateway'),
                'type'        => 'text',
                'description' => esc_html__('Enter your Gwepay Store ID here.', 'gwepay-payment-gateway'),
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => esc_html__('Set Your Store ID', 'gwepay-payment-gateway'),
            ),
            'api_key' => array(
                'title'       => esc_html__('API Key', 'gwepay-payment-gateway'),
                'type'        => 'text',
                'description' => esc_html__('Enter your Gwepay API Key here.', 'gwepay-payment-gateway'),
                'default'     => '',
                'desc_tip'    => true,
                'placeholder' => esc_html__('Set Your API Key', 'gwepay-payment-gateway'),
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
            'storeLink' => get_home_url(),
            'createdAt' => date('Y-m-d H:i:s'),
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
    

    public function supports($feature) {
        $supports = parent::supports($feature);
        
        if ('woocommerce-blocks' === $feature) {
            return true;
        }
        
        return $supports;
    }


    // public function process_payment($order_id) {
    //     $order = wc_get_order($order_id);
        
    //     $this->log("Processing payment for order ID: $order_id");
    
    //     // Step 1 & 2: Send order data to the microservice (Node.js backend)
    //     $order_saved = $this->send_order_to_microservice($order_id);
    
    //     if (!$order_saved) {
    //         $this->log("Failed to save order to microservice for order ID: $order_id");
    //         wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to save order.', 'error');
    //         return array('result' => 'failure');
    //     }
    
    //     $this->log("Order saved to microservice successfully for order ID: $order_id");
    
    //     // Step 3: Send a request to your backend to retrieve the sessionId for this order
    //     $order_data = array('orderId' => $order_id);
    //     $response = wp_remote_post('http://payment-service:5006/api/get-session-id', array(
    //         'method'    => 'POST',
    //         'headers'   => array('Content-Type' => 'application/json'),
    //         'body'      => json_encode($order_data),
    //     ));
    
    //     // Check if the request was successful and retrieve the sessionId
    //     if (is_wp_error($response)) {
    //         $this->log("Failed to retrieve session ID for order ID: $order_id");
    //         wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to retrieve session ID.', 'error');
    //         return array('result' => 'failure');
    //     }
    
    //     $body = json_decode(wp_remote_retrieve_body($response), true);
    
    //     if (isset($body['sessionId'])) {
    //         $session_id = $body['sessionId'];
    
    //         $this->log("Payment session ID retrieved: $session_id");
    
    //         // Step 4: Update order status and save session ID to order meta
    //         $order->update_status('pending', __('Awaiting cryptocurrency payment', 'gwepay-payment-gateway'));
    //         $order->update_meta_data('_gwepay_session_id', $session_id);
    //         $order->save();
    
    //         // Step 5: Empty the cart
    //         WC()->cart->empty_cart();
    
    //         // Step 6: Redirect the user to the payment session page with the sessionId
    //         // $redirect_url = "http://localhost:5173/payment-session/{$session_id}";
    //         $redirect_url = "http://localhost:5173/payment-session/{$session_id}";

    
    //         $this->log("Redirecting to payment page: $redirect_url for order ID: $order_id");
    
    //         // Return the redirect URL and success status
    //         return array(
    //             'result'   => 'success',
    //             'redirect' => $redirect_url,
    //             'is_new_tab' => true // Custom flag to indicate new tab opening
    //         );
            
    //     } else {
    //         $this->log("Failed to retrieve session ID from the backend for order ID: $order_id");
    //         wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to retrieve session ID.', 'error');
    //         return array('result' => 'failure');
    //     }
    // }
    
    public function process_payment($order_id) {
        ob_start(); // Start output buffering
        $order = wc_get_order($order_id);
        
        $this->log("Processing payment for order ID: $order_id");
    
        $order_saved = $this->send_order_to_microservice($order_id);
    
        if (!$order_saved) {
            $this->log("Failed to save order to microservice for order ID: $order_id");
            wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to save order.', 'error');
            ob_end_clean(); // Clean the buffer before returning
            return array('result' => 'failure');
        }
    
        $this->log("Order saved to microservice successfully for order ID: $order_id");
    
        $order_data = array('orderId' => $order_id);
        $response = wp_remote_post('http://payment-service:5006/api/get-session-id', array(
            'method'    => 'POST',
            'headers'   => array('Content-Type' => 'application/json'),
            'body'      => json_encode($order_data),
        ));
    
        if (is_wp_error($response)) {
            $this->log("Failed to retrieve session ID for order ID: $order_id");
            wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to retrieve session ID.', 'error');
            ob_end_clean(); // Clean the buffer before returning
            return array('result' => 'failure');
        }
    
        $body = json_decode(wp_remote_retrieve_body($response), true);
    
        if (isset($body['sessionId'])) {
            $session_id = $body['sessionId'];
    
            $this->log("Payment session ID retrieved: $session_id");
    
            $order->update_status('pending', __('Awaiting cryptocurrency payment', 'gwepay-payment-gateway'));
            $order->update_meta_data('_gwepay_session_id', $session_id);
            $order->save();
    
            WC()->cart->empty_cart();
    
            $redirect_url = "http://localhost:5173/payment-session/{$session_id}";
    
            $this->log("Redirecting to payment page: $redirect_url for order ID: $order_id");
            ob_end_clean(); // Clean the buffer before returning
            return array(
                'result'   => 'success',
                'redirect' => $redirect_url,
            );
            
        } else {
            $this->log("Failed to retrieve session ID from the backend for order ID: $order_id");
            wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' Unable to retrieve session ID.', 'error');
            ob_end_clean(); // Clean the buffer before returning
            return array('result' => 'failure');
        }
    }
    
    
    public function enqueue_scripts() {
        if (is_checkout() && !is_order_received_page()) {
            wp_enqueue_script('gwepay-checkout', plugins_url('js/gwepay-checkout.js', dirname(__FILE__)), array('jquery'), '1.0', true);
        }
    }


}
