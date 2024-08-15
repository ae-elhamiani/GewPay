<?php

if (!defined('ABSPATH')) {
    exit;
}
require_once plugin_dir_path(__FILE__) . 'interfaces/class-gwepay-validator-interface.php';


class Gwepay_Store_Validator implements Gwepay_Validator_Interface {

    private $valid_store_id;

    public function __construct(string $valid_store_id) {
        $this->valid_store_id = $valid_store_id; // Use the value passed from the factory
    }

    public function validate(string $store_id): bool {
        $store_id = sanitize_text_field($store_id);
        return hash_equals($this->valid_store_id, $store_id);
    }
}



// <?php

// if (!defined('ABSPATH')) {
//     exit;
// }

// require_once plugin_dir_path(__FILE__) . 'interfaces/class-gwepay-validator-interface.php';

// class Gwepay_Store_Validator implements Gwepay_Validator_Interface {

//     private $validation_endpoint;

//     public function __construct(string $validation_endpoint) {
//         $this->validation_endpoint = $validation_endpoint;
//     }

//     public function validate(string $store_id): bool {
//         $store_id = sanitize_text_field($store_id);

//         // Make the HTTP request to the backend for validation
//         $response = wp_remote_post($this->validation_endpoint, [
//             'body' => json_encode(['store_id' => $store_id]),
//             'headers' => ['Content-Type' => 'application/json'],
//             'timeout' => 15,
//         ]);

//         if (is_wp_error($response)) {
//             error_log('Store ID validation request failed: ' . $response->get_error_message());
//             return false;
//         }

//         $body = wp_remote_retrieve_body($response);
//         $result = json_decode($body, true);

//         return isset($result['valid']) && $result['valid'] === true;
//     }
// }
