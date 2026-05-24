(() => {
  if (window.__CONDENSEJOB_INJECTED__) return;
  window.__CONDENSEJOB_INJECTED__ = true;

  const WEBSITE_HOME = "/website/index.html";
  const PANEL_URL = chrome?.runtime?.getURL
    ? chrome.runtime.getURL("panel.html")
    : "panel.html";

  const style = document.createElement("style");
  style.textContent = `
    .cj-launcher, .cj-overlay, .cj-liquid, .cj-sidepanel, .cj-loading {
      all: initial;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .cj-launcher{
      position: fixed; top: 18px; right: 18px; z-index: 2147483647;
      width: 52px; height: 52px; border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #2cff8f, #0da24e 60%, #07150d 100%);
      box-shadow: 0 0 0 1px rgba(120,255,180,.25), 0 0 24px rgba(28,255,133,.35);
      display: grid; place-items: center; cursor: pointer;
      border: 1px solid rgba(255,255,255,.08);
    }
    .cj-launcher svg{ width: 24px; height: 24px; fill: #08110d; }
    .cj-loading{
      position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;
      background: rgba(0,0,0,.15); opacity: 0; transition: opacity .2s ease;
    }
    .cj-loading.show{ opacity: 1; }
    .cj-loader-card{
      position: fixed; left: 50%; top: 18%; transform: translateX(-50%);
      width: min(520px, calc(100vw - 32px)); border-radius: 28px;
      background: rgba(7, 10, 8, .92); border: 1px solid rgba(62, 255, 145, .35);
      color: #fff; padding: 22px 24px 20px; box-shadow: 0 28px 80px rgba(0,0,0,.5);
      overflow: hidden;
    }
    .cj-loader-can{
      width: 64px; height: 64px; margin: 0 auto 14px; border-radius: 18px;
      background: linear-gradient(180deg, #bfc8c8, #1f2425);
      border: 1px solid rgba(255,255,255,.14); position: relative;
      box-shadow: inset 0 2px 10px rgba(255,255,255,.16), 0 0 24px rgba(0,255,128,.16);
      animation: cjFloat 1.4s ease-in-out infinite;
    }
    .cj-loader-can:before{
      content: ""; position: absolute; inset: 9px 10px 10px;
      border-radius: 14px; border: 1px solid rgba(255,255,255,.18);
    }
    .cj-loader-can:after{
      content: ""; position: absolute; left: 50%; top: 50%;
      width: 30px; height: 6px; border-radius: 999px;
      transform: translate(-50%, -50%) rotate(-16deg);
      background: linear-gradient(90deg, transparent, #2cff8f, transparent);
      filter: blur(1px);
    }
    .cj-loading h3{ margin: 0; text-align: center; font-size: 18px; }
    .cj-loading p{ margin: 8px 0 0; text-align: center; color: rgba(255,255,255,.72); font-size: 13px; line-height: 1.5; }
    .cj-ripple{
      position: absolute; inset: auto 50% 14px; transform: translateX(-50%);
      width: 240px; height: 10px; border-radius: 999px;
      background: linear-gradient(90deg, transparent, rgba(48,255,142,.95), transparent);
      filter: blur(6px); animation: cjPulse 1.4s ease-in-out infinite;
    }
    .cj-liquid{
      position: fixed; inset: 0; z-index: 2147483645; pointer-events: none;
      background:
        radial-gradient(circle at 40% 55%, rgba(77,255,136,.20), transparent 18%),
        radial-gradient(circle at 52% 50%, rgba(113,255,77,.20), transparent 26%),
        radial-gradient(circle at 50% 48%, rgba(65,255,135,.24), transparent 34%);
      mix-blend-mode: screen; opacity: 0; filter: blur(12px);
      transition: opacity .8s ease;
    }
    .cj-liquid.show{ opacity: 1; }
    .cj-sidepanel{
      position: fixed; top: 0; right: 0; height: 100vh; width: min(430px, 100vw);
      z-index: 2147483647; transform: translateX(102%); transition: transform .28s ease;
      border-left: 1px solid rgba(68,255,148,.35);
      box-shadow: -24px 0 60px rgba(0,0,0,.55);
      background: #060706;
    }
    .cj-sidepanel.show{ transform: translateX(0); }
    .cj-sidepanel iframe{ width: 100%; height: 100%; border: 0; background: transparent; }
    .cj-tag{
      position: absolute; right: 10px; top: 10px; z-index: 2147483647;
      padding: 6px 10px; border-radius: 999px; font-size: 12px; color: #b9ffd9;
      background: rgba(12, 20, 15, .92); border: 1px solid rgba(80,255,140,.25);
    }
    .cj-worth{ outline: 1px solid rgba(49, 255, 126, .65) !important; box-shadow: 0 0 0 1px rgba(49,255,126,.18), 0 0 22px rgba(49,255,126,.12) !important; }
    .cj-caution{ outline: 1px solid rgba(255, 207, 77, .65) !important; box-shadow: 0 0 0 1px rgba(255,207,77,.16), 0 0 22px rgba(255,207,77,.12) !important; }
    .cj-risk{ outline: 1px solid rgba(255, 82, 82, .68) !important; box-shadow: 0 0 0 1px rgba(255,82,82,.18), 0 0 22px rgba(255,82,82,.12) !important; }
    @keyframes cjFloat { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }
    @keyframes cjPulse { 0%,100%{ opacity: .35; transform: translateX(-50%) scaleX(.9);} 50%{ opacity: 1; transform: translateX(-50%) scaleX(1.1);} }
  `;
  document.documentElement.appendChild(style);

  const launcher = document.createElement("button");
  launcher.className = "cj-launcher";
  launcher.type = "button";
  launcher.title = "CondenseJob";
  launcher.innerHTML = "";

  // draggable launcher
  launcher.style.touchAction = "none";
  launcher.style.userSelect = "none";
  launcher.style.webkitUserSelect = "none";

  const drag = {
    pointerId: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    moved: false,
    dragging: false,
    suppressClick: false
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const getLauncherPos = () => {
    const rect = launcher.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  };

  const setLauncherPos = (left, top) => {
    const maxLeft = window.innerWidth - launcher.offsetWidth - 8;
    const maxTop = window.innerHeight - launcher.offsetHeight - 8;
    launcher.style.left = `${clamp(left, 8, maxLeft)}px`;
    launcher.style.top = `${clamp(top, 8, maxTop)}px`;
    launcher.style.right = "auto";
    launcher.style.bottom = "auto";
  };

  launcher.addEventListener("pointerdown", (e) => {
    drag.pointerId = e.pointerId;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    const pos = getLauncherPos();
    drag.startLeft = pos.left;
    drag.startTop = pos.top;
    drag.moved = false;
    drag.dragging = false;
    launcher.setPointerCapture(e.pointerId);
  });

  launcher.addEventListener("pointermove", (e) => {
    if (drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.dragging && Math.hypot(dx, dy) > 6) {
      drag.dragging = true;
      drag.moved = true;
    }

    if (!drag.dragging) return;

    setLauncherPos(drag.startLeft + dx, drag.startTop + dy);
    e.preventDefault();
  });

  const endDrag = (e) => {
    if (drag.pointerId !== e.pointerId) return;
    drag.pointerId = null;

    if (drag.dragging) {
      drag.suppressClick = true;
      setTimeout(() => {
        drag.suppressClick = false;
      }, 0);
    }

    drag.dragging = false;
  };

  launcher.addEventListener("pointerup", endDrag);
  launcher.addEventListener("pointercancel", () => {
    drag.pointerId = null;
    drag.dragging = false;
    drag.suppressClick = false;
  });

  const loading = document.createElement("div");
  loading.className = "cj-loading";
  loading.innerHTML = `
    <div class="cj-loader-card">
      <div class="cj-loader-can"></div>
      <h3>Analyzing job posting...</h3>
      <p>Scanning transparency signals, community insights, and hiring patterns.</p>
      <div class="cj-ripple"></div>
    </div>
  `;

  const liquid = document.createElement("div");
  liquid.className = "cj-liquid";

  const panel = document.createElement("div");
  panel.className = "cj-sidepanel";

  document.body.appendChild(launcher);
  document.body.appendChild(liquid);
  document.body.appendChild(loading);
  document.body.appendChild(panel);

  const getCards = () => {
    const selectors = [
      "article",
      "[data-job-id]",
      ".job-card",
      ".jobSeen",
      ".base-card",
      ".result",
      ".jobsearch-SerpJobCard",
      "[role='listitem']"
    ];
    const nodes = [...new Set(selectors.flatMap((s) => [...document.querySelectorAll(s)]))];
    return nodes.filter((el) => el.offsetParent !== null && el.textContent.trim().length > 20);
  };

  const hashString = (input) => {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  // const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const mockAnalyze = (el, index) => {
    const text = (el.textContent || "").toLowerCase();
    const title =
      (text.match(/([a-z][a-z\/\-\s]{2,40}(intern|designer|researcher|engineer|manager|specialist|associate))/i)?.[1] ||
        `Job Listing ${index + 1}`).trim();
    const company =
      (text.match(/\b(at|by)\s+([a-z0-9.&\-\s]{2,30})/i)?.[2] || "Company").trim();

    const seed = hashString(`${title}|${company}|${text}|${index}`);
    const variance = ((seed % 21) - 10); // -10 to +10, feels random but stable
    const profileRoll = seed % 100;

    let trust = 58 + variance;
    let risk = 42 - Math.floor(variance * 0.7);
    let match = 60 + Math.floor(variance * 0.6);

    const warnings = [];
    const insights = [];
    const tags = ["Remote", "Transparent", "Community"];

    let positiveSignals = 0;
    let negativeSignals = 0;

    if (text.includes("salary") || text.includes("compensation")) {
      positiveSignals += 1;
      insights.push("Salary transparency is mentioned in the listing.");
    }
    if (text.includes("remote")) {
      positiveSignals += 1;
      insights.push("Remote-first signal is present.");
    }
    if (text.includes("design") || text.includes("ux") || text.includes("research")) {
      positiveSignals += 1;
      insights.push("Role aligns with product/design background.");
    }

    if (text.includes("equity") || text.includes("commission only")) {
      negativeSignals += 2;
      trust -= 18;
      risk += 18;
      warnings.push("Compensation may be partially equity-based.");
    }
    if (text.includes("ai interview") || text.includes("automated screening")) {
      negativeSignals += 1;
      trust -= 10;
      warnings.push("Hiring process appears heavily automated.");
      tags.push("AI-screening");
    }
    if (text.includes("urgent") || text.includes("fast-paced") || text.includes("wear many hats")) {
      negativeSignals += 1;
      trust -= 8;
      risk += 10;
      warnings.push("Language suggests broad responsibilities.");
    }
    if (text.includes("visa")) {
      negativeSignals += 1;
      trust -= 7;
      match -= 12;
      warnings.push("Visa sponsorship may affect fit.");
    }
    if (text.includes("senior") && text.includes("junior")) {
      negativeSignals += 1;
      trust -= 12;
      warnings.push("Title and responsibilities may not align.");
    }
    if (text.includes("coding") || text.includes("react") || text.includes("javascript")) {
      negativeSignals += 1;
      match -= 14;
      warnings.push("Role may require more coding than expected.");
    }
    if (text.includes("over 1 month") || text.includes("30 days")) {
      negativeSignals += 2;
      trust -= 15;
      risk += 12;
      warnings.push("Older posting: lower current hiring confidence.");
    }

    trust += positiveSignals * 5 - negativeSignals * 6;
    risk += negativeSignals * 7 - positiveSignals * 2;
    match += positiveSignals * 4 - negativeSignals * 5;

    trust += profileRoll < 34 ? 10 : profileRoll < 68 ? 0 : -10;
    match += profileRoll < 25 ? 8 : profileRoll < 75 ? 0 : -8;

    trust = clamp(Math.round(trust), 0, 100);
    risk = clamp(Math.round(risk), 0, 100);
    match = clamp(Math.round(match), 0, 100);

    let recommendation =
      profileRoll < 34 ? "Worth Applying" : profileRoll < 67 ? "Use Caution" : "High Risk / Low Transparency";

    if (trust >= 72 && negativeSignals <= 1) recommendation = "Worth Applying";
    else if (trust >= 52) recommendation = "Use Caution";
    else recommendation = "High Risk / Low Transparency";

    if (negativeSignals >= 3 || risk >= 60 || trust < 45) recommendation = "High Risk / Low Transparency";
    if (positiveSignals >= 3 && trust >= 65 && negativeSignals <= 1) recommendation = "Worth Applying";

    const community = [
      "Several users mention long interview cycles with slow follow-up.",
      "Community feedback suggests the role may be more demanding than the title implies.",
      "A few comments point to good remote flexibility but unclear compensation."
    ];

    return {
      title,
      company,
      trust,
      risk,
      match,
      recommendation,
      warnings,
      insights,
      community,
      tags,
      salary: "$115k–$145k",
      posted: "Posted 12 days ago",
      logic: [
        "Market salary compared against similar remote roles.",
        "Job age, title-to-responsibility alignment, and transparency wording reviewed.",
        "Community review signals and hiring process friction included.",
        "Preference learning factors would adjust future results."
      ]
    };
  };

  const recommendationToClass = (recommendation = "") => {
    const value = recommendation.toLowerCase();
    if (value.includes("worth applying")) return "cj-worth";
    if (value.includes("use caution")) return "cj-caution";
    return "cj-risk";
  };

  const colorizeCards = (cards) => {
    const results = cards.map((el, index) => {
      const result = mockAnalyze(el, index);
      el.dataset.cj = JSON.stringify(result);
      el.style.transition = "box-shadow .25s ease, outline-color .25s ease, transform .25s ease";
      el.style.cursor = "pointer";
      return { el, result };
    });

    if (results.length >= 3) {
      const hasGreen = results.some(({ result }) => recommendationToClass(result.recommendation) === "cj-worth");
      const hasYellow = results.some(({ result }) => recommendationToClass(result.recommendation) === "cj-caution");
      const hasRed = results.some(({ result }) => recommendationToClass(result.recommendation) === "cj-risk");

      if (!hasGreen) {
        const top = [...results].sort((a, b) => b.result.trust - a.result.trust)[0];
        top.result.recommendation = "Worth Applying";
        top.result.trust = Math.max(top.result.trust, 74);
        top.result.risk = Math.min(top.result.risk, 22);
      }

      if (!hasYellow) {
        const mid = results[Math.floor(results.length / 2)];
        mid.result.recommendation = "Use Caution";
        mid.result.trust = clamp(mid.result.trust, 52, 71);
      }

      if (!hasRed) {
        const low = [...results].sort((a, b) => a.result.trust - b.result.trust)[0];
        low.result.recommendation = "High Risk / Low Transparency";
        low.result.trust = Math.min(low.result.trust, 44);
        low.result.risk = Math.max(low.result.risk, 58);
      }
    }

    results.forEach(({ el, result }) => {
      el.classList.remove("cj-worth", "cj-caution", "cj-risk");
      el.classList.add(recommendationToClass(result.recommendation));

      el.addEventListener(
        "click",
        (ev) => {
          ev.stopPropagation();
          openPanel(result);
        },
        { once: true }
      );
    });
  };


  // const hashString = (input) => {
  //   let hash = 2166136261;
  //   for (let i = 0; i < input.length; i++) {
  //     hash ^= input.charCodeAt(i);
  //     hash = Math.imul(hash, 16777619);
  //   }
  //   return hash >>> 0;
  // };


  // const mockAnalyze = (el, index) => {
  //   const text = (el.textContent || "").toLowerCase();
  //   const title =
  //     (text.match(/([a-z][a-z\/\-\s]{2,40}(intern|designer|researcher|engineer|manager|specialist|associate))/i)?.[1] ||
  //       `Job Listing ${index + 1}`).trim();
  //   const company =
  //     (text.match(/\b(at|by)\s+([a-z0-9.&\-\s]{2,30})/i)?.[2] || "Company").trim();

  //   const seed = hashString(`${title}|${company}|${text}|${index}`);
  //   const variance = ((seed % 21) - 10); // -10 to +10, feels random but stable
  //   const profileRoll = seed % 100;

  //   let trust = 58 + variance;
  //   let risk = 42 - Math.floor(variance * 0.7);
  //   let match = 60 + Math.floor(variance * 0.6);

  //   const warnings = [];
  //   const insights = [];
  //   const tags = ["Remote", "Transparent", "Community"];

  //   let positiveSignals = 0;
  //   let negativeSignals = 0;

  //   if (text.includes("salary") || text.includes("compensation")) {
  //     positiveSignals += 1;
  //     insights.push("Salary transparency is mentioned in the listing.");
  //   }
  //   if (text.includes("remote")) {
  //     positiveSignals += 1;
  //     insights.push("Remote-first signal is present.");
  //   }
  //   if (text.includes("design") || text.includes("ux") || text.includes("research")) {
  //     positiveSignals += 1;
  //     insights.push("Role aligns with product/design background.");
  //   }

  //   if (text.includes("equity") || text.includes("commission only")) {
  //     negativeSignals += 2;
  //     trust -= 18;
  //     risk += 18;
  //     warnings.push("Compensation may be partially equity-based.");
  //   }
  //   if (text.includes("ai interview") || text.includes("automated screening")) {
  //     negativeSignals += 1;
  //     trust -= 10;
  //     warnings.push("Hiring process appears heavily automated.");
  //     tags.push("AI-screening");
  //   }
  //   if (text.includes("urgent") || text.includes("fast-paced") || text.includes("wear many hats")) {
  //     negativeSignals += 1;
  //     trust -= 8;
  //     risk += 10;
  //     warnings.push("Language suggests broad responsibilities.");
  //   }
  //   if (text.includes("visa")) {
  //     negativeSignals += 1;
  //     trust -= 7;
  //     match -= 12;
  //     warnings.push("Visa sponsorship may affect fit.");
  //   }
  //   if (text.includes("senior") && text.includes("junior")) {
  //     negativeSignals += 1;
  //     trust -= 12;
  //     warnings.push("Title and responsibilities may not align.");
  //   }
  //   if (text.includes("coding") || text.includes("react") || text.includes("javascript")) {
  //     negativeSignals += 1;
  //     match -= 14;
  //     warnings.push("Role may require more coding than expected.");
  //   }
  //   if (text.includes("over 1 month") || text.includes("30 days")) {
  //     negativeSignals += 2;
  //     trust -= 15;
  //     risk += 12;
  //     warnings.push("Older posting: lower current hiring confidence.");
  //   }

  //   trust += positiveSignals * 5 - negativeSignals * 6;
  //   risk += negativeSignals * 7 - positiveSignals * 2;
  //   match += positiveSignals * 4 - negativeSignals * 5;

  //   trust += profileRoll < 34 ? 10 : profileRoll < 68 ? 0 : -10;
  //   match += profileRoll < 25 ? 8 : profileRoll < 75 ? 0 : -8;

  //   trust = clamp(Math.round(trust), 0, 100);
  //   risk = clamp(Math.round(risk), 0, 100);
  //   match = clamp(Math.round(match), 0, 100);

  //   let recommendation =
  //     profileRoll < 34 ? "Worth Applying" : profileRoll < 67 ? "Use Caution" : "High Risk / Low Transparency";

  //   if (trust >= 72 && negativeSignals <= 1) recommendation = "Worth Applying";
  //   else if (trust >= 52) recommendation = "Use Caution";
  //   else recommendation = "High Risk / Low Transparency";

  //   if (negativeSignals >= 3 || risk >= 60 || trust < 45) recommendation = "High Risk / Low Transparency";
  //   if (positiveSignals >= 3 && trust >= 65 && negativeSignals <= 1) recommendation = "Worth Applying";

  //   const community = [
  //     "Several users mention long interview cycles with slow follow-up.",
  //     "Community feedback suggests the role may be more demanding than the title implies.",
  //     "A few comments point to good remote flexibility but unclear compensation."
  //   ];

  //   return {
  //     title,
  //     company,
  //     trust,
  //     risk,
  //     match,
  //     recommendation,
  //     warnings,
  //     insights,
  //     community,
  //     tags,
  //     salary: "$115k–$145k",
  //     posted: "Posted 12 days ago",
  //     logic: [
  //       "Market salary compared against similar remote roles.",
  //       "Job age, title-to-responsibility alignment, and transparency wording reviewed.",
  //       "Community review signals and hiring process friction included.",
  //       "Preference learning factors would adjust future results."
  //     ]
  //   };
  // };

  // const recommendationToClass = (recommendation = "") => {
  //   const value = recommendation.toLowerCase();
  //   if (value.includes("worth applying")) return "cj-worth";
  //   if (value.includes("use caution")) return "cj-caution";
  //   return "cj-risk";
  // };

  



  const showLoading = () => {
    loading.classList.add("show");
    liquid.classList.add("show");
    setTimeout(() => loading.classList.remove("show"), 1700);
    setTimeout(() => liquid.classList.remove("show"), 2600);
  };

  const openPanel = (data) => {
    const url = `${PANEL_URL}?data=${encodeURIComponent(JSON.stringify(data))}`;
    panel.innerHTML = `<iframe title="CondenseJob analysis panel" src="${url}"></iframe>`;
    panel.classList.add("show");
  };

 launcher.addEventListener("click", (e) => {
  if (drag.suppressClick || drag.moved) {
    e.preventDefault();
    e.stopPropagation();
    drag.moved = false;
    return;
  }

  const cards = getCards();
  showLoading();
  setTimeout(() => {
    if (cards.length) colorizeCards(cards);
    openPanel(mockAnalyze(cards[0] || document.body, 0));
  }, 1800);
});

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") panel.classList.remove("show");
  });

  // close panel when clicking outside of it (but ignore clicks on launcher)
  document.addEventListener("click", (e) => {
    if (!panel.classList.contains("show")) return;
    const clickedInsidePanel = e.target.closest(".cj-sidepanel");
    const clickedLauncher = e.target.closest(".cj-launcher");
    if (!clickedInsidePanel && !clickedLauncher) {
      panel.classList.remove("show");
    }
  });
})();