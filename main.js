const setLightTheme = () => {
  document.querySelector("app-theme-changer").setAttribute("theme", "light");
  document.querySelector("app-theme-changer").setAttribute("value", "🌑");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
}

const setDarkTheme = () => {
  document.querySelector("app-theme-changer").setAttribute("theme", "dark");
  document.querySelector("app-theme-changer").setAttribute("value", "🌕");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
}

const changeTheme = () => {
  var theme = document.querySelector("app-theme-changer").getAttribute("theme");
  if (theme === "dark") {
    localStorage.setItem("theme", "light");
    setLightTheme();
  } else {
    localStorage.setItem("theme", "dark");
    setDarkTheme();
  }
}

// Watch for change in theme at OS level
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  const isThemeDark = event.matches;
  if (isThemeDark) {
    localStorage.setItem("theme", "dark");
    setDarkTheme();
  } else {
    localStorage.setItem("theme", "light");
    setLightTheme();
  };
});

const setDefaultTheme = () => {
  // Check if user already visited the website & changed the theme
  if (localStorage.getItem("theme") !== null) {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  } else if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Check if user's system supports dark mode & set default theme accordingly
      // Currently using dark mode
      localStorage.setItem("theme", "dark");
      setDarkTheme();
    } else {
      // Currently using light mode
      localStorage.setItem("theme", "light");
      setLightTheme();
    }
  } else { // If nothing found set by default before then set "Dark as new default";
    localStorage.setItem("theme", "dark");
    setLightTheme();
  }
}

function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const changeLanguage = async (type, lang) => {
  const appLanguageChanger = document.querySelector("app-language-changer");
  appLanguageChanger.setAttribute("language", lang);

  const appAbout = document.querySelector("app-about");
  appAbout.setAttribute("language", lang);

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

    const appOnlineCertificates = document.querySelector("app-online-certificates");
    appOnlineCertificates.setAttribute("language", lang);
  }

}

const setDefaultLanguage = () => {
  // Check if lang value is already stored in LocalStorage indicating user has already visited the website and changed the language.
  let lang = "en";

  if (localStorage.getItem("lang") !== null) {
    lang = localStorage.getItem("lang");
  };

  // Check if retrieved language is valid else set default as "en".
  if (!["en", "hi", "gu", "sa"].includes(lang)) {
    // Inalid - Retrieve data for this language.
    lang = "en";
  }

  // Fetch data for set language and modify the respective content.
  changeLanguage(type = "default", lang);
}

window.onload = async () => {
  /*
  1. Set Default Theme
  2. Set Default Language
  */
  await setDefaultTheme();
  await setDefaultLanguage();

  document.getElementById("loading").style.display = "none";
}

const searchRedirect = (referrer, engine, query) => {
  let url;
  const params = new URLSearchParams({ "q": query });
  if (engine === "google") {
    url = new URL("https://www.google.com/search?") + params;
  } else if (engine === "bing") {
    url = new URL("https://www.bing.com/search?") + params;
  } else if (engine === "duckduckgo") {
    url = new URL("https://duckduckgo.com/?") + params;
  } else if (engine === "brave") {
    url = new URL("https://search.brave.com/search?") + params;
  }
  window.open(url, '_blank');
}