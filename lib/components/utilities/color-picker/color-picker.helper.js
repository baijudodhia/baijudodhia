export function changeThemeColor(value) {
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

  document.querySelector("app-color-picker").setAttribute("color", primary_light);
}
