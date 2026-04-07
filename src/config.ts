export const SITE = {
  website: "https://rem1l.github.io/", // replace this with your deployed domain
  author: "Rem1L",
  profile: "https://github.com/Rem1L",
  desc: "Adversarial LLM engineer. IPI, agent access control, LLM-assisted vulnerability research. PhD @ OSU.",
  title: "Rem1L",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/Rem1L/Rem1L.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Los_Angeles", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
