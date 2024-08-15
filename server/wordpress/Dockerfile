# Use the official WordPress image as a base image
FROM wordpress:latest


# Copy any custom plugins or themes into the WordPress container (optional)
# If you have custom plugins, copy them into the plugins directory
COPY ./wp-content/plugins/ /var/www/html/wp-content/plugins/

# If you have custom themes, copy them into the themes directory
COPY ./wp-content/themes/ /var/www/html/wp-content/themes/

# Copy any custom configurations (optional)
# COPY ./wp-config.php /var/www/html/wp-config.php

# Expose port 80 to access the WordPress site
EXPOSE 80

# The command to run WordPress
CMD ["apache2-foreground"]
