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
};

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

window.onload = async () => {
	/*
	1. Set Default Theme
	2. Set Default Language
	*/
	await setDefaultTheme();
	await setDefaultLanguage();

	document.getElementById("loading").style.display = "none";
};

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

function HexToHSL(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);

	(r /= 255), (g /= 255), (b /= 255);
	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h;
	let s;
	let l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	s = Math.round(s * 100);
	l = Math.round(l * 100);
	h = Math.round(360 * h);

	return { h, s, l };
}

function HSLToHex(hsl) {
	regexp = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/g;
	res = regexp.exec(hsl).slice(1);
	h = res[0];
	s = res[1].slice(0, -1);
	l = res[2].slice(0, -1);
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}
