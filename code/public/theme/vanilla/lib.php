<?php
// Колбэки SCSS темы Vanilla.

defined('MOODLE_INTERNAL') || die();

/**
 * Основной SCSS: переиспользуем основу Boost (дефолтный пресет: Bootstrap +
 * стили Moodle) и добавляем свои пост-стили поверх.
 *
 * @param theme_config $theme
 * @return string
 */
function theme_vanilla_get_main_scss_content($theme) {
    global $CFG;

    require_once($CFG->dirroot . '/theme/boost/lib.php');
    // У темы Vanilla нет своего пресета — Boost откатится на свой default.scss.
    $scss = theme_boost_get_main_scss_content($theme);

    // Наши пост-стили (карточки, шапка, тёмный режим и т.п.).
    $scss .= file_get_contents($CFG->dirroot . '/theme/vanilla/scss/post.scss');

    return $scss;
}

/**
 * SCSS, добавляемый ПЕРЕД основой — здесь переопределяем переменные Bootstrap
 * (палитра, шрифты, скругления), чтобы перекрасить всю тему.
 *
 * @param theme_config $theme
 * @return string
 */
function theme_vanilla_get_pre_scss($theme) {
    global $CFG;

    $scss = file_get_contents($CFG->dirroot . '/theme/vanilla/scss/pre.scss');

    // Бренд-цвет из настроек темы (если задан) перекрывает $primary.
    if (!empty($theme->settings->brandcolor)) {
        $scss .= '$primary: ' . $theme->settings->brandcolor . ";\n";
    }

    // Произвольный «сырой» SCSS из настроек.
    if (!empty($theme->settings->scsspre)) {
        $scss .= $theme->settings->scsspre;
    }

    return $scss;
}

/**
 * Дополнительный SCSS из настроек (raw SCSS).
 *
 * @param theme_config $theme
 * @return string
 */
function theme_vanilla_get_extra_scss($theme) {
    $content = '';
    if (!empty($theme->settings->scss)) {
        $content .= $theme->settings->scss;
    }
    return $content;
}
