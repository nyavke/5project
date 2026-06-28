-- MVP defaults applied after the restored Moodle dump.
-- MariaDB runs this only when the database volume is created from scratch.

UPDATE mdl_config SET value = 'vanilla' WHERE name = 'theme';
UPDATE mdl_config SET value = UNIX_TIMESTAMP() WHERE name IN ('themerev', 'jsrev', 'templaterev');
UPDATE mdl_config SET value = 'ru' WHERE name = 'lang';
UPDATE mdl_config SET value = 'Europe/Moscow' WHERE name = 'timezone';
UPDATE mdl_config SET value = 'Europe/Moscow' WHERE name = 'forcetimezone';
UPDATE mdl_config SET value = '0' WHERE name = 'forcelogin';
UPDATE mdl_config SET value = 'Все проекты|/course/' WHERE name = 'custommenuitems';

INSERT INTO mdl_config (name, value) VALUES
    ('defaulthomepage', '0'),
    ('theme_vanilla/brandcolor', '#d88739')
ON DUPLICATE KEY UPDATE value = VALUES(value);

UPDATE mdl_course
   SET fullname = '5project - школьные проекты для поступления',
       shortname = '5project'
 WHERE id = 1;

UPDATE mdl_course_categories
   SET name = 'Исследовательские проекты',
       description = '<p>Темы по обществу, науке, культуре, экологии, истории, спорту, медиа и другим направлениям, которые ученик выбирает сам.</p>',
       descriptionformat = 1
 WHERE id = 1;

UPDATE mdl_course_categories
   SET name = 'Инженерные и IT-проекты',
       description = '<p>Сайты, боты, приложения, базы данных, макеты, расчеты, схемы, сервисы и другие практические результаты.</p>',
       descriptionformat = 1
 WHERE id = 2;

UPDATE mdl_course_categories
   SET name = 'Искусственный интеллект',
       description = '<p>Безопасное использование ИИ для поиска идей, формулировки гипотез, проверки ограничений, прототипов и подготовки защиты.</p>',
       descriptionformat = 1
 WHERE id = 3;

UPDATE mdl_course
   SET category = 1,
       fullname = 'Исследование на выбранную тему',
       shortname = 'Исследование',
       summary = '<p>Ученик выбирает интересный вопрос, собирает источники и данные, сравнивает факты и готовит выводы для защиты. Итог: доклад, таблица, презентация и аргументированные выводы.</p>',
       summaryformat = 1
 WHERE id = 2;

UPDATE mdl_course
   SET category = 3,
       fullname = 'ИИ-помощник для школьного проекта',
       shortname = 'ИИ для проекта',
       summary = '<p>Сценарии промтов, проверка ограничений ИИ и безопасная помощь в формулировке темы, гипотезы, плана, анализа и выводов.</p>',
       summaryformat = 1
 WHERE id = 3;

UPDATE mdl_course
   SET category = 2,
       fullname = 'Прототип решения для своей идеи',
       shortname = 'Прототип',
       summary = '<p>Готовый маршрут на 3 недели для проекта с практическим результатом: сайт, бот, макет, расчет, схема, приложение или простой сервис.</p>',
       summaryformat = 1
 WHERE id = 4;

UPDATE mdl_course
   SET category = 2,
       fullname = 'База материалов проекта',
       shortname = 'Материалы проекта',
       summary = '<p>Шаблон базы, куда школьники заносят тему, источники, показатели, промежуточные результаты, выводы и файлы. Итог помогает собрать проект без хаоса.</p>',
       summaryformat = 1
 WHERE id = 5;

UPDATE mdl_course_categories
   SET coursecount = (SELECT COUNT(*) FROM mdl_course WHERE category = mdl_course_categories.id AND visible = 1)
 WHERE id IN (1, 2, 3);

UPDATE mdl_task_scheduled
   SET disabled = 1,
       nextruntime = 0
 WHERE classname IN (
       '\\core\\task\\h5p_get_content_types_task',
       '\\core\\task\\check_for_updates_task',
       '\\core\\task\\registration_cron_task',
       '\\tool_langimport\\task\\update_langpacks_task'
 );

DELETE FROM mdl_task_adhoc;
