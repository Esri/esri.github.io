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

/**
 * This helper function creates a "featured" "card" DOM element
 * given an object of details that the card should contain:
 */
const createFeaturedCard = (cardInfo) => {
  console.log("cardInfo", cardInfo);
  const rootElement = document.createElement("div");
  rootElement.className = "bg-[#efefef] w-full m-4 p-4";

  if (cardInfo.image) {
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "w-full md:w-1/3 float-left";

    const img = document.createElement("img");
    img.className = "w-full md:w-auto";
    img.src = `https://esri.github.io/${cardInfo.image}`;

    imageWrapper.appendChild(img);
    rootElement.appendChild(imageWrapper);
  }

  if (cardInfo.title) {
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "w-full md:w-2/3 float-left pl-4";
    const titleElement = document.createElement("h4");
    titleElement.className = "text-lg mb-4 mt-4 md:mt-0";
    const link = document.createElement("calcite-link");
    link.href = cardInfo.url;
    link.innerHTML = cardInfo.title;

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "text-md";
    descriptionElement.innerHTML = cardInfo.description;

    titleElement.appendChild(link);
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
  const rootElement = document.createElement("calcite-card");
  rootElement.className = "box-border p-4 basis-1/2 md:basis-1/4 grow shrink";

  if (cardInfo.title) {
    const titleElement = document.createElement("span");
    titleElement.slot = "title";

    const link = document.createElement("calcite-link");
    link.innerHTML = cardInfo.title;
    link.href = cardInfo.link;

    titleElement.appendChild(link);
    rootElement.appendChild(titleElement);
  }
  if (cardInfo.content) {
    const contentElement = document.createElement("div");
    contentElement.innerHTML = cardInfo.content;

    if (cardInfo.link) {
      const p = document.createElement("p");

      const link = document.createElement("calcite-link");
      link.href = cardInfo.link;
      link.innerHTML = "Learn More";

      p.appendChild(link);
      contentElement.appendChild(p);
    }
    rootElement.appendChild(contentElement);
  }

  if (cardInfo.language) {
    const link = document.createElement("calcite-link");
    link.slot = "footer-leading";
    link.href = `https://github.com/Esri?language=${cardInfo.language.toLowerCase()}`;
    link.innerHTML = cardInfo.language;
    rootElement.appendChild(link);
  }

  if (cardInfo.stars) {
    const stars = document.createElement("div");
    stars.slot = "footer-trailing";
    stars.innerHTML = "⭐" + cardInfo.stars;
    rootElement.appendChild(stars);
  }

  return rootElement;
};

/**
 * This helper function creates a DOM node given the type, classes, and innerHTML
 */
const createBasicDomNode = (elementType, classes, innerHTML) => {
  const element = document.createElement(elementType);
  element.className = classes;
  element.innerHTML = innerHTML;
  return element;
};

/**
 * Creates a section with a title and 4 cards
 */
const getSection = (categoryConfig) => {
  const rootElement = document.createElement("div");

  // Create the title
  const title = createBasicDomNode("h2", "text-4xl mb-6", categoryConfig.title);
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
  const section = createBasicDomNode("section", "flex flex-wrap mb-16 -m-4", "");
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
