run = () => {
    let script = document.createElement('script');
    let meta = document.createElement('meta');

    /* ----- Google Analytics ----- */

    const GoogleAnalyticsComment = document.createComment('Global site tag (gtag.js) - Google Analytics');
    document.head.appendChild(GoogleAnalyticsComment);

    let GoogleAnalyticsScriptLink = script.cloneNode(true)
    GoogleAnalyticsScriptLink.setAttribute('async', '');
    GoogleAnalyticsScriptLink.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-97DE9W3FTW');
    document.head.appendChild(GoogleAnalyticsScriptLink);

    let GoogleAnalyticsScriptConfig = script.cloneNode(true);
    GoogleAnalyticsScriptConfig.innerHTML = `
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-97DE9W3FTW");
    `;
    document.head.appendChild(GoogleAnalyticsScriptConfig);
    /* Google Analytics End */

    /* ----- Google Search Console ----- */
    const GoogleSearchConsoleComment = document.createComment('Google Search Console');
    document.head.appendChild(GoogleSearchConsoleComment);

    let googleSearchConsoleMeta = meta.cloneNode(true);
    googleSearchConsoleMeta.setAttribute('name', 'google-site-verification');
    googleSearchConsoleMeta.setAttribute('content', 'VR0EJgkx4d0ULyWmWrZjlo5y_JB_StghHttCISeAM5c');
    document.head.appendChild(googleSearchConsoleMeta);
    /* Google Search Console End */

    /* ----- Microsoft Clarity ----- */

    const ClarityAnalyticsComment = document.createComment('Microsoft Clarity');
    document.head.appendChild(ClarityAnalyticsComment);

    let ClarityScriptLink = script.cloneNode(true);
    ClarityScriptLink.setAttribute('type', 'text/javascript');
    ClarityScriptLink.innerHTML = `
(function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "6kqvmd0sos");
    `;
    document.head.appendChild(ClarityScriptLink);
    /* Microsoft Clarity End */

    /* ----- Bing Site Verification Code ----- */
    const BingWebMasterToolsComment = document.createComment('Bing WebMaster');
    document.head.appendChild(BingWebMasterToolsComment);

    let bingWebMasterMeta = meta.cloneNode(true);
    bingWebMasterMeta.setAttribute('name', 'msvalidate.01');
    bingWebMasterMeta.setAttribute('content', 'BEC77652B2417C03E19AED80E3EB97D8');
    document.head.appendChild(bingWebMasterMeta);
    /* Bing Site Verification Code End */
}

run();