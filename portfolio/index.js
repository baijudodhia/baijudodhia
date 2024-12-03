window.onLoad = function () {
  setLanguage(parseInt(localStorage.getItem("lang"), 10));

  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 500);
};

window.setLanguage = function (language = 1) {
  switch (language) {
    case 1:
      document.querySelector("#about-name").setAttribute("text", "Baiju Dodhia");
      break;
    case 2:
      document.querySelector("#about-name").setAttribute("text", "बैजु दोढीया");
      break;
    case 3:
      document.querySelector("#about-name").setAttribute("text", "બૈજુ દોઢીયા");
      break;
    default:
      document.querySelector("#about-name").setAttribute("text", "Baiju Dodhia");
      break;
  }
};

window.goTop = function () {
  const element = document.querySelector(".body");
  element.scrollTop = 0;
};
