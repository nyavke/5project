<?php
// Конфигурация темы Vanilla (дочерняя от Boost).

defined('MOODLE_INTERNAL') || die();

$THEME->name = 'vanilla';

$THEME->sheets = [];
$THEME->editor_sheets = [];

$THEME->parents = ['boost'];

$THEME->enable_dock = false;

$THEME->scss = function($theme) {
    return theme_vanilla_get_main_scss_content($theme);
};
$THEME->prescsscallback = 'theme_vanilla_get_pre_scss';
$THEME->extrascsscallback = 'theme_vanilla_get_extra_scss';

$THEME->usefallback = true;
$THEME->rendererfactory = 'theme_overridden_renderer_factory';

$THEME->requiredblocks = '';
$THEME->addblockposition = BLOCK_ADDBLOCK_POSITION_FLATNAV;

// Theme scripts.
$THEME->javascripts = ['vanilla-react'];

$THEME->haseditswitch = true;
