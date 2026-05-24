// JS implementation for CondenseJob Product Website Mockup Hackathon MVP
document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE & MOCKED STRUCTS ---
  const mockJobs = {
    "linkedin.com/jobs/view/vosyn-product-designer": {
      title: "Product Experience Designer",
      entity: "Vosyn Co. &bull; London, ON / Remote",
      overallTrustScore: 64,
      scamRiskScore: 34,
      matchScore: 71,
      priority: "Use Caution",
      explanations: [
        "Language suggests broad responsibilities matching a multi-person workflow.",
        "The starting salary of $115k-$145k was cited as partly stock-options on Ontario forum threads.",
        "The hiring team requires brief trial tasks exceeding standard 4h labor quotas."
      ],
      warnings: [
        "Alternative equity package offers reported on Reddit.",
        "Non-compensated specification exercises represent a heavy attrition vector."
      ]
    },
    "indeed.com/jobs/view/apex-tech-data-entry": {
      title: "Remote Data Entry Assistant",
      entity: "Apex Legal Leads. &bull; USA / Remote",
      overallTrustScore: 18,
      scamRiskScore: 92,
      matchScore: 31,
      priority: "High Risk / Low Transparency",
      explanations: [
        "Unrealistic salary rates advertised ($65-$85/hr) for typing entry specifications.",
        "Hiring manager handles correspondence via @gmail.com or temporary registrar domain.",
        "Requires immediate purchase of home office hardware through check-reimbursement protocols."
      ],
      warnings: [
        "Home check-bouncing equipment purchase scam detected.",
        "Domain was configured less than 2 months ago in Panama registers."
      ]
    }
  };

  const initialComments = [
    {
      author: "Jane Miller",
      avatar: "J",
      role: "Compensation",
      isVerified: true,
      date: "3 days ago",
      text: "Yes, regarding Vosyn's pay structure: make sure to explicitly demand a breakdown of liquid cash vs. private options. Ontario standards require full minimum cash compensation despite any equity promises."
    },
    {
      author: "Devon Brooks",
      avatar: "D",
      role: "Interview Trial",
      isVerified: true,
      date: "5 days ago",
      text: "Completely remote eligible, and they ship high-end workspace packages right away. IBM sprints are sustainable with strict 40h bounds."
    },
    {
      author: "Anonymous Designer",
      avatar: "A",
      role: "Hiring Process",
      isVerified: false,
      date: "1 week ago",
      text: "Be careful of data entry ads on Indeed claiming to pay $65/hr. They just sent me a fake check and told me to buy a MacBook. Absolute scam."
    }
  ];

  // Conversations Data Link
  const conversations = {
    c1: {
      name: "Jane Miller",
      avatar: "J",
      messages: [
        { sender: "them", text: "Secure channel configured. Hello, I can answer your questions about working here.", time: "11:05 AM" }
      ],
      replies: {
        pay: "Our local pay is structured in 12 monthly payments, but double-check the cash vs shares percentage. I suggest demanding at least 85% liquid cash.",
        test: "The trial test was 5 hours of design layout. It's not paid, but if you push back, they might agree to a shortened timeline.",
        equity: "Equity is based on Series A valuations which are illiquid. Rely primarily on the base cash salary.",
        interview: "We did 3 rounds: a brief recruiter chat, a presentation, and a 1-on-1 team review before the offer."
      }
    },
    c2: {
      name: "Devon Brooks",
      avatar: "D",
      messages: [
        { sender: "them", text: "How can I help you today? Ask me about interviews or remote operations.", time: "yesterday" }
      ],
      replies: {
        pay: "Pay is competitive and matched to Toronto scales. Full health coverage begins instantly.",
        test: "There are standard interactive whiteboards but nothing overly exhausting. Focus on showing your regular process.",
        equity: "Equity plans exist but generally target director levels. Standard teams get performance bonuses.",
        interview: "Standard 2-step loop. Recruiter screen then call with the Engineering Manager."
      }
    }
  };

  let activeConvId = "c1";


  // --- DYNAMIC AUDIT LOGIC ---
  const urlForm = document.getElementById("url-form");
  const urlInput = document.getElementById("url-input");
  const auditLoader = document.getElementById("audit-loader");
  const auditResultsPanel = document.getElementById("audit-results-panel");

  const displayRole = document.getElementById("target-role");
  const displayEntity = document.getElementById("target-entity");
  const ratingTrust = document.getElementById("rating-trust");
  const ratingScam = document.getElementById("rating-scam");
  const ratingMatch = document.getElementById("rating-match");
  const barTrust = document.getElementById("bar-trust");
  const barScam = document.getElementById("bar-scam");
  const barMatch = document.getElementById("bar-match");
  const descPriority = document.getElementById("desc-priority");
  const listSummaries = document.getElementById("list-summaries");
  const listWarnings = document.getElementById("list-warnings");
  const warningsPanel = document.getElementById("warnings-panel");

  function triggerAudit(url) {
    urlInput.value = url;
    
    // Smooth loader transition
    auditLoader.classList.remove("hidden");
    auditResultsPanel.classList.add("hidden");

    setTimeout(() => {
      // Find mocked payload or generate fallback
      let data = mockJobs["linkedin.com/jobs/view/vosyn-product-designer"]; // default fallback
      if (url.includes("apex") || url.includes("entry")) {
        data = mockJobs["indeed.com/jobs/view/apex-tech-data-entry"];
      } else if (url.includes("vosyn") || url.includes("designer")) {
        data = mockJobs["linkedin.com/jobs/view/vosyn-product-designer"];
      } else {
        // dynamic generate generic fallback
        data = {
          title: "Senior Product Developer",
          entity: "Global Nexus Tech &bull; Remote",
          overallTrustScore: 82,
          scamRiskScore: 12,
          matchScore: 88,
          priority: "Worth Applying",
          explanations: [
            "Excellent salary consistency and full compliance with remote laws.",
            "Verified employees and active github organization nodes.",
            "Recruiters have verified company-owned domain emails."
          ],
          warnings: []
        };
      }

      // Populate elements
      displayRole.innerText = data.title.toLowerCase();
      displayEntity.innerHTML = data.entity;
      ratingTrust.innerText = data.overallTrustScore;
      ratingScam.innerText = data.scamRiskScore;
      ratingMatch.innerText = data.matchScore;
      
      barTrust.style.width = `${data.overallTrustScore}%`;
      barScam.style.width = `${data.scamRiskScore}%`;
      barMatch.style.width = `${data.matchScore}%`;

      descPriority.innerText = data.priority;
      
      // Theme colors
      if (data.overallTrustScore >= 80) {
        ratingTrust.className = "m-big text-success";
        descPriority.className = "m-pill-success";
      } else if (data.overallTrustScore >= 50) {
        ratingTrust.className = "m-big text-warning";
        descPriority.className = "m-pill-warning";
      } else {
        ratingTrust.className = "m-big text-red";
        descPriority.className = "m-pill-warning border-red-glow text-red";
      }

      if (data.scamRiskScore > 50) {
        ratingScam.className = "m-big text-red";
      } else {
        ratingScam.className = "m-big text-success";
      }

      // Populate summaries bullet items
      listSummaries.innerHTML = "";
      data.explanations.forEach(exp => {
        const li = document.createElement("li");
        li.innerText = exp;
        listSummaries.appendChild(li);
      });

      // Populate Warnings
      if (data.warnings && data.warnings.length > 0) {
        warningsPanel.classList.remove("hidden");
        listWarnings.innerHTML = "";
        data.warnings.forEach(warn => {
          const li = document.createElement("li");
          li.innerText = warn;
          listWarnings.appendChild(li);
        });
      } else {
        warningsPanel.classList.add("hidden");
      }

      // Hide Loader, display results
      auditLoader.classList.add("hidden");
      auditResultsPanel.classList.remove("hidden");
      
      // Auto scroll to results smoothly
      auditResultsPanel.scrollIntoView({ behavior: "smooth" });
    }, 1500); // 1.5s scanning timing
  }

  if (urlForm) {
    urlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerAudit(urlInput.value);
    });
  }

  // Exemplars preset clicks
  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      triggerAudit(btn.getAttribute("data-url"));
    });
  });

  // Save job action button
  const btnSaveJob = document.getElementById("btn-save-job");
  if (btnSaveJob) {
    btnSaveJob.addEventListener("click", () => {
      btnSaveJob.innerText = "✓ Saved to Profile";
      btnSaveJob.style.borderColor = "#10b981";
      btnSaveJob.style.color = "#10b981";
    });
  }


  // --- FILE UPLOAD RESUME DROPZONE ---
  const dropzone = document.getElementById("resume-dropzone");
  const fileInput = document.getElementById("resume-file-input");
  const uploadResult = document.getElementById("upload-result");

  if (dropzone) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "#06b6d4";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.style.borderColor = "rgba(255, 255, 255, 0.08)";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      handleUpload();
    });

    fileInput.addEventListener("change", handleUpload);
  }

  function handleUpload() {
    dropzone.classList.add("hidden");
    uploadResult.classList.remove("hidden");
  }


  // --- COMMENTS BOARD (FORUM) ---
  const commentForm = document.getElementById("comment-form");
  const cList = document.getElementById("comments-list");

  function renderComments() {
    cList.innerHTML = "";
    initialComments.forEach((comm, idx) => {
      const card = document.createElement("div");
      card.className = "comment-card";
      card.innerHTML = `
        <div class="comment-header">
          <div class="comment-user-box">
            <span class="comment-avatar-char">${comm.avatar}</span>
            <span class="comment-author-name">${comm.author}</span>
            ${comm.isVerified ? `<span class="verified-insider-flag">Vetted Staff</span>` : `<span class="anon-flag">Anonymous</span>`}
          </div>
          <span class="comment-date">${comm.date}</span>
        </div>
        <p class="comment-body">${comm.text}</p>
        <div class="comment-footer">
          <span class="comment-tag-badge">#${comm.role}</span>
          <button class="comment-like-btn" id="like-btn-${idx}">&hearts; <span>${idx === 0 ? 14 : (idx === 1 ? 8 : 22)}</span> users like this</button>
        </div>
      `;
      cList.appendChild(card);

      // Simple like clicker mock
      const likeBtn = card.querySelector(`#like-btn-${idx}`);
      likeBtn.addEventListener("click", () => {
        const countSpan = likeBtn.querySelector("span");
        countSpan.innerText = parseInt(countSpan.innerText) + 1;
        likeBtn.style.color = "#06b6d4";
      });
    });
  }

  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const author = document.getElementById("comment-author").value || "Anonymous Insider";
      const cat = document.getElementById("comment-role-tag").value;
      const isAnon = document.getElementById("comment-is-anonymous").checked;
      const text = document.getElementById("comment-content").value;

      initialComments.unshift({
        author: author,
        avatar: author[0].toUpperCase(),
        role: cat,
        isVerified: !isAnon,
        date: "Just now",
        text: text
      });

      renderComments();
      document.getElementById("comment-content").value = "";
    });
  }

  renderComments();


  // --- DIRECT MESSAGING CORE SYSTEM ---
  const threads = document.querySelectorAll(".thread-item");
  const msgStream = document.getElementById("messages-stream");
  const dmForm = document.getElementById("dm-form");
  const dmInput = document.getElementById("dm-text-input");
  const activeChatAvatar = document.getElementById("active-chat-avatar");
  const activeChatName = document.getElementById("active-chat-name");

  function renderMessages() {
    msgStream.innerHTML = "";
    const activeConv = conversations[activeConvId];
    
    activeConv.messages.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `msg-bubble ${msg.sender}`;
      bubble.innerHTML = `
        <p class="bubble-text">${msg.text}</p>
        <span class="bubble-meta">${msg.sender === "me" ? "Alex R." : activeConv.name} &bull; ${msg.time}</span>
      `;
      msgStream.appendChild(bubble);
    });
    
    // Auto scroll chat viewport bottom
    msgStream.scrollTop = msgStream.scrollHeight;
  }

  // Thread switcher bind
  threads.forEach(th => {
    th.addEventListener("click", () => {
      threads.forEach(x => x.classList.remove("active"));
      th.classList.add("active");

      const cid = th.getAttribute("data-conv-id");
      activeConvId = cid;

      const activeConv = conversations[cid];
      activeChatName.innerText = activeConv.name;
      activeChatAvatar.innerText = activeConv.avatar;

      renderMessages();
    });
  });

  // Sending a message
  if (dmForm) {
    dmForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = dmInput.value.trim();
      if (!text) return;

      const activeConv = conversations[activeConvId];
      
      // Append user msg
      activeConv.messages.push({
        sender: "me",
        text: text,
        time: "Just now"
      });

      renderMessages();
      dmInput.value = "";

      // Smart Bot response evaluation
      let responseText = "That sounds reasonable. I highly recommend validating verified forum comments matching that specific project team before scheduling screens.";
      const lower = text.toLowerCase();

      // Trigger standard keywords reply match
      Object.keys(activeConv.replies).forEach(keyword => {
        if (lower.includes(keyword)) {
          responseText = activeConv.replies[keyword];
        }
      });

      // Quick auto-messaging delays (1.2 seconds)
      setTimeout(() => {
        activeConv.messages.push({
          sender: "them",
          text: responseText,
          time: "Just now"
        });
        renderMessages();
      }, 1200);
    });
  }

  renderMessages();
});
