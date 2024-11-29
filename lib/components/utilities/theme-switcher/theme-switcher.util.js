export const setLightTheme = () => {
  document.querySelector("app-theme-switcher").setAttribute("theme", "light");
  document.querySelector("app-theme-switcher").setAttribute("value", "🌑");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
};

export const setDarkTheme = () => {
  document.querySelector("app-theme-switcher").setAttribute("theme", "dark");
  document.querySelector("app-theme-switcher").setAttribute("value", "🌕");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
};

export const changeTheme = () => {
  let theme = document.querySelector("app-theme-switcher").getAttribute("theme");
  if (theme === "dark") {
    localStorage.setItem("theme", "light");
    setLightTheme();
  } else {
    localStorage.setItem("theme", "dark");
    setDarkTheme();
  }
};

/* Portfolio Specific */
// Watch for change in theme at OS level followed by browser level.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  const isThemeDark = event.matches;
  if (isThemeDark) {
    localStorage.setItem("theme", "dark");
    setDarkTheme();
  } else {
    localStorage.setItem("theme", "light");
    setLightTheme();
  }
});

/* Currently Portfolio Specific */
export const setDefaultTheme = () => {
  // Check if user already visited the website & changed the theme
  if (localStorage.getItem("theme") !== null) {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  } else if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Check if user's system supports dark mode & set default theme accordingly
      // Currently using dark mode
      localStorage.setItem("theme", "dark");
      setDarkTheme();
    } else {
      // Currently using light mode
      localStorage.setItem("theme", "light");
      setLightTheme();
    }
  } else {
    // If nothing found set by default before then set "Dark as new default";
    localStorage.setItem("theme", "dark");
    setLightTheme();
  }
};

export const getCurrentTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
