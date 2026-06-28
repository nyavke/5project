<?php
// Тема Vanilla — дочерняя от Boost. Современный tech/SaaS вид, тёплая
// ванильная палитра, светлый/тёмный режим, русификация.

defined('MOODLE_INTERNAL') || die();

$plugin->version   = 2026062700;
$plugin->requires  = 2025092600;
$plugin->component = 'theme_vanilla';
$plugin->dependencies = [
    'theme_boost' => 2025092600,
];
