// Front page landing sections for Vanilla.
(function () {
    "use strict";

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (text) {
            node.textContent = text;
        }
        return node;
    }

    function card(title, text) {
        var item = el("article", "vanilla-feature");
        item.appendChild(el("h3", "", title));
        item.appendChild(el("p", "", text));
        return item;
    }

    function step(num, title, text) {
        var item = el("article", "vanilla-step");
        item.appendChild(el("span", "vanilla-step-number", num));
        item.appendChild(el("h3", "", title));
        item.appendChild(el("p", "", text));
        return item;
    }

    function makeCourseCardsClickable() {
        document.querySelectorAll("#frontpage-available-course-list .coursebox").forEach(function (course) {
            var link = course.querySelector(".coursename a, .info a, a[href*='/course/view.php']");
            if (!link || course.dataset.vanillaClickable === "true") {
                return;
            }

            course.dataset.vanillaClickable = "true";
            if (course.querySelector(".courseimage")) {
                course.classList.add("has-courseimage");
            }
            course.setAttribute("role", "link");
            course.setAttribute("tabindex", "0");

            course.addEventListener("click", function (event) {
                if (event.target.closest("a, button, input, select, textarea, label, [role='button']")) {
                    return;
                }
                link.click();
            });

            course.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    link.click();
                }
            });
        });
    }

    function normalizeCourseCards() {
        document.querySelectorAll("#frontpage-available-course-list .coursebox").forEach(function (course) {
            var content = course.querySelector(".content > .d-flex");
            if (!content) {
                return;
            }

            var image = content.querySelector(".courseimage");
            var textWrap = content.querySelector(".flex-grow-1");
            if (!image) {
                image = el("div", "courseimage courseimage-placeholder");
                image.appendChild(el("span", "", "Заглушка проекта"));
                content.insertBefore(image, textWrap || content.firstChild);
            }

            if (!textWrap) {
                textWrap = el("div", "flex-grow-1");
                content.appendChild(textWrap);
            }

            if (!textWrap.querySelector(".summary")) {
                var summary = el("div", "summary");
                summary.appendChild(el("p", "", "Описание проекта появится здесь."));
                textWrap.appendChild(summary);
            }

            course.classList.add("has-courseimage");
        });
    }

    function init() {
        var body = document.body;
        var courses = document.getElementById("frontpage-available-course-list");
        if (!body || body.id !== "page-site-index" || !courses || document.querySelector(".vanilla-landing")) {
            return;
        }

        var landing = el("section", "vanilla-landing");

        var hero = el("section", "vanilla-hero");
        var copy = el("div", "vanilla-hero-copy");
        copy.appendChild(el("div", "vanilla-kicker", "Для школьных проектов 9 класса"));
        copy.appendChild(el("h1", "", "Собери проект, который уверенно защищаешь"));
        copy.appendChild(el("p", "", "Помогаем выбрать идею, собрать план, оформить исследование, сделать прототип и подготовить понятную защиту."));

        var actions = el("div", "vanilla-hero-actions");
        var primary = el("a", "btn btn-primary btn-lg", "Выбрать проект");
        primary.href = "#frontpage-available-course-list";
        primary.setAttribute("data-vanilla-scroll", "true");
        var secondary = el("a", "btn btn-secondary btn-lg", "Как это работает");
        secondary.href = "#vanilla-roadmap";
        secondary.setAttribute("data-vanilla-scroll", "true");
        actions.appendChild(primary);
        actions.appendChild(secondary);
        copy.appendChild(actions);

        var stats = el("div", "vanilla-stats");
        [["4", "направления"], ["6", "шагов до защиты"], ["1", "готовый результат"]].forEach(function (data) {
            var stat = el("div", "vanilla-stat");
            stat.appendChild(el("strong", "", data[0]));
            stat.appendChild(el("span", "", data[1]));
            stats.appendChild(stat);
        });
        copy.appendChild(stats);

        var visual = el("div", "vanilla-hero-visual");
        visual.setAttribute("aria-hidden", "true");
        visual.appendChild(el("span", "vanilla-orbit-dot"));
        visual.appendChild(el("span", "vanilla-orbit-dot"));
        visual.appendChild(el("span", "vanilla-orbit-dot"));
        hero.appendChild(copy);
        hero.appendChild(visual);
        landing.appendChild(hero);

        var features = el("section", "vanilla-features");
        features.appendChild(card("Идея без паники", "Подберём тему под твои интересы и реальные требования школы."));
        features.appendChild(card("План по неделям", "Разложим проект на понятные задачи, чтобы не делать всё в последний вечер."));
        features.appendChild(card("Защита и оформление", "Поможем с презентацией, текстом выступления и уверенными ответами."));
        landing.appendChild(features);

        var roadmap = el("section", "vanilla-roadmap");
        roadmap.id = "vanilla-roadmap";
        roadmap.appendChild(el("div", "vanilla-kicker", "Маршрут проекта"));
        roadmap.appendChild(el("h2", "", "От черновой идеи до финальной защиты"));
        var steps = el("div", "vanilla-steps");
        steps.appendChild(step("01", "Выбор темы", "Находим задачу, которую реально исследовать и показать."));
        steps.appendChild(step("02", "Прототип", "Собираем макет, код, исследование или визуальную часть."));
        steps.appendChild(step("03", "Защита", "Упаковываем результат в презентацию и короткое выступление."));
        roadmap.appendChild(steps);
        landing.appendChild(roadmap);

        courses.parentNode.insertBefore(landing, courses);

        document.querySelectorAll("[data-vanilla-scroll]").forEach(function (link) {
            link.addEventListener("click", function (event) {
                var target = document.querySelector(link.getAttribute("href"));
                if (!target) {
                    return;
                }
                event.preventDefault();
                var offset = 76;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: "smooth" });
            });
        });

        var revealItems = landing.querySelectorAll(".vanilla-feature, .vanilla-roadmap, .vanilla-step, .vanilla-stat");
        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
            revealItems.forEach(function (item) {
                item.classList.add("vanilla-reveal");
                observer.observe(item);
            });
        } else {
            revealItems.forEach(function (item) {
                item.classList.add("is-visible");
            });
        }

        normalizeCourseCards();
        makeCourseCardsClickable();
    }

    if (document.readyState !== "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
