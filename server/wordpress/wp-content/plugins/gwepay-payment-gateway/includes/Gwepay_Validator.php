<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Gwepay_Validator {
    private $validation_url = 'http://api-gateway:4000/api/store/validate-api-key'; // Adjust this URL as needed

    public function validate_credentials($api_key, $store_id) {
        $response = wp_remote_post($this->validation_url, array(
            'body' => json_encode(array(
                'storeId' => $store_id,
                'apiKey' => $api_key,
            )),
            'headers' => array('Content-Type' => 'application/json'),
            'timeout' => 30,
        ));
    
        if (is_wp_error($response)) {
            error_log("Validation error: " . $response->get_error_message());
            return false;
        }
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        // Log the result for debugging
        error_log("Validation response: " . print_r($result, true));
    
        return isset($result['isValid']) && $result['isValid'];
    }
    

    private function log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("Gwepay Validator: $message");
        }
    }
}