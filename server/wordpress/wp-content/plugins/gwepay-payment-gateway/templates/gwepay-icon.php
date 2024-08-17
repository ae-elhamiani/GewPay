<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly

// CSS for the icon
echo '<style>
    .gwepay-icon {
        width: 260px;
        height: auto;
        margin-left: 10px; /* Adjust as needed */
        vertical-align: middle; /* Align with text */
    }
</style>';

// HTML for the icon
echo '<img src="' . esc_url(plugin_dir_url(dirname(__FILE__)) . 'assets/images/gwepay_black.png') . '" class="gwepay-icon" alt="Gwepay">';
