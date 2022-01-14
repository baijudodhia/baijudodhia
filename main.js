function changeTheme() {
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

function setDefaultTheme() {
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

function changeLanguageOnButton(lang) {
  changeLanguage(lang);
  // window.location.reload();
  onLoad();
}

function changeLanguage(lang) {
  let htmlEle = document.getElementsByTagName("html")[0];
  htmlEle.setAttribute("lang", lang);
  localStorage.setItem("lang", lang);
}

async function onLoad() {
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
  } else {
    lang = "en";
    localStorage.setItem("lang", "en");
    data = await fetchLanguageData(lang);
  }
  setDefaultTheme();
  // await setComponents();
  const appAbout = document.querySelector("app-about");
  appAbout.setAttribute("language", lang);
  lang = "en";
  const appOnlineCertificates = document.querySelector("app-online-certificates");
  appOnlineCertificates.setAttribute("language", lang);
  const appProjects = document.querySelector("app-projects");
  appProjects.setAttribute("language", lang);
  const appWorkExperience = document.querySelector("app-work-experience");
  appWorkExperience.setAttribute("language", lang);
  const appSkills = document.querySelector("app-skills");
  appSkills.setAttribute("language", lang);
  document.getElementsByTagName("html")[0].style.overflowY = "auto";
  document.getElementById("loading").style.display = "none";
}
// const setComponents = async () => {
  // let response = await fetch(`/data/en.data.json`);
  // let data = await response.json();
  // let workExperience = data['workExperience'];
  // loadWorkExperience(workExperience);
  // let skills = data['skills'];
  // loadSkills(skills);
  // let projects = data['projects'];
  // loadProjects(projects);
  // let certifications = data['certifications'];
  // loadOnlineCertifications(certifications);
// }
// const loadWorkExperience = (data) => {
//   if ('content' in document.createElement('template')) {
//     let workExperienceContainer = document.querySelector('#work-experience-container');
//     workExperienceContainer.innerHTML = '';
//     let workExperienceTemplate = document.querySelector('#work-experience-template');
//     for (var key in data) {
//       if (data.hasOwnProperty(key)) {
//         const val = data[key];
//         var clone = workExperienceTemplate.content.cloneNode(true);
//         clone.querySelector(".work-experience-organisation-logo").setAttribute("src", val['organisationLogo']);
//         clone.querySelector(".work-experience-organisation-logo").setAttribute("alt", val['organisationName']);
//         clone.querySelector(".work-experience-profile").setAttribute('label', val['profileTitle']);
//         clone.querySelector(".work-experience-date").setAttribute('label', val['fromDate'] + " - " + val["toDate"]);
//         clone.querySelector(".work-experience-organisation").setAttribute('label', val['organisationName']);
//         clone.querySelector(".work-experience-location").setAttribute('label', val['workLocation']);
//         clone.querySelector(".work-experience-type").setAttribute('label', val['workType']);
//         clone.querySelector(".work-experience-industry").setAttribute('label', val['workIndustry']);
//         clone.querySelector(".work-experience-description").innerHTML = val['workDescription'];
//         workExperienceContainer.appendChild(clone);
//       }
//     }
//   }
// }
// const loadSkills = (data) => {
//   if ('content' in document.createElement('template')) {
//     let skillsContainer = document.querySelector('#skills-container');
//     skillsContainer.innerHTML = '';
//     let skillsTemplate = document.querySelector('#skills-template');
//     for (var key in data) {
//       if (data.hasOwnProperty(key)) {
//         const val = data[key];
//         var clone = skillsTemplate.content.cloneNode(true);
//         clone.querySelector("#skill-type").innerText = val['skillType'];
//         clone.querySelector("#skill-list").innerText = val["skillList"].join(", ");
//         skillsContainer.appendChild(clone);
//       }
//     }
//   }
// }
// const loadProjects = (data) => {
//   if ('content' in document.createElement('template')) {
//     let projectsContainer = document.querySelector('#projects-container');
//     projectsContainer.innerHTML = '';
//     let projectsTemplate = document.querySelector('#projects-template');
//     for (var key in data) {
//       if (data.hasOwnProperty(key)) {
//         const val = data[key];
//         var clone = projectsTemplate.content.cloneNode(true);
//         clone.querySelector(".project-title").innerText = val['title'];
//         clone.querySelector(".project-description").innerText = val["description"];
//         if (val['code']['linkExists'] === true) {
//           clone.querySelector(".app-link-code").setAttribute("link", val['code']['codeLink']);
//         } else {
//           clone.querySelector(".app-link-code").remove();
//         }
//         if (val.hosted.linkExists) {
//           clone.querySelector(".app-link-live").setAttribute("link", val['hosted']['hostedLink']);
//         } else {
//           clone.querySelector(".app-link-live").remove();
//         }
//         projectsContainer.appendChild(clone);
//       }
//     }
//   }
// }
// const loadOnlineCertifications = (data) => {
//   if ('content' in document.createElement('template')) {
//     let onlineCertificatesContainer = document.querySelector('#online-certificates-container');
//     onlineCertificatesContainer.innerHTML = '';
//     let onlineCertificatesTemplate = document.querySelector('#online-certificates-template');
//     for (var key in data) {
//       if (data.hasOwnProperty(key)) {
//         const val = data[key];
//         var clone = onlineCertificatesTemplate.content.cloneNode(true);
//         clone.querySelector(".online-certificates-title").innerText = val['title'];
//         clone.querySelector(".online-certificates-organisation").setAttribute("label", val["organisation"]);
//         clone.querySelector(".online-certificates-date").setAttribute("label", val["completitionDate"]);
//         clone.querySelector(".online-certificates-link").setAttribute("link", val["certificateLink"]);
//         onlineCertificatesContainer.appendChild(clone);
//       }
//     }
//   }
// }