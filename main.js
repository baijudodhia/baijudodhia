const changeTheme = () => {
  var theme = document.getElementById("theme-nav-brand").getAttribute("theme-value");
  if (theme === "dark") {
    document.getElementById("theme-nav-brand").setAttribute("theme-value", "light");
    document.getElementById("theme-nav-brand").value = "🌑";
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.getElementById("theme-nav-brand").setAttribute("theme-value", "dark");
    document.getElementById("theme-nav-brand").value = "🌕";
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

const setDefaultTheme = () => {
  if (localStorage.getItem("theme") !== null) {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.getElementById("theme-nav-brand").setAttribute("theme-value", "dark");
      document.getElementById("theme-nav-brand").value = "🌕";
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
    } else {
      document.getElementById("theme-nav-brand").setAttribute("theme-value", "light");
      document.getElementById("theme-nav-brand").value = "🌑";
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
    }
  } else {
    localStorage.setItem("theme", "dark");
    document.getElementById("theme-nav-brand").setAttribute("theme-value", "dark");
    document.getElementById("theme-nav-brand").value = "🌕";
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
  }
}

function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const changeLanguage = async (type, lang) => {
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
  
  if(localStorage.getItem("lang") !== null) {
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

async function onLoad() {
  /*
  1. Set Default Theme
  2. Set Default Language
  */
 await setDefaultTheme();
 await setDefaultLanguage();

 document.getElementById("loading").style.display = "none";
}