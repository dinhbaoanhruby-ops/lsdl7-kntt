const STORAGE_KEY = "lsdl7_hk1_progress_v2";

let state = loadState();
let currentTab = "lichsu";
let activeLesson = null;
let activeQuiz = null;
let selectedChip = null;
let examTimerInterval = null;

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { quizzes: {}, exams: {} };
  } catch (e) {
    return { quizzes: {}, exams: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createShuffledOrder(len) {
  const idx = Array.from({ length: len }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

function showView(viewId, title, subtitle, showBack = true) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
  document.getElementById("header-title").textContent = title;
  document.getElementById("header-subtitle").textContent = subtitle;
  document.getElementById("btn-back").classList.toggle("hidden", !showBack);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btn-back").addEventListener("click", () => {
  if (examTimerInterval) clearInterval(examTimerInterval);
  renderHome();
  showView("view-home", "Ôn thi HK1 – Sử & Địa 7", "Kết nối tri thức • Tự động lưu bài làm", false);
});

document.getElementById("btn-overview").addEventListener("click", () => {
  document.getElementById("modal-overview").classList.remove("hidden");
});
document.getElementById("btn-close-modal").addEventListener("click", () => {
  document.getElementById("modal-overview").classList.add("hidden");
});
document.getElementById("btn-reset-progress").addEventListener("click", () => {
  if (confirm("Xóa toàn bộ bài làm dở và điểm đã lưu trên máy này?")) {
    localStorage.removeItem(STORAGE_KEY);
    state = { quizzes: {}, exams: {} };
    document.getElementById("modal-overview").classList.add("hidden");
    renderHome();
  }
});

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    renderHome();
  });
});

function renderHome() {
  const container = document.getElementById("lesson-list");
  container.innerHTML = "";

  if (currentTab === "tonghop") {
    CURRICULUM.exams.forEach(ex => {
      const saved = state.exams[ex.id];
      const card = document.createElement("div");
      card.className = "lesson-card";
      card.innerHTML = `
        <div class="lesson-head">
          <h3 class="lesson-title">${ex.title}</h3>
          <span class="progress-tag">${saved && saved.submitted ? "Điểm: " + saved.score10 + "/10" : ex.durationMinutes + " phút"}</span>
        </div>
        <p class="lesson-meta">${ex.desc}</p>
        <button class="btn btn-primary" onclick="openExam('${ex.id}')">${saved && !saved.submitted ? "Làm tiếp bài dở →" : "Bắt đầu làm đề bấm giờ →"}</button>
      `;
      container.appendChild(card);
    });
    return;
  }

  const list = CURRICULUM[currentTab] || [];
  let lastChapter = "";

  list.forEach(lesson => {
    if (lesson.chapter !== lastChapter) {
      lastChapter = lesson.chapter;
      const ch = document.createElement("div");
      ch.className = "chapter-header";
      ch.textContent = lastChapter;
      container.appendChild(ch);
    }

    const totalDe = lesson.quizzes ? lesson.quizzes.length : 0;
    let doneCount = 0;
    if (lesson.quizzes) {
      lesson.quizzes.forEach(q => {
        const k = `${lesson.id}_${q.id}`;
        if (state.quizzes[k] && state.quizzes[k].completed) doneCount++;
      });
    }

    const card = document.createElement("div");
    card.className = "lesson-card";

    if (!lesson.summary) {
      card.innerHTML = `
        <div class="lesson-head">
          <h3 class="lesson-title"><span class="lesson-code">${lesson.code}</span> ${lesson.title}</h3>
          <span class="progress-tag">Đang cập nhật</span>
        </div>
        <p class="lesson-meta">${lesson.pages} • Khung chương trình HK1</p>
      `;
      container.appendChild(card);
      return;
    }

    let pillsHtml = `
      <button class="pill-btn" onclick="openSummary('${currentTab}', '${lesson.id}')">Ý chính</button>
      <button class="pill-btn" onclick="openPictureQuiz('${currentTab}', '${lesson.id}')">Đố tranh</button>
    `;

    lesson.quizzes.forEach((q, idx) => {
      const k = `${lesson.id}_${q.id}`;
      const qState = state.quizzes[k];
      let cls = "pill-btn";
      let label = `Đề ${idx + 1}`;
      if (qState && qState.completed) { cls += " done"; label += " ✓"; }
      else if (qState && Object.keys(qState.answers || {}).length > 0) { cls += " in-progress"; label += " (dở)"; }
      pillsHtml += `<button class="${cls}" onclick="openQuiz('${currentTab}', '${lesson.id}', '${q.id}')">${label}</button>`;
    });

    card.innerHTML = `
      <div class="lesson-head">
        <h3 class="lesson-title"><span class="lesson-code">${lesson.code}</span> ${lesson.title}</h3>
        <span class="progress-tag">Đã làm ${doneCount}/${totalDe} đề</span>
      </div>
      <p class="lesson-meta">${lesson.pages}</p>
      <div class="pill-grid">${pillsHtml}</div>
    `;
    container.appendChild(card);
  });
}

function findLesson(subject, lessonId) {
  return CURRICULUM[subject].find(l => l.id === lessonId);
}

/* BƯỚC 1: Ý CHÍNH */
function openSummary(subject, lessonId) {
  activeLesson = findLesson(subject, lessonId);
  const s = activeLesson.summary;
  const box = document.getElementById("summary-content");

  const factsHtml = s.facts.map(f => `
    <div class="fact-card">
      <div class="fact-num">${f.num}</div>
      <div class="fact-desc">${f.desc}</div>
    </div>
  `).join("");

  const secHtml = s.sections.map((sec, i) => `
    <div class="card">
      <h4 style="margin:0 0 8px;color:var(--navy);"><span class="sec-badge">${i + 1}</span>${sec.heading.replace(/^\d+\.\s*/, "")}</h4>
      <ul style="margin:0;padding-left:20px;">
        ${sec.bullets.map(b => `<li style="margin-bottom:6px;">${b}</li>`).join("")}
      </ul>
      <div class="sgk-img-box">
        <div class="sgk-caption">▲ ${sec.caption}</div>
      </div>
    </div>
  `).join("");

  box.innerHTML = `
    <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">${activeLesson.pages}</div>
    <div class="overview-box">
      <h4>Nhìn chung</h4>
      <p>${s.overview}</p>
    </div>
    <div class="fact-grid">${factsHtml}</div>
    ${secHtml}
  `;

  document.getElementById("btn-to-picture-quiz").onclick = () => openPictureQuiz(subject, lessonId);
  document.getElementById("btn-to-quiz-1").onclick = () => openQuiz(subject, lessonId, activeLesson.quizzes[0].id);

  showView("view-summary", `Bước 1: Ý chính`, `${activeLesson.code} • ${activeLesson.title}`);
}

/* ĐỐ TRANH */
let picOptionOrders = {};

function openPictureQuiz(subject, lessonId) {
  activeLesson = findLesson(subject, lessonId);
  const pq = activeLesson.pictureQuiz;
  const box = document.getElementById("picture-content");
  picOptionOrders = {};

  let html = `<h3 style="margin:0 0 10px;color:var(--navy);">Phần 1. Nhìn tranh, chọn tên</h3>`;
  pq.part1.forEach((item, idx) => {
    const order = createShuffledOrder(item.options.length);
    picOptionOrders[idx] = order;
    html += `
      <div class="q-card">
        <div class="q-num">Câu ${idx + 1}</div>
        <p class="q-prompt">${item.question}</p>
        <div class="sgk-img-box" style="margin-bottom:12px;font-weight:700;color:var(--navy);">${item.svgLabel}</div>
        <div id="pq1-opts-${idx}">
          ${order.map((origIdx, dispIdx) => `
            <button class="opt-btn" onclick="checkPicMcq(${idx}, ${dispIdx})">
              <span class="opt-letter">${String.fromCharCode(65 + dispIdx)}</span>
              <span>${item.options[origIdx]}</span>
            </button>
          `).join("")}
        </div>
        <div id="pq1-fb-${idx}"></div>
      </div>
    `;
  });

  const shuffledLabels = shuffleCopy(pq.part2.map(p => p.label));
  html += `<h3 style="margin:16px 0 10px;color:var(--navy);">Phần 2. Ghép tên đúng với mô tả tranh</h3>
    <div class="q-card">
      ${pq.part2.map((p, i) => `
        <div class="match-row">
          <div class="match-left">${p.hint}</div>
          <div>→</div>
          <select class="match-select" id="pq2-sel-${i}">
            <option value="">-- Chọn tên --</option>
            ${shuffledLabels.map(lbl => `<option value="${lbl}">${lbl}</option>`).join("")}
          </select>
        </div>
      `).join("")}
      <button class="btn btn-primary" style="margin-top:8px;" onclick="checkPicMatch()">Kiểm tra Phần 2</button>
      <div id="pq2-fb"></div>
    </div>
  `;

  box.innerHTML = html;
  showView("view-picture", "Đố tranh khái niệm", `${activeLesson.code} • Nhìn tranh đoán khái niệm`);
}

function checkPicMcq(qIdx, dispIdx) {
  const item = activeLesson.pictureQuiz.part1[qIdx];
  const origIdx = picOptionOrders[qIdx][dispIdx];
  const btns = document.querySelectorAll(`#pq1-opts-${qIdx} .opt-btn`);
  btns.forEach(b => b.classList.remove("wrong", "correct"));
  const fb = document.getElementById(`pq1-fb-${qIdx}`);
  if (origIdx === item.answer) {
    btns[dispIdx].classList.add("correct");
    fb.innerHTML = `<div class="fb-box fb-correct">✓ <strong>Giỏi quá!</strong> ${item.explain}</div>`;
  } else {
    btns[dispIdx].classList.add("wrong");
    fb.innerHTML = `<div class="fb-box fb-wrong">✗ <strong>Chưa đúng.</strong> Con quan sát kỹ đặc điểm trong khung mô tả nhé!</div>`;
  }
}

function checkPicMatch() {
  const list = activeLesson.pictureQuiz.part2;
  let allOk = true;
  list.forEach((p, i) => {
    const sel = document.getElementById(`pq2-sel-${i}`);
    sel.classList.remove("correct", "wrong");
    if (sel.value === p.label) sel.classList.add("correct");
    else { sel.classList.add("wrong"); allOk = false; }
  });
  document.getElementById("pq2-fb").innerHTML = allOk
    ? `<div class="fb-box fb-correct">✓ <strong>Chính xác hoàn toàn!</strong></div>`
    : `<div class="fb-box fb-wrong">✗ Còn ô viền đỏ chưa khớp, con chọn lại nhé.</div>`;
}

/* BƯỚC 2: ĐỌC ĐOẠN NGẮN & LÀM ĐỀ (TỰ ĐỘNG LƯU + XÁO TRỘN ĐÁP ÁN) */
function initQuizShuffle(qData) {
  if (!qData.optOrders) qData.optOrders = {};
  activeQuiz.questions.forEach((q, qIdx) => {
    if (q.type === "mcq" && !qData.optOrders[qIdx]) {
      qData.optOrders[qIdx] = createShuffledOrder(q.options.length);
    }
  });
}

function openQuiz(subject, lessonId, quizId) {
  activeLesson = findLesson(subject, lessonId);
  activeQuiz = activeLesson.quizzes.find(q => q.id === quizId);
  const storeKey = `${lessonId}_${quizId}`;
  if (!state.quizzes[storeKey]) {
    state.quizzes[storeKey] = { answers: {}, firstTry: {}, optOrders: {}, completed: false };
  }
  initQuizShuffle(state.quizzes[storeKey]);
  saveState();

  renderQuizScreen(subject, storeKey);
  showView("view-quiz", activeQuiz.title, `${activeLesson.code} • Tự động lưu từng câu`);
}

function renderQuizScreen(subject, storeKey) {
  const qData = state.quizzes[storeKey];
  initQuizShuffle(qData);

  const topbar = document.getElementById("quiz-topbar");
  topbar.innerHTML = activeQuiz.questions.map((_, i) => {
    const st = qData.answers[i];
    const cls = st && st.isCorrect ? "ok" : (st && st.checked ? "err" : "");
    return `<div class="q-step-pill ${cls}">${i + 1}</div>`;
  }).join("");

  const readingBox = document.getElementById("reading-box");
  readingBox.innerHTML = `
    <h3>${activeQuiz.passageTitle}</h3>
    <div class="reading-sub">Đọc kỹ đoạn văn rồi trả lời ${activeQuiz.questions.length} câu bên dưới. Câu căn cứ sẽ tô tím khi làm đúng.</div>
    <div class="reading-text">
      ${activeQuiz.sentences.map((s, idx) => `<span class="evidence-sent" id="ev-sent-${idx}">${s} </span>`).join("")}
    </div>
  `;

  activeQuiz.questions.forEach((q, i) => {
    if (qData.answers[i] && qData.answers[i].isCorrect && typeof q.evidenceIdx === "number") {
      const el = document.getElementById(`ev-sent-${q.evidenceIdx}`);
      if (el) el.classList.add("highlighted");
    }
  });

  const qContainer = document.getElementById("questions-container");
  qContainer.innerHTML = "";

  activeQuiz.questions.forEach((q, qIdx) => {
    const savedAns = qData.answers[qIdx] || {};
    const card = document.createElement("div");
    card.className = "q-card";
    card.id = `q-card-${qIdx}`;

    let bodyHtml = "";

    if (q.type === "mcq") {
      const order = qData.optOrders[qIdx];
      bodyHtml = order.map((origIdx, dispIdx) => {
        let cls = "opt-btn";
        if (savedAns.checked && savedAns.selectedOrig === origIdx) {
          cls += savedAns.isCorrect ? " correct" : " wrong";
        }
        return `
          <button class="${cls}" onclick="handleMcq('${subject}', '${storeKey}', ${qIdx}, ${origIdx})">
            <span class="opt-letter">${String.fromCharCode(65 + dispIdx)}</span>
            <span>${q.options[origIdx]}</span>
          </button>
        `;
      }).join("");
    } else if (q.type === "fill") {
      const filled = savedAns.filled || Array(q.blanks.length).fill("");
      if (!savedAns.bankOrder) {
        savedAns.bankOrder = shuffleCopy(q.bank);
        qData.answers[qIdx] = savedAns;
        saveState();
      }
      let sentenceHtml = "";
      q.template.forEach((part, pIdx) => {
        sentenceHtml += part;
        if (pIdx < q.blanks.length) {
          const val = filled[pIdx];
          let slotCls = "blank-slot" + (val ? " filled" : "");
          if (savedAns.checked) {
            slotCls += (val === q.blanks[pIdx]) ? " correct" : " wrong";
          }
          sentenceHtml += `<span class="${slotCls}" onclick="placeChipToSlot('${subject}', '${storeKey}', ${qIdx}, ${pIdx})" ondragover="event.preventDefault()" ondrop="dropChipToSlot(event, '${subject}', '${storeKey}', ${qIdx}, ${pIdx})">${val || "..."}</span>`;
        }
      });
      bodyHtml = `
        <div style="font-size:16px;line-height:2;margin-bottom:8px;">${sentenceHtml}</div>
        <div class="word-bank">
          ${savedAns.bankOrder.map(w => {
            const isUsed = filled.includes(w);
            return `<button class="word-chip ${isUsed ? "used" : ""}" draggable="true" ondragstart="dragWordChip(event, '${w}')" onclick="selectWordChip(this, '${w}')">${w}</button>`;
          }).join("")}
        </div>
        <button class="btn btn-primary" onclick="checkFill('${subject}', '${storeKey}', ${qIdx})">Kiểm tra</button>
      `;
    } else if (q.type === "sort") {
      const currentOrder = savedAns.order || shuffleCopy(q.items);
      if (!savedAns.order) {
        qData.answers[qIdx] = { ...savedAns, order: currentOrder };
        saveState();
      }
      bodyHtml = currentOrder.map((text, idx) => {
        let rowCls = "sort-row";
        if (savedAns.checked) {
          rowCls += (text === q.items[idx]) ? " correct" : " wrong";
        }
        return `
          <div class="${rowCls}">
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="sort-num">${idx + 1}</span>
              <span>${text}</span>
            </div>
            <div class="sort-arrows">
              <button onclick="moveSortItem('${subject}', '${storeKey}', ${qIdx}, ${idx}, -1)">↑</button>
              <button onclick="moveSortItem('${subject}', '${storeKey}', ${qIdx}, ${idx}, 1)">↓</button>
            </div>
          </div>
        `;
      }).join("") + `<button class="btn btn-primary" style="margin-top:6px;" onclick="checkSort('${subject}', '${storeKey}', ${qIdx})">Kiểm tra thứ tự</button>`;
    } else if (q.type === "match") {
      const userPairs = savedAns.pairs || {};
      if (!savedAns.rightOrder) {
        savedAns.rightOrder = shuffleCopy(q.pairs.map(p => p.right));
        qData.answers[qIdx] = savedAns;
        saveState();
      }
      bodyHtml = q.pairs.map((p, idx) => {
        const val = userPairs[idx] || "";
        let selCls = "match-select";
        if (savedAns.checked) {
          selCls += (val === p.right) ? " correct" : " wrong";
        }
        return `
          <div class="match-row">
            <div class="match-left">${p.left}</div>
            <div>→</div>
            <select class="${selCls}" onchange="setMatchVal('${subject}', '${storeKey}', ${qIdx}, ${idx}, this.value)">
              <option value="">-- Chọn ý nối --</option>
              ${savedAns.rightOrder.map(r => `<option value="${r}" ${val === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
        `;
      }).join("") + `<button class="btn btn-primary" style="margin-top:6px;" onclick="checkMatch('${subject}', '${storeKey}', ${qIdx})">Kiểm tra nối cặp</button>`;
    } else if (q.type === "tf") {
      const tfAns = savedAns.tf || {};
      bodyHtml = q.statements.map((st, sIdx) => {
        const chosen = tfAns[sIdx];
        let itemCls = "tf-item";
        if (savedAns.checked && typeof chosen === "boolean") {
          itemCls += (chosen === st.answer) ? " correct" : " wrong";
        }
        return `
          <div class="${itemCls}">
            <div>${st.text}</div>
            <div class="tf-btns">
              <button class="tf-btn ${chosen === true ? "active" : ""}" onclick="setTfVal('${subject}', '${storeKey}', ${qIdx}, ${sIdx}, true)">Đúng</button>
              <button class="tf-btn ${chosen === false ? "active" : ""}" onclick="setTfVal('${subject}', '${storeKey}', ${qIdx}, ${sIdx}, false)">Sai</button>
            </div>
            ${savedAns.checked && typeof chosen === "boolean" ? `<div style="margin-top:6px;font-size:13.5px;font-weight:600;">${st.explain}</div>` : ""}
          </div>
        `;
      }).join("") + `<button class="btn btn-primary" onclick="checkTf('${subject}', '${storeKey}', ${qIdx})">Kiểm tra Đúng / Sai</button>`;
    }

    let fbHtml = "";
    if (savedAns.checked) {
      if (savedAns.isCorrect) {
        fbHtml = `<div class="fb-box fb-correct">✓ <strong>Đúng, chuẩn ý trong bài!</strong> ${q.explain || ""}</div>`;
      } else {
        fbHtml = `<div class="fb-box fb-wrong">✗ <strong>Chưa đúng.</strong> ${savedAns.wrongMsg || "Con kiểm tra lại các ô viền đỏ rồi bấm Kiểm tra nhé."}</div>`;
      }
    }

    card.innerHTML = `
      <div class="q-meta">
        <div><span class="q-num">Câu ${qIdx + 1}</span><span class="diff-tag">${q.diff}</span></div>
      </div>
      <p class="q-prompt">${q.prompt}</p>
      ${bodyHtml}
      ${fbHtml}
    `;
    qContainer.appendChild(card);
  });

  renderQuizSummaryBox(subject, storeKey);
}

function recordFirstTry(qData, qIdx, isOk) {
  if (typeof qData.firstTry[qIdx] === "undefined") {
    qData.firstTry[qIdx] = isOk;
  }
}

function handleMcq(subject, storeKey, qIdx, origIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const isOk = origIdx === q.answer;
  recordFirstTry(qData, qIdx, isOk);
  qData.answers[qIdx] = {
    checked: true,
    selectedOrig: origIdx,
    isCorrect: isOk,
    wrongMsg: isOk ? "" : ((q.wrongReasons && q.wrongReasons[origIdx]) || "Đáp án này chưa chính xác.")
  };
  saveState();
  renderQuizScreen(subject, storeKey);
}

function selectWordChip(btn, word) {
  document.querySelectorAll(".word-chip").forEach(c => c.classList.remove("selected"));
  btn.classList.add("selected");
  selectedChip = word;
}

function dragWordChip(ev, word) {
  selectedChip = word;
  ev.dataTransfer.setData("text/plain", word);
}

function dropChipToSlot(ev, subject, storeKey, qIdx, slotIdx) {
  ev.preventDefault();
  const word = ev.dataTransfer.getData("text/plain") || selectedChip;
  if (word) {
    selectedChip = word;
    placeChipToSlot(subject, storeKey, qIdx, slotIdx);
  }
}

function placeChipToSlot(subject, storeKey, qIdx, slotIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || {};
  if (!Array.isArray(cur.filled)) {
    cur.filled = Array(q.blanks.length).fill("");
  }
  if (cur.filled[slotIdx] && !selectedChip) {
    cur.filled[slotIdx] = "";
  } else if (selectedChip) {
    cur.filled[slotIdx] = selectedChip;
    selectedChip = null;
  }
  cur.checked = false;
  qData.answers[qIdx] = cur;
  saveState();
  renderQuizScreen(subject, storeKey);
}

function checkFill(subject, storeKey, qIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || {};
  if (!Array.isArray(cur.filled)) {
    cur.filled = Array(q.blanks.length).fill("");
  }
  const isOk = q.blanks.every((b, i) => cur.filled[i] === b);
  recordFirstTry(qData, qIdx, isOk);
  cur.checked = true;
  cur.isCorrect = isOk;
  qData.answers[qIdx] = cur;
  saveState();
  renderQuizScreen(subject, storeKey);
}

function moveSortItem(subject, storeKey, qIdx, idx, dir) {
  const qData = state.quizzes[storeKey];
  const arr = [...qData.answers[qIdx].order];
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
  qData.answers[qIdx] = { order: arr, checked: false, isCorrect: false };
  saveState();
  renderQuizScreen(subject, storeKey);
}

function checkSort(subject, storeKey, qIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const arr = qData.answers[qIdx].order;
  const wrongCount = arr.filter((item, i) => item !== q.items[i]).length;
  const isOk = wrongCount === 0;
  recordFirstTry(qData, qIdx, isOk);
  qData.answers[qIdx] = {
    order: arr,
    checked: true,
    isCorrect: isOk,
    wrongMsg: isOk ? "" : `Còn ${wrongCount} chỗ chưa đúng. Chỗ viền đỏ là chỗ cần sửa, chỗ viền xanh đã đúng.`
  };
  saveState();
  renderQuizScreen(subject, storeKey);
}

function setMatchVal(subject, storeKey, qIdx, leftIdx, val) {
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || { pairs: {} };
  if (!cur.pairs) cur.pairs = {};
  cur.pairs[leftIdx] = val;
  cur.checked = false;
  qData.answers[qIdx] = cur;
  saveState();
}

function checkMatch(subject, storeKey, qIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || { pairs: {} };
  const isOk = q.pairs.every((p, i) => cur.pairs && cur.pairs[i] === p.right);
  recordFirstTry(qData, qIdx, isOk);
  cur.checked = true;
  cur.isCorrect = isOk;
  qData.answers[qIdx] = cur;
  saveState();
  renderQuizScreen(subject, storeKey);
}

function setTfVal(subject, storeKey, qIdx, sIdx, val) {
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || { tf: {} };
  if (!cur.tf) cur.tf = {};
  cur.tf[sIdx] = val;
  cur.checked = false;
  qData.answers[qIdx] = cur;
  saveState();
  renderQuizScreen(subject, storeKey);
}

function checkTf(subject, storeKey, qIdx) {
  const q = activeQuiz.questions[qIdx];
  const qData = state.quizzes[storeKey];
  const cur = qData.answers[qIdx] || { tf: {} };
  const isOk = q.statements.every((st, i) => cur.tf && cur.tf[i] === st.answer);
  recordFirstTry(qData, qIdx, isOk);
  cur.checked = true;
  cur.isCorrect = isOk;
  qData.answers[qIdx] = cur;
  saveState();
  renderQuizScreen(subject, storeKey);
}

function renderQuizSummaryBox(subject, storeKey) {
  const qData = state.quizzes[storeKey];
  const total = activeQuiz.questions.length;
  const allSolved = activeQuiz.questions.every((_, i) => qData.answers[i] && qData.answers[i].isCorrect);
  const box = document.getElementById("quiz-result-card");

  if (!allSolved) {
    box.classList.add("hidden");
    return;
  }

  qData.completed = true;
  saveState();

  const firstOkCount = Object.values(qData.firstTry).filter(Boolean).length;
  const reviewList = activeQuiz.questions
    .map((_, i) => (!qData.firstTry[i] ? `Câu ${i + 1}` : null))
    .filter(Boolean);

  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="score-circle">
      <strong>${firstOkCount}/${total}</strong>
      <span>lần đầu</span>
    </div>
    <h3 style="margin:0 0 6px;color:var(--navy);">Con nắm được bài rồi!</h3>
    <p style="font-size:14px;color:var(--text-muted);margin:0 0 8px;">
      Con trả lời đúng ngay lần đầu ${firstOkCount} trên ${total} câu. Chỗ tô tím trong đoạn văn là câu chứa đáp án.
    </p>
    ${reviewList.length ? `<p style="font-size:14px;font-weight:700;color:#b91c1c;">Câu cần xem lại: ${reviewList.join(", ")}</p>` : ""}
    <div class="bottom-nav-actions">
      <button class="btn btn-outline" onclick="resetSingleQuiz('${subject}', '${storeKey}')">Làm lại đề này (trộn mới)</button>
      <button class="btn btn-primary" onclick="openSummary('${subject}', '${activeLesson.id}')">Xem lại ý chính</button>
    </div>
  `;
}

function resetSingleQuiz(subject, storeKey) {
  state.quizzes[storeKey] = { answers: {}, firstTry: {}, optOrders: {}, completed: false };
  initQuizShuffle(state.quizzes[storeKey]);
  saveState();
  renderQuizScreen(subject, storeKey);
}

/* BƯỚC 3: ĐỀ TỔNG HỢP BẤM GIỜ THANG 10 + XÁO TRỘN CÂU HỎI & ĐÁP ÁN */
function initExamShuffle(exam, exState) {
  if (!exState.qOrder || exState.qOrder.length !== exam.questions.length) {
    exState.qOrder = createShuffledOrder(exam.questions.length);
  }
  if (!exState.optOrders) exState.optOrders = {};
  exam.questions.forEach((q, origQIdx) => {
    if (!exState.optOrders[origQIdx]) {
      exState.optOrders[origQIdx] = createShuffledOrder(q.options.length);
    }
  });
}

function openExam(examId) {
  const exam = CURRICULUM.exams.find(e => e.id === examId);
  if (!state.exams[examId]) {
    state.exams[examId] = {
      studentName: "",
      studentClass: "",
      answers: {},
      qOrder: [],
      optOrders: {},
      remainingSec: exam.durationMinutes * 60,
      submitted: false
    };
  }
  initExamShuffle(exam, state.exams[examId]);
  saveState();
  const exState = state.exams[examId];

  document.getElementById("exam-intro").classList.remove("hidden");
  document.getElementById("exam-running").classList.add("hidden");
  document.getElementById("exam-result").classList.add("hidden");

  document.getElementById("exam-intro").innerHTML = `
    <h3 style="margin:0 0 6px;color:var(--navy);">${exam.title}</h3>
    <p style="font-size:14px;color:var(--text-muted);">${exam.desc}</p>
    <input id="inp-student-name" class="input-field" placeholder="Nhập Họ và tên học sinh..." value="${exState.studentName}" />
    <input id="inp-student-class" class="input-field" placeholder="Nhập Lớp (ví dụ: 7A1)..." value="${exState.studentClass}" />
    <button class="btn btn-primary btn-block" onclick="startExam('${examId}')">
      ${exState.submitted ? "Làm lại đề thi (trộn đề mới) →" : (Object.keys(exState.answers).length ? "Tiếp tục bài thi đang làm dở →" : "Bắt đầu tính giờ làm bài →")}
    </button>
  `;

  showView("view-exam", "Đề tổng hợp bấm giờ", `Thời gian: ${exam.durationMinutes} phút • Chấm thang 10`);
}

function startExam(examId) {
  const exam = CURRICULUM.exams.find(e => e.id === examId);
  let exState = state.exams[examId];
  const nameVal = document.getElementById("inp-student-name").value.trim() || "Học sinh 7";
  const classVal = document.getElementById("inp-student-class").value.trim() || "7";

  if (exState.submitted) {
    exState = {
      studentName: nameVal,
      studentClass: classVal,
      answers: {},
      qOrder: [],
      optOrders: {},
      remainingSec: exam.durationMinutes * 60,
      submitted: false
    };
  } else {
    exState.studentName = nameVal;
    exState.studentClass = classVal;
  }
  initExamShuffle(exam, exState);
  state.exams[examId] = exState;
  saveState();

  document.getElementById("exam-intro").classList.add("hidden");
  document.getElementById("exam-running").classList.remove("hidden");
  document.getElementById("exam-title-bar").textContent = `${exState.studentName} (${exState.studentClass})`;

  const qWrap = document.getElementById("exam-questions");
  qWrap.innerHTML = exState.qOrder.map((origQIdx, dispQIdx) => {
    const q = exam.questions[origQIdx];
    const optOrder = exState.optOrders[origQIdx];
    return `
      <div class="q-card">
        <div class="q-num">Câu ${dispQIdx + 1}</div>
        <p class="q-prompt">${q.q}</p>
        ${optOrder.map((origOptIdx, dispOptIdx) => `
          <button class="opt-btn ${exState.answers[origQIdx] === origOptIdx ? "correct" : ""}" id="ex-opt-${origQIdx}-${origOptIdx}" onclick="selectExamOpt('${examId}', ${origQIdx}, ${origOptIdx})">
            <span class="opt-letter">${String.fromCharCode(65 + dispOptIdx)}</span>
            <span>${q.options[origOptIdx]}</span>
          </button>
        `).join("")}
      </div>
    `;
  }).join("");

  document.getElementById("btn-submit-exam").onclick = () => submitExam(examId);

  if (examTimerInterval) clearInterval(examTimerInterval);
  updateTimerDisplay(exState.remainingSec);
  examTimerInterval = setInterval(() => {
    exState.remainingSec--;
    saveState();
    updateTimerDisplay(exState.remainingSec);
    if (exState.remainingSec <= 0) {
      clearInterval(examTimerInterval);
      submitExam(examId);
    }
  }, 1000);
}

function updateTimerDisplay(sec) {
  const m = String(Math.max(0, Math.floor(sec / 60))).padStart(2, "0");
  const s = String(Math.max(0, sec % 60)).padStart(2, "0");
  document.getElementById("exam-timer").textContent = `${m}:${s}`;
}

function selectExamOpt(examId, origQIdx, origOptIdx) {
  state.exams[examId].answers[origQIdx] = origOptIdx;
  saveState();
  const exam = CURRICULUM.exams.find(e => e.id === examId);
  exam.questions[origQIdx].options.forEach((_, i) => {
    document.getElementById(`ex-opt-${origQIdx}-${i}`).classList.toggle("correct", i === origOptIdx);
  });
}

function submitExam(examId) {
  if (examTimerInterval) clearInterval(examTimerInterval);
  const exam = CURRICULUM.exams.find(e => e.id === examId);
  const exState = state.exams[examId];

  let correctCount = 0;
  exam.questions.forEach((q, origQIdx) => {
    if (exState.answers[origQIdx] === q.answer) correctCount++;
  });

  const score10 = ((correctCount / exam.questions.length) * 10).toFixed(1);
  exState.submitted = true;
  exState.score10 = score10;
  saveState();

  if (GOOGLE_SCRIPT_URL) {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        name: exState.studentName,
        className: exState.studentClass,
        examTitle: exam.title,
        score: score10,
        correct: `${correctCount}/${exam.questions.length}`
      })
    }).catch(() => {});
  }

  document.getElementById("exam-running").classList.add("hidden");
  const resBox = document.getElementById("exam-result");
  resBox.classList.remove("hidden");

  const rowsHtml = exState.qOrder.map((origQIdx, dispQIdx) => {
    const q = exam.questions[origQIdx];
    const optOrder = exState.optOrders[origQIdx];
    const uOrigOpt = exState.answers[origQIdx];
    const isOk = uOrigOpt === q.answer;

    const uDispIdx = typeof uOrigOpt === "number" ? optOrder.indexOf(uOrigOpt) : -1;
    const cDispIdx = optOrder.indexOf(q.answer);

    const uText = uDispIdx >= 0 ? `${String.fromCharCode(65 + uDispIdx)}. ${q.options[uOrigOpt]}` : "Bỏ trống";
    const cText = `${String.fromCharCode(65 + cDispIdx)}. ${q.options[q.answer]}`;

    return `
      <tr style="background:${isOk ? "#f0fdf4" : "#fef2f2"};">
        <td><strong>Câu ${dispQIdx + 1}</strong></td>
        <td>${uText}</td>
        <td><strong>${cText}</strong><br><small>${q.explain}</small></td>
      </tr>
    `;
  }).join("");

  resBox.innerHTML = `
    <div class="result-card">
      <div class="score-circle">
        <strong>${score10}</strong>
        <span>thang 10</span>
      </div>
      <h3 style="margin:0 0 6px;">Kết quả của ${exState.studentName} (${exState.studentClass})</h3>
      <p style="margin:0 0 12px;">Đúng <strong>${correctCount}/${exam.questions.length}</strong> câu.</p>
      <button class="btn btn-outline" onclick="openExam('${examId}')">Làm lại đề này (trộn đề mới)</button>
    </div>
    <div class="card">
      <h4 style="margin:0 0 8px;color:var(--navy);">Bảng đáp án & Giải thích từng câu</h4>
      <table class="answer-table">
        <thead><tr><th>Câu</th><th>Con chọn</th><th>Đáp án đúng & Căn cứ</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function shuffleCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

renderHome();
