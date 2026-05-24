(() => {
  const params = new URLSearchParams(location.search);
  let data = null;

  try {
    data = JSON.parse(params.get("data") || "{}");
  } catch {
    data = {};
  }

  const fallback = {
    title: "Senior UX Researcher",
    company: "Google",
    trust: 70,
    risk: 18,
    match: 58,
    recommendation: "Use Caution",
    salary: "$115k–$145k",
    posted: "Posted 12 days ago",
    tags: ["Remote", "Research", "Senior"],
    warnings: [
      "The company may create the impression of a full salary, but part of the compensation may be equity.",
      "Several users mentioned long interview processes with low response rates.",
      "The role appears to require significantly more responsibilities compared to similar positions."
    ],
    community: [
      "Community feedback points to a demanding interview loop.",
      "Employees mentioned strong culture, but hiring timelines can be slow.",
      "Remote flexibility is good, but transparency could be better."
    ],
    logic: [
      "Salary competitiveness vs. similar remote roles.",
      "Job age, title-to-responsibility fit, and wording clarity.",
      "Community discussion signals and transparency concerns.",
      "Preference learning would refine the score over time."
    ]
  };

  const job = { ...fallback, ...data };

  const $ = (id) => document.getElementById(id);

  $("trustScore").textContent = job.trust;
  $("riskScore").textContent = job.risk;
  $("decision").textContent = job.recommendation;
  $("matchScore").textContent = job.match;
  $("jobTitle").textContent = job.title;
  $("jobMeta").textContent = `${job.company} • ${job.posted} • ${job.salary}`;
  $("summaryText").textContent =
    job.summary ||
    "The role shows a mixed transparency profile. The listing may be worth applying to if the responsibilities and compensation align with your goals.";
// colorize scores and decision text based on thresholds
const setColor = (el, cls) => {
  el.classList.remove("color-green", "color-yellow", "color-red");
  if (cls) el.classList.add(cls);
};

// trust: higher is better
const trust = Number(job.trust || 0);
if (trust >= 75) setColor($("trustScore"), "color-green");
else if (trust >= 55) setColor($("trustScore"), "color-yellow");
else setColor($("trustScore"), "color-red");

// risk: higher is worse
const risk = Number(job.risk || 0);
if (risk >= 65) setColor($("riskScore"), "color-red");
else if (risk >= 40) setColor($("riskScore"), "color-yellow");
else setColor($("riskScore"), "color-green");

// match: higher is better
const match = Number(job.match || 0);
if (match >= 75) setColor($("matchScore"), "color-green");
else if (match >= 55) setColor($("matchScore"), "color-yellow");
else setColor($("matchScore"), "color-red");

// decision mapping
const dec = (job.recommendation || "").toLowerCase();

if (dec.includes("worth")) {
  setColor($("decision"), "color-green");
}
else if (dec.includes("caution")) {
  setColor($("decision"), "color-yellow");
}
else {
  setColor($("decision"), "color-red");
}
  $("chips").innerHTML = (job.tags || []).map((tag) => `<span class="chip">${tag}</span>`).join("");
  $("warnings").innerHTML = (job.warnings || []).map((item) => `<li>${item}</li>`).join("");
  $("community").innerHTML = (job.community || []).map((item) => `<li>${item}</li>`).join("");
  $("logic").innerHTML = (job.logic || []).map((item) => `<li>${item}</li>`).join("");

  const openSite = () => window.open("/website/index.html#home", "_blank", "noopener,noreferrer");

  $("logoBtn").addEventListener("click", openSite);
  $("openSite").addEventListener("click", openSite);

  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      window.open(`/website/index.html#${route}`, "_blank", "noopener,noreferrer");
    });
  });

  $("saveBtn").addEventListener("click", () => ($("saveBtn").textContent = "Saved locally"));
  $("dislikeBtn").addEventListener("click", () => ($("dislikeBtn").textContent = "Preference recorded"));
  $("reportBtn").addEventListener("click", () => ($("reportBtn").textContent = "Reported"));
})();