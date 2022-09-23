/**
 * This helper function gets the config object
 */
const getConfig = async () => {
  // get the YML config file with fetch:
  const fetchResult = await fetch("./data/projects.yml");
  const text = await fetchResult.text();
  // Use js-yaml (included in script tag) to parse the YAML into a JSON object
  // https://github.com/nodeca/js-yaml#load-string---options-
  const config = jsyaml.load(text);
  return config;
};

const createElement = (tag, info) => {
  const element = document.createElement(tag);
  if (info) {
    Object.entries(info).forEach(([key, value]) => {
      element[key] = value;
    });
  }
  return element;
};

/**
 * This helper function creates a "featured" "card" DOM element
 * given an object of details that the card should contain:
 */
const createFeaturedCard = ({ title, image, url, description }) => {
  const rootElement = createElement("div", { className: "bg-[#efefef] w-full m-4 p-4" });

  if (image) {
    const imageWrapper = createElement("div", { className: "w-full md:w-1/3 float-left" });

    const img = createElement("img", {
      className: "w-full md:w-auto",
      src: `https://esri.github.io/${image}`,
    });

    imageWrapper.appendChild(img);
    rootElement.appendChild(imageWrapper);
  }

  if (title) {
    const contentWrapper = createElement("div", { className: "w-full md:w-2/3 float-left pl-4" });
    const titleElement = createElement("h4", { className: "text-xl mb-4 mt-4 md:mt-0" });
    const linkElement = createElement("calcite-link", { href: url, innerHTML: title });
    const descriptionElement = createElement("p", { className: "text-md", innerHTML: description });

    titleElement.appendChild(linkElement);
    contentWrapper.appendChild(titleElement);
    contentWrapper.appendChild(descriptionElement);
    rootElement.appendChild(contentWrapper);
  }

  return rootElement;
};

/**
 * This helper function creates a calcite "card" DOM element
 * given an object of details that the card should contain:
 */
const createCard = (cardInfo) => {
  const rootElement = createElement("calcite-card", { className: "box-border p-4 basis-1/2 md:basis-1/4 grow shrink" });

  if (cardInfo.title) {
    const titleElement = createElement("span", { slot: "title" });
    const link = createElement("calcite-link", {
      innerHTML: cardInfo.title,
      href: cardInfo.link,
      className: "text-xl",
    });

    titleElement.appendChild(link);
    rootElement.appendChild(titleElement);
  }
  if (cardInfo.content) {
    const contentElement = createElement("p", { innerHTML: cardInfo.content, className: "mb-2" });
    rootElement.appendChild(contentElement);

    if (cardInfo.link) {
      const p = createElement("p");
      const link = createElement("calcite-link", { href: cardInfo.link, innerHTML: "Learn More ➜" });

      p.appendChild(link);
      rootElement.appendChild(p);
    }
  }

  if (cardInfo.language) {
    const link = createElement("calcite-link", {
      slot: "footer-leading",
      href: `https://github.com/Esri?language=${cardInfo.language.toLowerCase()}`,
      innerHTML: cardInfo.language,
    });
    rootElement.appendChild(link);
  }

  if (cardInfo.stars) {
    const stars = createElement("div", { slot: "footer-trailing", innerHTML: "⭐" + cardInfo.stars });
    rootElement.appendChild(stars);
  }

  return rootElement;
};

/**
 * Creates a section with a title and 4 cards
 */
const getSection = (categoryConfig) => {
  const rootElement = document.createElement("div");

  // Create the title
  const title = createElement("h2", { className: "text-4xl mb-6", innerHTML: categoryConfig.title });
  rootElement.appendChild(title);

  // The first item in the array is the "featured" project, so show that first.
  const featuredProject = categoryConfig.projects[0];
  console.log("featuredProject", featuredProject);

  // Then the next 4 project configs are for the 4 cards that show up below
  const otherProjects = [
    categoryConfig.projects[1],
    categoryConfig.projects[2],
    categoryConfig.projects[3],
    categoryConfig.projects[4],
  ];

  // Create the section placeholder that will hold the 4 cards
  // https://tailwindcss.com/docs/space#limitations for explanation of the negative margin
  const section = createElement("section", { className: "flex flex-wrap mb-16 -m-4" });
  rootElement.appendChild(section);

  section.appendChild(createFeaturedCard(featuredProject));

  // loop through the 4 configs, creating a card for each and place it into the section
  otherProjects.forEach((projectInfo) => {
    section.appendChild(
      createCard({
        title: projectInfo.title,
        content: projectInfo.description,
        link: projectInfo.url,
        language: projectInfo.displayLang,
        stars: projectInfo.stars,
      })
    );
  });

  return rootElement;
};

/**
 * MAIN ENTRY POINT: ---------------------------------------------
 */
const main = async () => {
  const config = await getConfig();

  // loop through each of the categories and create a section (title and cards) for each
  config.categories.forEach((categoryConfig) => {
    const section = getSection(categoryConfig);
    document.getElementById("main").append(section);
  });
};

main();
