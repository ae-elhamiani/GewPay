<?php
namespace Gwepay\Gateway;

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

class Gwepay_Blocks_Support extends AbstractPaymentMethodType {
    protected $name = 'gwepay';

    public function __construct() {
        error_log("GwePay: Constructing Gwepay_Blocks_Support");
    }

    public function initialize() {
        error_log("GwePay: Initializing Gwepay_Blocks_Support");
        $this->settings = get_option('woocommerce_gwepay_settings', []);
        error_log("GwePay: Gwepay_Blocks_Support initialized with settings: " . print_r($this->settings, true));
    }

    public function is_active() {
        $is_active = !empty($this->settings['enabled']) && 'yes' === $this->settings['enabled'];
        error_log("GwePay: is_active called, result: " . ($is_active ? 'true' : 'false'));
        return $is_active;
    }

    public function get_payment_method_script_handles() {
        error_log("GwePay: get_payment_method_script_handles called");
        return ['gwepay-blocks-integration'];
    }

    public function get_payment_method_data() {
        error_log("GwePay: get_payment_method_data called");
        $data = [
            'title' => $this->settings['title'] ?? 'Gwepay',
            'description' => $this->settings['description'] ?? '',
            'supports' => ['products', 'refunds'],
        ];
        error_log("GwePay: Returning payment method data: " . print_r($data, true));
        return $data;
    }
}