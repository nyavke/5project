import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import pptxgen from "pptxgenjs";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../../resources");

const standardMarkdown = `# Универсальный стандарт проекта 5project

## 1. Введение
Опишите территорию исследования: город, район, регион, школу или знакомую ученику местность.

## 2. Цель и гипотеза
Цель: что ученик хочет узнать или доказать.
Гипотеза: ожидаемая связь между объектом исследования и данными ДЗЗ.

## 3. План работы
1. Выбрать территорию.
2. Найти открытые данные.
3. Подготовить таблицу наблюдений.
4. Построить карту, график или прототип.
5. Сравнить результат с гипотезой.
6. Подготовить защиту.

## 4. Сбор и обработка данных
Используйте открытые источники: Landsat, Sentinel, Google Earth Engine, Copernicus Browser, QGIS, открытые карты города.

## 5. Анализ
Сравните территорию, периоды, показатели и ограничения метода.

## 6. Выводы
Сформулируйте 3-5 конкретных выводов и объясните, как результат можно использовать.

## 7. Презентация
8-10 слайдов: проблема, территория, гипотеза, данные, метод, карта/график, выводы, ограничения, следующий шаг.
`;

const teacherGuide = `# Методические рекомендации для учителя

Проект: Оценка влияния городской застройки на температуру поверхности.

## Для кого
Ученики 9-11 класса без специальных знаний по ДЗЗ.

## Образовательные цели по таксономии Блума
- Запомнить: назвать источники открытых спутниковых данных.
- Понять: объяснить, почему застройка и материалы поверхности влияют на температуру.
- Применить: выбрать снимок Landsat/Sentinel и подготовить таблицу наблюдений.
- Проанализировать: сравнить температуру поверхности в разных типах городской среды.
- Оценить: указать ограничения данных и достоверность выводов.
- Создать: подготовить карту, выводы и презентацию для защиты.

## Организация
Рекомендуемый срок: 3 недели.
Формат: индивидуально или пары.
Итог: карта температуры поверхности района, таблица наблюдений, презентация и устная защита.

## Критерии оценивания
1. Есть локальная территория исследования.
2. Указаны источники данных.
3. Таблица заполнена аккуратно.
4. Карта/визуализация читается без пояснений.
5. Выводы связаны с гипотезой.
6. Ученик понимает ограничения метода.
`;

const checklist = `# Чек-лист самопроверки ученика

- [ ] Я выбрал свой город, район или регион.
- [ ] Я сформулировал цель и гипотезу.
- [ ] Я указал источник открытых данных.
- [ ] Я заполнил таблицу наблюдений.
- [ ] Я сделал карту, график или другую визуализацию.
- [ ] Я сравнил минимум 2-3 типа территории.
- [ ] Я написал выводы своими словами.
- [ ] Я указал ограничения: облачность, дата снимка, точность данных.
- [ ] Я подготовил презентацию на 8-10 слайдов.
- [ ] Я могу объяснить проект за 3-5 минут.
`;

const defensePlan = `# Примерный план защиты

1. Тема и территория исследования.
2. Почему эта проблема важна для моего района.
3. Цель и гипотеза.
4. Какие данные я использовал.
5. Как я обработал данные.
6. Что показала карта температуры поверхности.
7. Какие выводы подтвердили или опровергли гипотезу.
8. Ограничения исследования.
9. Как можно продолжить проект.
10. Ответы на вопросы.
`;

function run(text, options = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: options.size ?? 24,
    bold: options.bold ?? false,
    color: options.color ?? "17211D",
  });
}

function paragraph(text, options = {}) {
  return new Paragraph({
    heading: options.heading,
    bullet: options.bullet ? { level: 0 } : undefined,
    spacing: { after: options.after ?? 160 },
    children: [run(text, options)],
  });
}

function docFromSections(title, sections) {
  const children = [
    paragraph(title, { heading: HeadingLevel.TITLE, size: 38, bold: true, after: 260 }),
  ];

  for (const section of sections) {
    children.push(paragraph(section.title, { heading: HeadingLevel.HEADING_1, size: 28, bold: true, after: 120 }));
    for (const item of section.items) {
      children.push(paragraph(item, { bullet: section.bullets, after: 120 }));
    }
  }

  return new Document({
    creator: "5project",
    title,
    description: "Материал MVP платформы 5project",
    sections: [{ properties: {}, children }],
  });
}

async function writeDocx(fileName, doc) {
  const buffer = await Packer.toBuffer(doc);
  await writeFile(resolve(outDir, fileName), buffer);
}

async function writeText(fileName, content) {
  await writeFile(resolve(outDir, fileName), content.trimStart(), "utf8");
}

async function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "5project";
  pptx.subject = "Шаблон защиты проекта по ДЗЗ";
  pptx.title = "Оценка влияния городской застройки на температуру поверхности";
  pptx.company = "5project";
  pptx.lang = "ru-RU";
  pptx.theme = {
    headFontFace: "Arial",
    bodyFontFace: "Arial",
    lang: "ru-RU",
  };

  const slides = [
    ["Тема проекта", "Оценка влияния городской застройки на температуру поверхности", "Мой район / город / регион"],
    ["Проблема", "Городские материалы нагреваются по-разному", "Почему в одних местах жарче, чем в других?"],
    ["Цель и гипотеза", "Цель: сравнить температуру поверхности разных зон", "Гипотеза: плотная застройка теплее парков и водных зон"],
    ["Данные", "Landsat / Sentinel / Copernicus Browser", "Дата снимка, облачность, территория исследования"],
    ["Метод", "Выбор точек, таблица наблюдений, карта", "Сравниваем жилые кварталы, дороги, парки, воду"],
    ["Карта результата", "Вставьте тепловую карту или скриншот", "Подпишите самые теплые и прохладные зоны"],
    ["Анализ", "Что подтвердилось, что оказалось неожиданным", "Свяжите результат с застройкой и типом поверхности"],
    ["Ограничения", "Дата снимка, погода, облачность, разрешение данных", "Почему это важно для честных выводов"],
    ["Выводы", "3-5 коротких выводов", "Что можно улучшить в районе или исследовании"],
    ["Вопросы", "Спасибо за внимание", "Контакт / класс / школа"],
  ];

  for (const [title, body, note] of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: "F3F7F4" };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.18, fill: { color: "287F74" }, line: { color: "287F74" } });
    slide.addText(title, { x: 0.55, y: 0.55, w: 11.9, h: 0.55, fontFace: "Arial", fontSize: 17, bold: true, color: "DF7C2C", margin: 0 });
    slide.addText(body, { x: 0.55, y: 1.35, w: 8.7, h: 1.9, fontFace: "Arial", fontSize: 34, bold: true, color: "17211D", breakLine: false, fit: "shrink" });
    slide.addText(note, { x: 0.6, y: 4.95, w: 8.8, h: 0.7, fontFace: "Arial", fontSize: 18, color: "60706A", fit: "shrink" });
    slide.addShape(pptx.ShapeType.rect, { x: 9.85, y: 1.15, w: 2.85, h: 3.65, rectRadius: 0.1, fill: { color: "FFFFFF", transparency: 6 }, line: { color: "D9E3DE" } });
    slide.addText("Место для карты / графика", { x: 10.15, y: 2.55, w: 2.25, h: 0.6, fontFace: "Arial", fontSize: 16, bold: true, color: "287F74", align: "center", fit: "shrink" });
  }

  await pptx.writeFile({ fileName: resolve(outDir, "urban-heat-presentation-template.pptx") });
}

async function buildSupportZip() {
  const zip = new JSZip();
  zip.file("teacher-guide.md", teacherGuide.trimStart());
  zip.file("student-checklist.md", checklist.trimStart());
  zip.file("defense-plan.md", defensePlan.trimStart());
  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await writeFile(resolve(outDir, "urban-heat-support-pack.zip"), buffer);
}

await mkdir(outDir, { recursive: true });

await writeText("project-standard-template.md", standardMarkdown);
await writeText("urban-heat-teacher-guide.md", teacherGuide);
await writeText("urban-heat-checklist.md", checklist);
await writeText("urban-heat-defense-plan.md", defensePlan);

await writeDocx(
  "project-standard-template.docx",
  docFromSections("Универсальный стандарт проекта 5project", [
    { title: "Введение", items: ["Опишите территорию исследования: город, район, регион, школу или знакомую ученику местность."] },
    { title: "Цель и гипотеза", items: ["Цель отвечает на вопрос, что нужно узнать.", "Гипотеза фиксирует ожидаемую связь между территорией и данными ДЗЗ."], bullets: true },
    { title: "План работы", items: ["Выбрать территорию.", "Найти открытые данные.", "Подготовить таблицу наблюдений.", "Построить карту, график или прототип.", "Сравнить результат с гипотезой.", "Подготовить защиту."], bullets: true },
    { title: "Сбор и обработка данных", items: ["Используйте открытые источники: Landsat, Sentinel, Google Earth Engine, Copernicus Browser, QGIS, открытые карты города."] },
    { title: "Анализ", items: ["Сравните территорию, периоды, показатели и ограничения метода."] },
    { title: "Выводы и защита", items: ["Сформулируйте 3-5 выводов и подготовьте презентацию на 8-10 слайдов."] },
  ]),
);

await writeDocx(
  "urban-heat-student-project.docx",
  docFromSections("Оценка влияния городской застройки на температуру поверхности", [
    { title: "Описание проекта", items: ["Ты исследуешь свой район по открытым спутниковым данным и проверяешь, какие типы городской поверхности нагреваются сильнее."] },
    { title: "Образовательные цели", items: ["Назвать источники открытых спутниковых данных.", "Объяснить связь застройки и температуры поверхности.", "Построить карту или таблицу наблюдений.", "Сделать выводы и защитить проект."], bullets: true },
    { title: "Пошаговый план", items: ["Выбери район исследования.", "Сформулируй гипотезу.", "Найди снимок Landsat или Sentinel.", "Заполни таблицу точек наблюдений.", "Сравни жилые кварталы, дороги, парки и водные зоны.", "Собери презентацию и подготовь защиту."], bullets: true },
    { title: "Таблица для заполнения", items: ["Точка | Тип территории | Координаты | Температура/показатель | Наблюдение | Вывод"] },
    { title: "Источники данных", items: ["Landsat, Sentinel, Copernicus Browser, Google Earth Engine, QGIS, открытые карты города."], bullets: true },
    { title: "Финальный результат", items: ["Карта или график, таблица наблюдений, 3-5 выводов, презентация и план защиты."] },
  ]),
);

await buildPresentation();
await buildSupportZip();

console.log(`MVP materials generated in ${outDir}`);
