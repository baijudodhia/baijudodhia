const setLightTheme = () => {
  document.querySelector("app-theme-changer").setAttribute("theme", "light");
  document.querySelector("app-theme-changer").setAttribute("value", "🌑");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
};

const setDarkTheme = () => {
  document.querySelector("app-theme-changer").setAttribute("theme", "dark");
  document.querySelector("app-theme-changer").setAttribute("value", "🌕");
  document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
};

const changeTheme = () => {
  let theme = document.querySelector("app-theme-changer").getAttribute("theme");
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

/* Currently Portfolio Specific */
/* Website Color Changer Utilities */
function changeThemeColor(value) {
  let color = HexToHSL(value);

  const primary_light = "hsl(" + color.h + ", 100%, 50%)";
  const secondary_light = "hsl(" + color.h + ", 100%, 30%)";
  const tertiary_light = "hsl(" + color.h + ", 100%, 70%)";
  const bw_primary_light = "hsl(0, 0%, 100%)";
  const bw_primary_light_invert = "hsl(0, 0%, 0%)";
  const bw_secondary_light = "hsl(" + color.h + ", 100%, 95%)";
  const bw_secondary_light_invert = "hsl(" + color.h + ", 100%, 5%)";
  const primary_dark = "hsl(" + color.h + ", 100%, 50%)";
  const secondary_dark = "hsl(" + color.h + ", 100%, 70%)";
  const tertiary_dark = "hsl(" + color.h + ", 100%, 30%)";
  const bw_primary_dark = "hsl(0, 0%, 0%)";
  const bw_primary_dark_invert = "hsl(0, 0%, 100%)";
  const bw_secondary_dark = "hsl(" + color.h + ", 100%, 5%)";
  const bw_secondary_dark_invert = "hsl(" + color.h + ", 100%, 95%)";

  document.documentElement.style.setProperty("--color-primary_light", primary_light);
  document.documentElement.style.setProperty("--color-secondary_light", secondary_light);
  document.documentElement.style.setProperty("--color-tertiary_light", tertiary_light);
  document.documentElement.style.setProperty("--color-bw_primary_light", bw_primary_light);
  document.documentElement.style.setProperty("--color-bw_primary_light_invert", bw_primary_light_invert);
  document.documentElement.style.setProperty("--color-bw_secondary_light", bw_secondary_light);
  document.documentElement.style.setProperty("--color-bw_secondary_light_invert", bw_secondary_light_invert);
  document.documentElement.style.setProperty("--color-primary_dark", primary_dark);
  document.documentElement.style.setProperty("--color-secondary_dark", secondary_dark);
  document.documentElement.style.setProperty("--color-tertiary_dark", tertiary_dark);
  document.documentElement.style.setProperty("--color-bw_primary_dark", bw_primary_dark);
  document.documentElement.style.setProperty("--color-bw_primary_dark_invert", bw_primary_dark_invert);
  document.documentElement.style.setProperty("--color-bw_secondary_dark", bw_secondary_dark);
  document.documentElement.style.setProperty("--color-bw_secondary_dark_invert", bw_secondary_dark_invert);

  document.querySelector("app-color-changer").setAttribute("color", primary_light);
}
