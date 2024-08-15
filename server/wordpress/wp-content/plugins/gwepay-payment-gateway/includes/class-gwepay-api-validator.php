<?php

if (!defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'interfaces/class-gwepay-validator-interface.php';


class Gwepay_API_Validator implements Gwepay_Validator_Interface {

    private $valid_api_key;

    public function __construct(string $valid_api_key) {
        $this->valid_api_key = $valid_api_key; // Use the value passed from the factory
    }

    public function validate(string $api_key): bool {
        $api_key = sanitize_text_field($api_key);
        return hash_equals($this->valid_api_key, $api_key);
    }
}



// <?php

// if (!defined('ABSPATH')) {
//     exit;
// }

// require_once plugin_dir_path(__FILE__) . 'interfaces/class-gwepay-validator-interface.php';

// class Gwepay_API_Validator implements Gwepay_Validator_Interface {

//     private $validation_endpoint;

//     public function __construct(string $validation_endpoint) {
//         $this->validation_endpoint = $validation_endpoint;
//     }

//     public function validate(string $api_key): bool {
//         $api_key = sanitize_text_field($api_key);

//         // Make the HTTP request to the backend for validation
//         $response = wp_remote_post($this->validation_endpoint, [
//             'body' => json_encode(['api_key' => $api_key]),
//             'headers' => ['Content-Type' => 'application/json'],
//             'timeout' => 15,
//         ]);

//         if (is_wp_error($response)) {
//             error_log('API Key validation request failed: ' . $response->get_error_message());
//             return false;
//         }

//         $body = wp_remote_retrieve_body($response);
//         $result = json_decode($body, true);

//         return isset($result['valid']) && $result['valid'] === true;
//     }
// }
