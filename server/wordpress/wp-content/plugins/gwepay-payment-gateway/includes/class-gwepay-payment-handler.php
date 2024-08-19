<?php
namespace Gwepay\Gateway;

use GuzzleHttp\Client;

class Gwepay_Payment_Handler {
    private $api_url;
    private $api_key;
    private $store_id;

    public function __construct($api_key, $store_id) {

        $this->api_key = $api_key;
        $this->store_id = $store_id;
    }

    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        $payment_data = $this->create_gwepay_payment($order);

        if ($payment_data && isset($payment_data['paymentUrl'])) {
            $order->update_status('pending', __('Awaiting GwePay payment', 'gwepay-payment-gateway'));
            WC()->cart->empty_cart();

            return array(
                'result'   => 'success',
                'redirect' => $payment_data['paymentUrl']
            );
        } else {
            wc_add_notice(__('Payment error:', 'gwepay-payment-gateway') . ' ' . __('Unable to process payment.', 'gwepay-payment-gateway'), 'error');
            return array(
                'result' => 'failure'
            );
        }
    }

    private function create_gwepay_payment($order) {
        $client = new Client();

        $query = '
        mutation createPaymentOrder($merchantId: String!, $storeId: String!, $orderId: String!, $amount: Float!, $currency: String!) {
            createPaymentOrder(merchantId: $merchantId, storeId: $storeId, orderId: $orderId, amount: $amount, currency: $currency) {
                id
                paymentUrl
            }
        }
        ';

        $variables = [
            'merchantId' => $this->api_key,
            'storeId' => $this->store_id,
            'orderId' => $order->get_id(),
            'amount' => (float) $order->get_total(),
            'currency' => $order->get_currency()
        ];

        try {
            $response = $client->post($this->api_url, [
                'json' => [
                    'query' => $query,
                    'variables' => $variables,
                ]
            ]);

            $result = json_decode($response->getBody(), true);

            if (isset($result['data']['createPaymentOrder'])) {
                return $result['data']['createPaymentOrder'];
            }
        } catch (\Exception $e) {
            error_log('GwePay API Error: ' . $e->getMessage());
        }

        return null;
    }
}