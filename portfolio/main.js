/* Portfolio Specific */
function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function setScreenSizes() {
  const doc = document.documentElement;
  doc.style.setProperty("--screen-height-browser-head", `${window.outerHeight - window.innerHeight}px`);
}

/* Currently Portfolio Specific */
const changeLanguage = async (type, lang) => {
  const appLanguageChanger = document.querySelector("app-language-changer");
  appLanguageChanger.setAttribute("language", lang);

  const appAbout = document.querySelector("app-about");
  appAbout.setAttribute("language", lang);

  // Uncomment later when actual certifications are required to be displayed in other language.
  // const appCertifications = document.querySelector("app-certifications");
  // appCertifications.setAttribute("language", lang);

  let htmlEle = document.getElementsByTagName("html")[0];
  htmlEle.setAttribute("lang", lang);

  localStorage.setItem("lang", lang);

  // set Default Language as "en" for other sections on Loading.
  if (type === "default") {
    lang = "en";
    const appWorkExperience = document.querySelector("app-work-experience");
    appWorkExperience.setAttribute("language", lang);

    const appSkills = document.querySelector("app-skills");
    appSkills.setAttribute("language", lang);

    const appProjects = document.querySelector("app-projects");
    appProjects.setAttribute("language", lang);

    const appCertifications = document.querySelector("app-certifications");
    appCertifications.setAttribute("language", lang);
  }
};

/* Portfolio Specific */
const setDefaultLanguage = () => {
  // Check if lang value is already stored in LocalStorage indicating user has already visited the website and changed the language.
  let lang = "en";

  if (localStorage.getItem("lang") !== null) {
    lang = localStorage.getItem("lang");
  }

  // Check if retrieved language is valid else set default as "en".
  if (!["en", "hi", "gu", "sa"].includes(lang)) {
    // Inalid - Retrieve data for this language.
    lang = "en";
  }

  // Fetch data for set language and modify the respective content.
  changeLanguage((type = "default"), lang);
};

/* Portfolio Specific */
window.onload = async () => {
  /*
	1. Set Default Theme
	2. Set Default Language
	*/
  await setScreenSizes();
  window.addEventListener("resize", setScreenSizes);
  await setDefaultTheme();
  await setDefaultLanguage();

  document.getElementById("loading").style.display = "none";
};

/* Portfolio Specific */
const searchRedirect = (referrer, engine, query) => {
  let url;
  const params = new URLSearchParams({ q: query });
  if (engine === "google") {
    url = new URL("https://www.google.com/search?") + params;
  } else if (engine === "bing") {
    url = new URL("https://www.bing.com/search?") + params;
  } else if (engine === "duckduckgo") {
    url = new URL("https://duckduckgo.com/?") + params;
  } else if (engine === "brave") {
    url = new URL("https://search.brave.com/search?") + params;
  }
  window.open(url, "_blank");
};
