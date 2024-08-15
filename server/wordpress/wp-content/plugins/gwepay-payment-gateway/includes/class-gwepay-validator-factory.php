<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('ABSPATH')) {
    exit;
}

class Gwepay_Validator_Factory {

    // Static variables for API Key and Store ID
    private static $valid_api_key = '3c5d4f7ce';
    private static $valid_store_id = '3c5d4f7ce';

    // Function to create API Validator
    public static function create_api_validator(): Gwepay_API_Validator {
        return new Gwepay_API_Validator(self::$valid_api_key);
    }

    // Function to create Store Validator
    public static function create_store_validator(): Gwepay_Store_Validator {
        return new Gwepay_Store_Validator(self::$valid_store_id);
    }

    // Optional: Functions to set these static values if needed dynamically
    public static function set_api_key(string $api_key) {
        self::$valid_api_key = $api_key;
    }

    public static function set_store_id(string $store_id) {
        self::$valid_store_id = $store_id;
    }
}



class Gwepay_Validator_Factory {

    public static function create_api_validator(): Gwepay_API_Validator {
        $validation_endpoint = 'https://your-backend-api.com/validate-api-key'; // Update with your backend URL
        return new Gwepay_API_Validator($validation_endpoint);
    }

    public static function create_store_validator(): Gwepay_Store_Validator {
        $validation_endpoint = 'https://your-backend-api.com/validate-store-id'; // Update with your backend URL
        return new Gwepay_Store_Validator($validation_endpoint);
    }
}
