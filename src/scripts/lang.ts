function applyLang(lang: string) {
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem("lang", lang);
  // Update button label
  const btn = document.getElementById("lang-btn");
  if (btn) btn.textContent = lang === "en" ? "中" : "EN";
}

function toggleLang() {
  const current = document.documentElement.getAttribute("data-lang") ?? "en";
  applyLang(current === "en" ? "zh" : "en");
}

function initLang() {
  const saved = localStorage.getItem("lang") ?? "en";
  applyLang(saved);

  const btn = document.getElementById("lang-btn");
  btn?.addEventListener("click", toggleLang);
}

initLang();
document.addEventListener("astro:after-swap", initLang);
