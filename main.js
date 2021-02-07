function changeTheme() {
    var theme = document.getElementById('theme-nav-brand').getAttribute('theme-value');
    var theme = document.getElementById('theme-nav-item').getAttribute('theme-value');
    if (theme === "dark") {
        document.getElementById('theme-nav-brand').setAttribute("theme-value", "light");
        document.getElementById('theme-nav-item').setAttribute("theme-value", "light");
        document.getElementById('theme-nav-brand').value = "🌑";
        document.getElementById('theme-nav-item').value = "🌑";
        document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
    } else {
        document.getElementById('theme-nav-brand').setAttribute("theme-value", "dark");
        document.getElementById('theme-nav-item').setAttribute("theme-value", "dark");
        document.getElementById('theme-nav-brand').value = "🌕";
        document.getElementById('theme-nav-item').value = "🌕";
        document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
    }
};

function goTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}