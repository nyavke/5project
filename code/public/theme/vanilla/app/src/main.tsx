import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Compass,
  Database,
  Download,
  FileText,
  GraduationCap,
  Layers3,
  Map,
  Presentation,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import styles from "./styles.css";

type Category = {
  id: string;
  title: string;
  href: string;
  description: string;
  accent: "orange" | "green" | "red";
};

type Project = {
  id: string;
  title: string;
  href: string;
  category: string;
  summary: string;
  level: string;
  duration: string;
  result: string;
  image: string | undefined;
};

type Resource = {
  title: string;
  text: string;
  href: string;
  format: string;
};

type BootData = {
  page: "home" | "catalog";
  categories: Category[];
  projects: Project[];
};

const categoryCopy: Record<string, Pick<Category, "description" | "accent">> = {
  "Исследовательские проекты": {
    description: "Темы по обществу, науке, культуре, экологии, истории, спорту и медиа.",
    accent: "green",
  },
  "Инженерные и IT-проекты": {
    description: "Сайты, боты, приложения, базы данных, макеты, расчеты и прототипы.",
    accent: "orange",
  },
  "Городская среда и экология": {
    description: "Одна из возможных тем: среда, транспорт, зелень, воздух, вода и повседневная жизнь.",
    accent: "green",
  },
  "Программирование и базы данных": {
    description: "Сайты, боты, приложения, базы данных, макеты, расчеты и прототипы.",
    accent: "orange",
  },
  "Искусственный интеллект": {
    description: "Помощь ИИ для выбора темы, гипотез, источников, прототипов и защиты.",
    accent: "red",
  },
};

const fallbackCategories: Category[] = [
  {
    id: "research",
    title: "Исследовательские проекты",
    href: "/course/index.php?categoryid=1",
    description: categoryCopy["Исследовательские проекты"].description,
    accent: "green",
  },
  {
    id: "engineering-it",
    title: "Инженерные и IT-проекты",
    href: "/course/index.php?categoryid=2",
    description: categoryCopy["Инженерные и IT-проекты"].description,
    accent: "orange",
  },
  {
    id: "ai",
    title: "Искусственный интеллект",
    href: "/course/index.php?categoryid=3",
    description: categoryCopy["Искусственный интеллект"].description,
    accent: "red",
  },
];

const fallbackProjects: Project[] = [
  {
    id: "research-1",
    title: "Исследование на выбранную тему",
    href: "/course/view.php?id=2",
    category: "Исследовательские проекты",
    summary: "Ученик выбирает интересный вопрос, собирает источники и данные, сравнивает факты и готовит выводы для защиты.",
    level: "9-11 класс",
    duration: "2-4 недели",
    result: "доклад и выводы",
    image: undefined,
  },
  {
    id: "engineering-1",
    title: "Прототип решения для своей идеи",
    href: "/course/view.php?id=4",
    category: "Инженерные и IT-проекты",
    summary: "Маршрут для проекта с практическим результатом: сайт, бот, макет, расчет, схема, приложение или простой сервис.",
    level: "9-11 класс",
    duration: "3 недели",
    result: "прототип и защита",
    image: undefined,
  },
  {
    id: "code-2",
    title: "База материалов проекта",
    href: "/course/view.php?id=5",
    category: "Инженерные и IT-проекты",
    summary: "Шаблон базы, куда школьники заносят тему, источники, показатели, промежуточные результаты, выводы и файлы.",
    level: "8-11 класс",
    duration: "2 недели",
    result: "структура проекта",
    image: undefined,
  },
  {
    id: "ai-1",
    title: "ИИ-помощник для школьного проекта",
    href: "/course/view.php?id=3",
    category: "Искусственный интеллект",
    summary: "Сценарии промтов, проверка ограничений ИИ и безопасная помощь в формулировке гипотезы, плана и выводов.",
    level: "9-11 класс",
    duration: "2 недели",
    result: "прототип и регламент",
    image: undefined,
  },
];

const resources: Resource[] = [
  {
    title: "Стандарт структуры проекта",
    text: "Универсальная заготовка: введение, цель, гипотеза, сбор данных, анализ, выводы и защита.",
    href: "/theme/vanilla/resources/project-standard-template.docx",
    format: "DOCX",
  },
  {
    title: "Пример заполненного проекта",
    text: "Файл для ученика с инструкциями, таблицами и местом для адаптации под свою тему.",
    href: "/theme/vanilla/resources/urban-heat-student-project.docx",
    format: "DOCX",
  },
  {
    title: "Шаблон презентации защиты",
    text: "Слайды для защиты: проблема, данные, метод, карта, выводы, ограничения и следующий шаг.",
    href: "/theme/vanilla/resources/urban-heat-presentation-template.pptx",
    format: "PPTX",
  },
  {
    title: "Методичка, чек-лист и план защиты",
    text: "Материалы для учителя и самопроверки ученика перед финальной защитой проекта.",
    href: "/theme/vanilla/resources/urban-heat-support-pack.zip",
    format: "ZIP",
  },
];

function injectStyles() {
  if (document.getElementById("vanilla-react-styles")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "vanilla-react-styles";
  style.textContent = styles;
  document.head.appendChild(style);
}

function text(selector: string, root: ParentNode = document): string {
  return root.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function normalizeId(value: string): string {
  return value.toLowerCase().replace(/[^a-zа-я0-9]+/giu, "-").replace(/^-|-$/g, "");
}

function categoryMeta(title: string, index: number): Pick<Category, "description" | "accent"> {
  return categoryCopy[title] ?? {
    description: "Подборка проектов с понятными шагами, материалами и итоговой защитой.",
    accent: index % 3 === 0 ? "green" : index % 3 === 1 ? "orange" : "red",
  };
}

function extractCategories(): Category[] {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".course_category_tree .categoryname a"));
  const optionLinks = Array.from(document.querySelectorAll<HTMLOptionElement>(".urlselect option"));
  const raw = links.length
    ? links.map((link) => ({ title: link.textContent?.trim() ?? "", href: link.href }))
    : optionLinks.map((option) => ({ title: option.textContent?.trim() ?? "", href: option.value }));

  const categories = raw
    .filter((item) => item.title)
    .map((item, index) => {
      const meta = categoryMeta(item.title, index);
      return {
        id: normalizeId(item.title || String(index)),
        title: item.title,
        href: item.href || fallbackCategories[index]?.href || "/course/",
        description: meta.description,
        accent: meta.accent,
      };
    });

  return categories.length ? categories : fallbackCategories;
}

function extractProjects(categories: Category[]): Project[] {
  const boxes = Array.from(document.querySelectorAll<HTMLElement>(".coursebox"));
  const projects = boxes
    .map((box, index) => {
      const link = box.querySelector<HTMLAnchorElement>(".coursename a, .info a, a[href*='/course/view.php']");
      const title = link?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      if (!title) {
        return null;
      }

      const image = box.querySelector<HTMLImageElement>(".courseimage img")?.src;
      const summary = text(".summary", box) || "Пошаговая работа над проектом: идея, материал, результат и защита.";
      const category = text(".coursecat", box) || categories[index % categories.length]?.title || "Проект";
      return {
        id: normalizeId(`${title}-${index}`),
        title,
        href: link?.href ?? "/course/",
        category,
        summary,
        level: "9-11 класс",
        duration: "2-4 недели",
        result: "готовый проект",
        image,
      };
    })
    .filter((project): project is Project => Boolean(project));

  return projects.length ? projects : fallbackProjects;
}

function isTopLevelCourseCatalog(): boolean {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(window.location.search);
  const isCourseIndex = path === "/course" || path === "/course/index.php";

  return isCourseIndex && !params.has("categoryid") && !params.has("search");
}

function boot(): BootData | null {
  const body = document.body;
  if (!body) {
    return null;
  }

  const isHome = body.id === "page-site-index";
  const isCatalog = isTopLevelCourseCatalog();
  if (!isHome && !isCatalog) {
    return null;
  }

  const categories = extractCategories();
  const projects = extractProjects(categories);
  return {
    page: isHome ? "home" : "catalog",
    categories,
    projects,
  };
}

function mount(data: BootData) {
  injectStyles();
  document.body.classList.add("vanilla-react-page", `vanilla-react-${data.page}`);

  const main = document.querySelector<HTMLElement>('[role="main"]');
  if (!main) {
    return;
  }

  const root = document.createElement("div");
  root.id = "vanilla-react-root";
  main.prepend(root);
  Array.from(main.children).forEach((child) => {
    if (child !== root) {
      child.classList.add("vanilla-source-hidden");
    }
  });

  createRoot(root).render(<App data={data} />);
}

function App({ data }: { data: BootData }) {
  return data.page === "home" ? <Home data={data} /> : <Catalog data={data} />;
}

function Home({ data }: { data: BootData }) {
  return (
    <main className="vr-shell">
      <section className="vr-hero">
        <div className="vr-hero-copy">
          <span className="vr-eyebrow"><Sparkles size={15} /> Проекты для школьников</span>
          <h1>Создай свой проект на любую тему</h1>
          <p>
            Платформа помогает собрать исследовательский или инженерный проект:
            выбрать идею, составить план, найти источники, оформить результат и подготовить защиту.
          </p>
          <div className="vr-actions">
            <a className="vr-button vr-button-primary" href="/course/">
              Начать проект <ArrowRight size={18} />
            </a>
            <a className="vr-button vr-button-secondary" href="#vr-roadmap">
              Как это работает
            </a>
          </div>
          <Stats categories={data.categories} />
        </div>
        <HeroPreview />
      </section>

      <ValueStrip />

      <section className="vr-section vr-grid-3">
        <InfoCard icon={<Map />} title="Свободная тема" text="Ученик может взять исследование, инженерную задачу, IT-идею, социальный проект или творческую работу." />
        <InfoCard icon={<Layers3 />} title="Конструктор на 2-4 недели" text="Маршрут разбит на короткие шаги: теория, данные, обработка, анализ, оформление и защита." />
        <InfoCard icon={<Database />} title="Понятный результат" text="В конце остается конкретный артефакт: доклад, прототип, таблица, презентация, макет или сервис." />
      </section>

      <Roadmap />
      <ProjectShowcase categories={data.categories} projects={data.projects} />
      <ResourceShelf />
    </main>
  );
}

function Catalog({ data }: { data: BootData }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.projects.filter((project) => {
      const categoryMatches = active === "all" || project.category === active || project.category.includes(active);
      const queryMatches = !normalized || `${project.title} ${project.summary} ${project.category}`.toLowerCase().includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [active, data.projects, query]);

  return (
    <main className="vr-shell vr-catalog">
      <section className="vr-catalog-hero">
        <div>
          <span className="vr-eyebrow"><BookOpen size={15} /> Каталог проектов</span>
          <h1>Выбери тему проекта</h1>
          <p>Каждый маршрут ведет к школьной защите: идея, источники, понятная методика, результат и выводы.</p>
        </div>
        <div className="vr-catalog-panel">
          <label className="vr-search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по проектам" />
          </label>
          <div className="vr-filter-row" aria-label="Фильтр направлений">
            <button className={active === "all" ? "is-active" : ""} onClick={() => setActive("all")} type="button">
              Все
            </button>
            {data.categories.map((category) => (
              <button
                key={category.id}
                className={active === category.title ? "is-active" : ""}
                onClick={() => setActive(category.title)}
                type="button"
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="vr-catalog-layout">
        <aside className="vr-category-stack" aria-label="Направления">
          {data.categories.map((category) => (
            <CategoryCard key={category.id} category={category} compact />
          ))}
        </aside>
        <section className="vr-project-results">
          <div className="vr-results-head">
            <div>
              <span>{filteredProjects.length} проекта</span>
              <h2>{active === "all" ? "Готовые проекты" : active}</h2>
            </div>
            <a href="/" className="vr-text-link">На главную</a>
          </div>
          <div className="vr-project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Stats({ categories }: { categories: Category[] }) {
  return (
    <div className="vr-stats">
      <div><strong>{categories.length}</strong><span>направления проектов</span></div>
      <div><strong>5+1</strong><span>баллы за проекты</span></div>
      <div><strong>2-4</strong><span>недели до защиты</span></div>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="vr-preview" aria-hidden="true">
      <div className="vr-preview-card vr-preview-main">
        <span>Маршрут проекта</span>
        <strong>Идея → данные → решение → защита</strong>
        <div className="vr-progress"><i /></div>
      </div>
      <div className="vr-preview-card vr-preview-side">
        <span>Результат</span>
        <strong>Защита + база для вуза</strong>
        <CheckCircle2 size={30} />
      </div>
      <div className="vr-node vr-node-a" />
      <div className="vr-node vr-node-b" />
    </div>
  );
}

function ValueStrip() {
  return (
    <section className="vr-value-strip" aria-label="Ценность платформы">
      <div>
        <Trophy />
        <strong>5 баллов за первый проект</strong>
        <span>и +1 за каждый следующий, максимум 10 суммарно</span>
      </div>
      <div>
        <Target />
        <strong>Без копипаста</strong>
        <span>каждый ученик выбирает свою тему, источники и выводы</span>
      </div>
      <div>
        <GraduationCap />
        <strong>Путь к специальности</strong>
        <span>школьник пробует инженерную задачу до поступления</span>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="vr-info-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Roadmap() {
  const steps = [
    ["01", "Выбор темы", "Ученик выбирает любую понятную ему тему и формулирует вопрос, проблему или идею проекта."],
    ["02", "Гипотеза", "Определяет, что именно будет проверять, объяснять, создавать или улучшать."],
    ["03", "Источники", "Собирает статьи, данные, опросы, наблюдения, фотографии, расчеты или материалы для прототипа."],
    ["04", "Результат", "Заполняет таблицы, строит схему, макет, расчет, презентацию или простой прототип без лишней сложности."],
    ["05", "Анализ", "Сравнивает результат с гипотезой и фиксирует ограничения метода."],
    ["06", "Защита", "Собирает презентацию, выводы и короткое выступление по готовому шаблону."],
  ];
  return (
    <section className="vr-roadmap" id="vr-roadmap">
      <span className="vr-eyebrow">Маршрут проекта</span>
      <h2>Один понятный маршрут для всех проектов</h2>
      <div className="vr-roadmap-grid">
        {steps.map(([num, title, text]) => (
          <article key={num}>
            <strong>{num}</strong>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectShowcase({ categories, projects }: { categories: Category[]; projects: Project[] }) {
  return (
    <section className="vr-section">
      <div className="vr-section-head">
        <div>
          <span className="vr-eyebrow">Направления</span>
          <h2>Система, а не набор разрозненных курсов</h2>
        </div>
        <a className="vr-button vr-button-secondary" href="/course/">Открыть каталог</a>
      </div>
      <div className="vr-category-grid">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      <div className="vr-project-grid vr-project-grid-home">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, compact = false }: { category: Category; compact?: boolean }) {
  const icon = category.title.includes("интеллект") ? <Brain /> : category.title.includes("Программ") ? <Code2 /> : <Compass />;
  return (
    <a className={`vr-category-card vr-accent-${category.accent} ${compact ? "is-compact" : ""}`} href={category.href}>
      <span className="vr-category-icon">{icon}</span>
      <h3>{category.title}</h3>
      <p>{category.description}</p>
      <strong>Открыть направление <ArrowRight size={16} /></strong>
    </a>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="vr-project-card" href={project.href}>
      <div className="vr-project-image">
        {project.image ? <img src={project.image} alt="" /> : <span>{project.category.slice(0, 2)}</span>}
      </div>
      <div>
        <span className="vr-project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <dl className="vr-project-meta">
          <div><dt>Класс</dt><dd>{project.level}</dd></div>
          <div><dt>Срок</dt><dd>{project.duration}</dd></div>
          <div><dt>Итог</dt><dd>{project.result}</dd></div>
        </dl>
      </div>
      <strong>Перейти к проекту <ArrowRight size={16} /></strong>
    </a>
  );
}

function ResourceShelf() {
  return (
    <section className="vr-section vr-resources">
      <div className="vr-section-head">
        <div>
          <span className="vr-eyebrow"><FileText size={15} /> Материалы</span>
          <h2>Файлы для запуска проекта уже готовы</h2>
        </div>
      </div>
      <div className="vr-resource-grid">
        {resources.map((resource) => (
          <a className="vr-resource-card" href={resource.href} key={resource.href} download>
            <span>{resource.format}</span>
            <h3>{resource.title}</h3>
            <p>{resource.text}</p>
            <strong>Скачать <Download size={16} /></strong>
          </a>
        ))}
      </div>
    </section>
  );
}

const data = boot();
if (data) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(data));
  } else {
    mount(data);
  }
}
