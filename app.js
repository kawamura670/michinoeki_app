// 都道府県の表示順序（北から南）
const PREF_ORDER = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県",
  "三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

const MANUAL_KEY = "michinoeki_manual_progress";
const DISMISS_KEY = "michinoeki_dismissed_new";

function loadManual() {
  try {
    return JSON.parse(localStorage.getItem(MANUAL_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveManual(data) {
  localStorage.setItem(MANUAL_KEY, JSON.stringify(data));
}

function loadDismissed() {
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveDismissed(arr) {
  localStorage.setItem(DISMISS_KEY, JSON.stringify(arr));
}

function getVisitInfo(id) {
  const manual = loadManual();
  if (manual[id]) return manual[id];
  if (PROGRESS_DATA[id]) return PROGRESS_DATA[id];
  return null;
}

function setVisited(id, visited, photo) {
  const manual = loadManual();
  if (visited) {
    const today = new Date().toISOString().slice(0, 10);
    const entry = { visited: true, date: today, note: "" };
    if (photo) entry.photo = photo;
    else if (manual[id] && manual[id].photo) entry.photo = manual[id].photo;
    manual[id] = entry;
  } else {
    manual[id] = { visited: false };
  }
  saveManual(manual);
}

const openPrefs = new Set();

function render() {
  renderBanner();
  renderSummary();
  renderList();
}

function renderBanner() {
  const banner = document.getElementById("new-banner");
  const dismissed = loadDismissed();
  const newStations = MICHINOEKI_DATA.filter(s => s.isNew && !dismissed.includes(s.id));
  if (newStations.length === 0) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  const names = newStations.map(s => `${s.pref} ${s.name}`).join("、");
  banner.innerHTML = `新しく道の駅が追加されました: ${names} <button id="dismiss-new">確認した</button>`;
  document.getElementById("dismiss-new").addEventListener("click", () => {
    const ids = newStations.map(s => s.id);
    saveDismissed([...dismissed, ...ids]);
    renderBanner();
  });
}

function renderSummary() {
  const total = MICHINOEKI_DATA.length;
  let visited = 0;
  MICHINOEKI_DATA.forEach(s => {
    const info = getVisitInfo(s.id);
    if (info && info.visited) visited++;
  });
  const pct = total ? Math.round((visited / total) * 1000) / 10 : 0;
  document.getElementById("overall-summary").innerHTML =
    `<span class="big">${visited} / ${total}</span> 駅 訪問済み（${pct}%）`;
}

function renderList() {
  const searchTerm = document.getElementById("search").value.trim();
  const filter = document.getElementById("filter").value;
  const container = document.getElementById("pref-list");
  container.innerHTML = "";

  const grouped = {};
  MICHINOEKI_DATA.forEach(s => {
    if (!grouped[s.pref]) grouped[s.pref] = [];
    grouped[s.pref].push(s);
  });

  const prefs = PREF_ORDER.filter(p => grouped[p]);

  prefs.forEach(pref => {
    let stations = grouped[pref];

    // フィルタ適用後のリスト
    const filtered = stations.filter(s => {
      const info = getVisitInfo(s.id);
      const isVisited = !!(info && info.visited);
      if (filter === "visited" && !isVisited) return false;
      if (filter === "unvisited" && isVisited) return false;
      if (filter === "new" && !s.isNew) return false;
      if (searchTerm) {
        const hay = `${s.name} ${s.location} ${s.pref}`;
        if (!hay.includes(searchTerm)) return false;
      }
      return true;
    });

    if (filtered.length === 0) return;

    const visitedCount = stations.filter(s => {
      const info = getVisitInfo(s.id);
      return info && info.visited;
    }).length;
    const pct = Math.round((visitedCount / stations.length) * 100);

    const card = document.createElement("div");
    card.className = "pref-card";

    const header = document.createElement("div");
    header.className = "pref-header";
    header.innerHTML = `
      <div class="pref-name">${pref} <span class="pref-progress-text">${visitedCount} / ${stations.length}（${pct}%）</span></div>
      <span class="chevron">▶</span>
    `;

    const bar = document.createElement("div");
    bar.className = "pref-bar";
    bar.innerHTML = `<div class="pref-bar-fill" style="width:${pct}%"></div>`;

    const list = document.createElement("div");
    list.className = "station-list";

    filtered.forEach(s => {
      const info = getVisitInfo(s.id);
      const isVisited = !!(info && info.visited);
      const row = document.createElement("div");
      row.className = "station-row" + (isVisited ? " visited" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = isVisited;
      checkbox.addEventListener("change", (e) => {
        setVisited(s.id, e.target.checked);
        render();
      });

      const infoDiv = document.createElement("div");
      infoDiv.className = "station-info";
      const newBadge = s.isNew ? `<span class="badge-new">新着</span>` : "";
      infoDiv.innerHTML = `
        <div class="station-name">${s.name}${newBadge}</div>
        <div class="station-meta">${s.location}（${s.round} / ${s.date}登録）</div>
        ${isVisited && info.date ? `<div class="visited-date">訪問日: ${info.date}${info.note ? " - " + info.note : ""}</div>` : ""}
        ${isVisited && info.photo ? `<img class="station-photo" src="${info.photo}" alt="スタンプ写真">` : ""}
      `;

      row.appendChild(checkbox);
      row.appendChild(infoDiv);
      list.appendChild(row);
    });

    if (openPrefs.has(pref)) {
      card.classList.add("open");
      list.classList.add("open");
      header.querySelector(".chevron").textContent = "▼";
    }

    header.addEventListener("click", () => {
      card.classList.toggle("open");
      list.classList.toggle("open");
      const isOpen = list.classList.contains("open");
      header.querySelector(".chevron").textContent = isOpen ? "▼" : "▶";
      if (isOpen) openPrefs.add(pref);
      else openPrefs.delete(pref);
    });

    card.appendChild(header);
    card.appendChild(bar);
    card.appendChild(list);
    container.appendChild(card);
  });
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("filter").addEventListener("change", render);

// ---- スタンプ記録モーダル ----
const stampModal = document.getElementById("stamp-modal");
const stampPhotoInput = document.getElementById("stamp-photo");
const stampPreview = document.getElementById("stamp-preview");
const stampSearch = document.getElementById("stamp-search");
const stampResults = document.getElementById("stamp-results");
const stampSelected = document.getElementById("stamp-selected");
const stampConfirm = document.getElementById("stamp-confirm");

let stampPhotoData = null;
let stampSelectedId = null;

document.getElementById("open-stamp-btn").addEventListener("click", () => {
  resetStampModal();
  stampModal.hidden = false;
});

document.getElementById("stamp-cancel").addEventListener("click", () => {
  stampModal.hidden = true;
});

function resetStampModal() {
  stampPhotoData = null;
  stampSelectedId = null;
  stampPhotoInput.value = "";
  stampPreview.hidden = true;
  stampSearch.value = "";
  stampResults.innerHTML = "";
  stampSelected.textContent = "";
  stampConfirm.disabled = true;
}

stampPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  const reader = new FileReader();
  reader.onload = (ev) => {
    img.onload = () => {
      // 画像を縮小してデータ量を抑える
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      stampPhotoData = canvas.toDataURL("image/jpeg", 0.7);
      stampPreview.src = stampPhotoData;
      stampPreview.hidden = false;
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

stampSearch.addEventListener("input", () => {
  const term = stampSearch.value.trim();
  stampResults.innerHTML = "";
  if (!term) return;
  const matches = MICHINOEKI_DATA.filter(s =>
    `${s.name} ${s.pref} ${s.location}`.includes(term)
  ).slice(0, 20);
  matches.forEach(s => {
    const div = document.createElement("div");
    div.textContent = `${s.pref} - ${s.name}（${s.location}）`;
    div.addEventListener("click", () => {
      stampSelectedId = s.id;
      stampSelected.textContent = `選択中: ${s.pref} ${s.name}`;
      stampResults.innerHTML = "";
      stampSearch.value = `${s.pref} ${s.name}`;
      stampConfirm.disabled = false;
    });
    stampResults.appendChild(div);
  });
});

stampConfirm.addEventListener("click", () => {
  if (stampSelectedId === null) return;
  setVisited(stampSelectedId, true, stampPhotoData);
  stampModal.hidden = true;
  render();
});

// ---- バックアップの書き出し・読み込み ----
document.getElementById("export-btn").addEventListener("click", () => {
  const data = {
    manual: loadManual(),
    dismissed: loadDismissed(),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `michinoeki_backup_${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.manual) saveManual(data.manual);
      if (data.dismissed) saveDismissed(data.dismissed);
      render();
      alert("バックアップを読み込みました");
    } catch (err) {
      alert("読み込みに失敗しました。ファイルを確認してください。");
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

// ---- 音声でチェック ----
const voiceModal = document.getElementById("voice-modal");
const voiceStatus = document.getElementById("voice-status");
const voiceRecognized = document.getElementById("voice-recognized");
const voiceMatches = document.getElementById("voice-matches");
const voiceDoneMsg = document.getElementById("voice-done-msg");
const voiceMicBtn = document.getElementById("voice-mic");

let recognition = null;
let isListening = false;

function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = "ja-JP";
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 3;
  return rec;
}

function normalizeForMatch(str) {
  return str
    .replace(/[\s　]+/g, "")
    .replace(/[ぁ-ん]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
    .toLowerCase();
}

function scoreMatch(spoken, stationName) {
  const a = normalizeForMatch(spoken);
  const b = normalizeForMatch(stationName);
  if (a === b) return 100;
  if (b.includes(a) || a.includes(b)) return 80;
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  let matched = 0;
  let pos = 0;
  for (const ch of shorter) {
    const idx = longer.indexOf(ch, pos);
    if (idx !== -1) { matched++; pos = idx + 1; }
  }
  return Math.round((matched / longer.length) * 70);
}

function findMatches(text) {
  if (!text.trim()) return [];
  const results = MICHINOEKI_DATA.map(s => ({
    station: s,
    score: Math.max(scoreMatch(text, s.name), scoreMatch(text, s.pref + s.name))
  }));
  results.sort((a, b) => b.score - a.score);
  return results.filter(r => r.score >= 30).slice(0, 8);
}

function showMatches(matches) {
  voiceMatches.innerHTML = "";
  matches.forEach(m => {
    const info = getVisitInfo(m.station.id);
    const alreadyVisited = !!(info && info.visited);
    const item = document.createElement("div");
    item.className = "voice-match-item" + (alreadyVisited ? " checked" : "");
    item.innerHTML = `
      <span class="voice-match-name">${m.station.name}</span>
      <span class="voice-match-pref">${m.station.pref}</span>
      <span class="voice-match-score">${alreadyVisited ? "✅ 済" : "タップでチェック"}</span>
    `;
    if (!alreadyVisited) {
      item.addEventListener("click", () => {
        setVisited(m.station.id, true);
        item.classList.add("checked");
        item.querySelector(".voice-match-score").textContent = "✅ 済";
        voiceDoneMsg.textContent = `✅ ${m.station.pref} ${m.station.name} をチェックしました！`;
        voiceDoneMsg.hidden = false;
        setTimeout(() => { voiceDoneMsg.hidden = true; }, 3000);
        render();
      });
    }
    voiceMatches.appendChild(item);
  });
}

function startListening() {
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) {
      voiceStatus.textContent = "お使いのブラウザは音声認識に対応していません（Chrome推奨）";
      return;
    }
  }

  recognition.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    const display = final || interim;
    voiceRecognized.textContent = `「${display}」`;
    const matches = findMatches(display);
    showMatches(matches);
  };

  recognition.onend = () => {
    isListening = false;
    voiceMicBtn.textContent = "🎤 聴き取り開始";
    voiceMicBtn.classList.remove("recording");
    voiceStatus.textContent = "もう一度読み上げるにはマイクボタンを押してください";
    voiceStatus.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    isListening = false;
    voiceMicBtn.textContent = "🎤 聴き取り開始";
    voiceMicBtn.classList.remove("recording");
    voiceStatus.classList.remove("listening");
    if (event.error === "not-allowed") {
      voiceStatus.textContent = "マイクの使用が許可されていません。ブラウザの設定を確認してください";
    } else if (event.error === "no-speech") {
      voiceStatus.textContent = "音声が検出されませんでした。もう一度お試しください";
    } else {
      voiceStatus.textContent = "エラーが発生しました。もう一度お試しください";
    }
  };

  recognition.start();
  isListening = true;
  voiceMicBtn.textContent = "⏹ 聴き取り中...";
  voiceMicBtn.classList.add("recording");
  voiceStatus.textContent = "🔴 聴いています... 道の駅名を読み上げてください";
  voiceStatus.classList.add("listening");
  voiceDoneMsg.hidden = true;
}

function stopListening() {
  if (recognition) recognition.stop();
  isListening = false;
}

document.getElementById("voice-btn").addEventListener("click", () => {
  voiceRecognized.textContent = "";
  voiceMatches.innerHTML = "";
  voiceDoneMsg.hidden = true;
  voiceStatus.textContent = "マイクボタンを押して道の駅名を読み上げてください";
  voiceStatus.classList.remove("listening");
  voiceMicBtn.textContent = "🎤 聴き取り開始";
  voiceMicBtn.classList.remove("recording");
  voiceModal.hidden = false;
});

voiceMicBtn.addEventListener("click", () => {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
});

document.getElementById("voice-close").addEventListener("click", () => {
  stopListening();
  voiceModal.hidden = true;
});

render();
