function changeTheme() {
  var theme = document
    .getElementById("theme-nav-brand")
    .getAttribute("theme-value");
  if (theme === "dark") {
    document
      .getElementById("theme-nav-brand")
      .setAttribute("theme-value", "light");
    document.getElementById("theme-nav-brand").value = "🌑";
    document
      .getElementsByTagName("html")[0]
      .setAttribute("data-theme", "light");
  } else {
    document
      .getElementById("theme-nav-brand")
      .setAttribute("theme-value", "dark");
    document.getElementById("theme-nav-brand").value = "🌕";
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
  }
}

function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function changeLanguageOnButton(lang) {
  changeLanguage(lang);
  window.location.reload();
}

function changeLanguage(lang) {
  let htmlEle = document.getElementsByTagName("html")[0];
  htmlEle.setAttribute("lang", lang);
  localStorage.setItem("lang", lang);
}

async function onLoad() {
  // document.getElementsByTagName("html")[0].style.overflowY = "hidden";
  // document.getElementsByTagName("body")[0].style.overflowY = "hidden";
  let lang = "en";
  let data;
  if (localStorage.getItem("lang") !== null) {
    lang = localStorage.getItem("lang");
  } else {
    lang = "en";
    localStorage.setItem("lang", "en");
  }
  if (["en", "hi", "gu", "sa"].includes(lang)) {
    changeLanguage(lang);
    data = await fetchOnLoad(lang);
  }
  console.log(data);
  document.getElementById("name-span").innerHTML = data.name;
  document.getElementById("profile-span").innerHTML = data.profile;
  document.getElementsByTagName("html")[0].style.overflowY = "auto";
  document.getElementsByTagName("body")[0].style.overflowY = "auto";
  document.getElementById("loading").style.display = "none";
}
const fetchOnLoad = async (lang) => {
  let data = await fetch(`http://localhost:5500/assets/lang/${lang}.lang.json`);
  return await data.json();
};
