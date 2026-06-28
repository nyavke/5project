FROM php:8.3-apache

# Системные библиотеки для расширений PHP, нужных Moodle
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev libjpeg-dev libfreetype6-dev \
        libicu-dev libxml2-dev libzip-dev libonig-dev \
        libcurl4-openssl-dev unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        gd intl mysqli pdo_mysql zip soap exif opcache \
    && rm -rf /var/lib/apt/lists/*

# Требования Moodle к PHP
RUN { \
        echo 'max_input_vars = 5000'; \
        echo 'memory_limit = 512M'; \
        echo 'upload_max_filesize = 256M'; \
        echo 'post_max_size = 256M'; \
        echo 'max_execution_time = 300'; \
    } > /usr/local/etc/php/conf.d/moodle.ini

RUN a2enmod rewrite
