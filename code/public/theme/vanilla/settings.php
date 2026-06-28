<?php
// Настройки темы Vanilla.

defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    $settings = new theme_boost_admin_settingspage_tabs(
        'themesettingvanilla', get_string('configtitle', 'theme_vanilla'));

    $page = new admin_settingpage('theme_vanilla_general',
        get_string('generalsettings', 'theme_vanilla'));

    // Бренд-цвет (акцент).
    $name = 'theme_vanilla/brandcolor';
    $title = get_string('brandcolor', 'theme_vanilla');
    $description = get_string('brandcolor_desc', 'theme_vanilla');
    $setting = new admin_setting_configcolourpicker($name, $title, $description, '#c97b3c');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Сырой предварительный SCSS.
    $name = 'theme_vanilla/scsspre';
    $title = get_string('rawscsspre', 'theme_vanilla');
    $description = get_string('rawscsspre_desc', 'theme_vanilla');
    $setting = new admin_setting_scsscode($name, $title, $description, '', PARAM_RAW);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    // Сырой SCSS (в конец).
    $name = 'theme_vanilla/scss';
    $title = get_string('rawscss', 'theme_vanilla');
    $description = get_string('rawscss_desc', 'theme_vanilla');
    $setting = new admin_setting_scsscode($name, $title, $description, '', PARAM_RAW);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $page->add($setting);

    $settings->add($page);
}
