<?php

if (!defined('ABSPATH')) {
    exit;
}

interface Gwepay_Validator_Interface {
    public function validate(string $input): bool;
}
