"use strict";

/* ================================================================
 * かな → ローマ字 変換テーブル
 * 各エントリの先頭が画面表示に使う「おすすめ」表記。
 * それ以外の表記で打っても正解として受け付ける。
 * ================================================================ */
const KANA_TABLE = {
  "あ": ["a"], "い": ["i", "yi"], "う": ["u", "wu", "whu"], "え": ["e"], "お": ["o"],
  "か": ["ka", "ca"], "き": ["ki"], "く": ["ku", "cu", "qu"], "け": ["ke"], "こ": ["ko", "co"],
  "さ": ["sa"], "し": ["shi", "si", "ci"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
  "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
  "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
  "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
  "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
  "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
  "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
  "わ": ["wa"], "を": ["wo"], "ん": ["nn", "xn"],
  "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
  "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
  "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
  "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
  "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
  "ゔ": ["vu"],
  "ぁ": ["la", "xa"], "ぃ": ["li", "xi"], "ぅ": ["lu", "xu"], "ぇ": ["le", "xe"], "ぉ": ["lo", "xo"],
  "ゃ": ["lya", "xya"], "ゅ": ["lyu", "xyu"], "ょ": ["lyo", "xyo"],
  "きゃ": ["kya"], "きゅ": ["kyu"], "きょ": ["kyo"],
  "しゃ": ["sha", "sya"], "しゅ": ["shu", "syu"], "しょ": ["sho", "syo"],
  "ちゃ": ["cha", "tya", "cya"], "ちゅ": ["chu", "tyu", "cyu"], "ちょ": ["cho", "tyo", "cyo"],
  "にゃ": ["nya"], "にゅ": ["nyu"], "にょ": ["nyo"],
  "ひゃ": ["hya"], "ひゅ": ["hyu"], "ひょ": ["hyo"],
  "みゃ": ["mya"], "みゅ": ["myu"], "みょ": ["myo"],
  "りゃ": ["rya"], "りゅ": ["ryu"], "りょ": ["ryo"],
  "ぎゃ": ["gya"], "ぎゅ": ["gyu"], "ぎょ": ["gyo"],
  "じゃ": ["ja", "jya", "zya"], "じゅ": ["ju", "jyu", "zyu"], "じょ": ["jo", "jyo", "zyo"],
  "びゃ": ["bya"], "びゅ": ["byu"], "びょ": ["byo"],
  "ぴゃ": ["pya"], "ぴゅ": ["pyu"], "ぴょ": ["pyo"],
  "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
  "てぃ": ["thi"], "でぃ": ["dhi"], "でゅ": ["dhu"],
  "しぇ": ["she", "sye"], "ちぇ": ["che", "tye"], "じぇ": ["je", "zye"],
  "うぃ": ["wi"], "うぇ": ["we"], "うぉ": ["who"],
  "ー": ["-"], "、": [","], "。": ["."],
};

const SOKUON_KEYS = ["ltu", "xtu", "ltsu"];
const VOWELS_AND_SEMI = "aiueony"; // 「ん」を n 1打で確定できない後続文字

/* 単語リストは words.js で定義(自由に編集できます) */
const WORDS_PER_GAME = 10;

/* ================================================================
 * 女の子ごとの声の設定
 *   pitch: 声の高さ(1が標準) rate: 話す速さ tone: タイプ音の音程(Hz)
 * ================================================================ */
const GIRLS = {
  // sample あり: 録音ボイス(正タイプごとにセリフの切れ目単位で再生)
  "ちい":   { age: 21, photo: "img/chii.png", sample: "audio/chii.wav" },
  "れぇ":   { age: 22, photo: "img/ree.png", sample: "audio/ree.wav" },
  "れい":   { age: 19, photo: "img/rei.png", sample: "audio/rei.wav" },
  "かおり": { age: 26, photo: "img/kaori.png", sample: "audio/kaori.wav" },
  "みい":   { age: 24, photo: "img/mii.png", sample: "audio/mii.wav" },
  "りん":   { age: 19, photo: "img/nophoto.jpg", pitch: 1.0,  rate: 1.0,  tone: 620 },
  "ゆあ":   { age: 20, photo: "img/nophoto.jpg", pitch: 1.3,  rate: 1.05, tone: 760 },
  "ももか": { age: 22, photo: "img/nophoto.jpg", pitch: 1.15, rate: 0.95, tone: 700 },
  "みるく": { age: 18, photo: "img/nophoto.jpg", pitch: 1.5,  rate: 1.0,  tone: 880 },
  "さくら": { age: 24, photo: "img/nophoto.jpg", pitch: 1.05, rate: 0.9,  tone: 640 },
  "ここあ": { age: 19, photo: "img/nophoto.jpg", pitch: 1.4,  rate: 1.1,  tone: 820 },
  "れいな": { age: 26, photo: "img/nophoto.jpg", pitch: 0.85, rate: 0.95, tone: 560 },
  "じゅり": { age: 27, photo: "img/nophoto.jpg", pitch: 0.9,  rate: 1.15, tone: 590 },
  "あんな": { age: 23, photo: "img/nophoto.jpg", pitch: 1.1,  rate: 1.0,  tone: 680 },
  "せりな": { age: 25, photo: "img/nophoto.jpg", pitch: 0.95, rate: 0.85, tone: 600 },
  "らら":   { age: 18, photo: "img/nophoto.jpg", pitch: 1.45, rate: 1.2,  tone: 850 },
  "ひなの": { age: 20, photo: "img/nophoto.jpg", pitch: 1.25, rate: 0.9,  tone: 730 },
};
const DEFAULT_GIRL = { pitch: 1.1, rate: 1.0, tone: 700 };

const PRAISE_LINES = [
  "すごーい!", "じょうず!", "はやいね!", "いいかんじ!",
  "そのちょうし!", "さすがだね!", "もっといけるよ!",
];

/* 結果発表のセリフ(スコアから内部的にランクを判定して出し分け) */
const RANK_LINES = {
  S: "え、はやすぎ…!すごすぎて惚れちゃうかも❤︎",
  A: "じょうずだったよ〜!また指名してね?",
  B: "いい感じだったよ!次はもっと上いけそう",
  C: "おつかれさま!いっぱい練習して、また来てね",
  D: "今日はゆっくりできたね?…また会いに来てくれる?",
};

/* ---- タイプ音(Web Audio) ---- */
let audioCtx = null;

function playTone(freq, duration = 0.09, volume = 0.08, type = "sine") {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq * (0.96 + Math.random() * 0.08); // 毎回すこし揺らす
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) {
    /* 音が出せない環境では黙ってスキップ */
  }
}

/* ---- 録音ボイス(セリフの切れ目=無音部分で区切って再生) ---- */
const CHUNK_SEC = 1.0;        // フォールバック時の区切り幅
const SEG_WIN_SEC = 0.05;     // 音量を測る窓幅
const SEG_MIN_SILENCE = 0.25; // これ以上静かな時間が続いたら「切れ目」
const SEG_MIN_LEN = 0.6;      // セグメントの最短長(短すぎる断片は前とつなげる)
const SEG_PAD = 0.08;         // 切れ目の前後に残す余白

/* 波形を走査して無音で区切ったセグメント一覧 [{start, dur}] を作る */
function computeSegments(buffer) {
  const data = buffer.getChannelData(0);
  const sr = buffer.sampleRate;
  const win = Math.floor(sr * SEG_WIN_SEC);

  // 窓ごとの音量(RMS)
  const rms = [];
  for (let i = 0; i < data.length; i += win) {
    let sum = 0;
    const end = Math.min(i + win, data.length);
    for (let j = i; j < end; j++) sum += data[j] * data[j];
    rms.push(Math.sqrt(sum / (end - i)));
  }

  // 無音のしきい値: 平均音量の25%(最低ラインつき)
  const avg = rms.reduce((a, b) => a + b, 0) / rms.length;
  const threshold = Math.max(0.008, avg * 0.25);
  const minSilentWins = Math.max(1, Math.round(SEG_MIN_SILENCE / SEG_WIN_SEC));

  const segments = [];
  let segStart = null; // 秒
  let silentRun = 0;
  for (let w = 0; w < rms.length; w++) {
    const t = w * SEG_WIN_SEC;
    if (rms[w] >= threshold) {
      if (segStart === null) segStart = Math.max(0, t - SEG_PAD);
      silentRun = 0;
    } else if (segStart !== null) {
      silentRun += 1;
      if (silentRun >= minSilentWins) {
        const segEnd = t - (silentRun - 1) * SEG_WIN_SEC + SEG_PAD;
        pushSegment(segments, segStart, segEnd);
        segStart = null;
        silentRun = 0;
      }
    }
  }
  if (segStart !== null) pushSegment(segments, segStart, buffer.duration);
  return segments.length > 0 ? segments : [{ start: 0, dur: buffer.duration }];
}

function pushSegment(segments, start, end) {
  const dur = end - start;
  const prev = segments[segments.length - 1];
  if (dur < SEG_MIN_LEN && prev) {
    prev.dur = end - prev.start; // 短すぎる断片は直前とつなげる
  } else {
    segments.push({ start, dur });
  }
}

/* data:URL(base64)を ArrayBuffer に変換 */
function dataUrlToArrayBuffer(dataUrl) {
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

/* 音声全体をメモリに読み込む(波形解析と正確な切り出しのため)。
   埋め込みデータ(SAMPLE_DATA)があれば最優先で使う。file:// 直開きでも動く。
   どれも失敗した場合のみ playNextChunk が <audio> 方式にフォールバックする。 */
function loadSampleBuffer(girl) {
  if (girl._bufferPromise) return girl._bufferPromise;
  girl._bufferPromise = (async () => {
    try {
      let ab;
      if (typeof SAMPLE_DATA !== "undefined" && SAMPLE_DATA[girl.sample]) {
        ab = dataUrlToArrayBuffer(SAMPLE_DATA[girl.sample]);
      } else {
        ab = await fetch(girl.sample).then((res) => res.arrayBuffer());
      }
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = await audioCtx.decodeAudioData(ab);
      girl._buffer = buf;
      girl._segments = computeSegments(buf);
      return buf;
    } catch (_) {
      girl._buffer = null;
      return null;
    }
  })();
  return girl._bufferPromise;
}

function ensureSampleAudio(girl) {
  if (!girl._audio) {
    girl._audio = new Audio(girl.sample);
    girl._audio.preload = "auto";
    girl._chunk = 0;
    girl._timer = null;
  }
  return girl._audio;
}

function playNextChunk(girl) {
  if (girl._buffer && girl._segments) {
    // Web Audio: 次のセグメントを最後まで再生する(前の音声は止めない=重なってOK)
    const seg = girl._segments[girl._chunk % girl._segments.length];
    girl._chunk += 1;
    const src = audioCtx.createBufferSource();
    src.buffer = girl._buffer;
    src.connect(audioCtx.destination);
    src.start(0, seg.start, seg.dur);
    if (!girl._activeNodes) girl._activeNodes = new Set();
    girl._activeNodes.add(src);
    src.onended = () => girl._activeNodes.delete(src);
    return;
  }
  // フォールバック: <audio> のシークで1秒ずつ再生(毎回新しい再生機を作るので前の音は消えない)
  const base = ensureSampleAudio(girl); // メタデータ取得用
  const dur = base.duration;
  const chunkCount = Number.isFinite(dur) && dur > CHUNK_SEC ? Math.floor(dur / CHUNK_SEC) : 1;
  const index = girl._chunk % chunkCount;
  girl._chunk += 1;
  const audio = new Audio(girl.sample);
  try {
    audio.currentTime = index * CHUNK_SEC;
  } catch (_) {
    /* メタデータ読み込み前は先頭から */
  }
  audio.play().catch(() => {});
  if (!girl._fallbackAudios) girl._fallbackAudios = new Set();
  girl._fallbackAudios.add(audio);
  setTimeout(() => {
    audio.pause();
    girl._fallbackAudios.delete(audio);
  }, CHUNK_SEC * 1000);
}

function stopSample() {
  const girl = GIRLS[state.girlName];
  if (!girl) return;
  if (girl._activeNodes) {
    girl._activeNodes.forEach((src) => {
      try { src.stop(); } catch (_) { /* 停止済みなら無視 */ }
    });
    girl._activeNodes.clear();
  }
  if (girl._audio) {
    clearTimeout(girl._timer);
    girl._audio.pause();
  }
  if (girl._fallbackAudios) {
    girl._fallbackAudios.forEach((a) => a.pause());
    girl._fallbackAudios.clear();
  }
}

/* ---- 声(Web Speech API) ---- */
let jpVoice = null;

function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = speechSynthesis.getVoices();
  jpVoice = voices.find((v) => v.lang.startsWith("ja")) || null;
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const girl = GIRLS[state.girlName] || DEFAULT_GIRL;
  if (girl.sample) return; // 録音ボイスの子は合成音声を使わない
  const u = new SpeechSynthesisUtterance(text);
  if (jpVoice) u.voice = jpVoice;
  u.lang = "ja-JP";
  u.pitch = girl.pitch;
  u.rate = girl.rate;
  u.volume = 0.9;
  speechSynthesis.cancel(); // 前のセリフが残っていたら打ち切って新しい方を優先
  speechSynthesis.speak(u);
}

/* ================================================================
 * かな文字列 → トークン列
 * トークン = ローマ字候補のかたまり(拗音・促音は結合して1トークン)
 * ================================================================ */
function readUnit(kana, pos) {
  const two = kana.slice(pos, pos + 2);
  if (two.length === 2 && KANA_TABLE[two]) {
    return { kana: two, candidates: [...KANA_TABLE[two]], len: 2 };
  }
  const one = kana[pos];
  if (KANA_TABLE[one]) {
    return { kana: one, candidates: [...KANA_TABLE[one]], len: 1, isN: one === "ん" };
  }
  return { kana: one, candidates: [one.toLowerCase()], len: 1 };
}

function tokenize(kana) {
  const tokens = [];
  let i = 0;
  while (i < kana.length) {
    if (kana[i] === "っ") {
      const next = i + 1 < kana.length ? readUnit(kana, i + 1) : null;
      const canDouble = next && !next.isN && !"aiueo".includes(next.candidates[0][0]);
      if (canDouble) {
        const doubled = next.candidates.map((c) => c[0] + c);
        const explicit = SOKUON_KEYS.flatMap((s) => next.candidates.map((c) => s + c));
        tokens.push({ kana: "っ" + next.kana, candidates: [...doubled, ...explicit] });
        i += 1 + next.len;
      } else {
        tokens.push({ kana: "っ", candidates: [...SOKUON_KEYS] });
        i += 1;
      }
      continue;
    }
    const unit = readUnit(kana, i);
    tokens.push(unit);
    i += unit.len;
  }
  return tokens;
}

/* カタカナ→ひらがな(単語リスト追加時の保険) */
function toHiragana(str) {
  return str.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/* ================================================================
 * ゲーム状態
 * ================================================================ */
const state = {
  screen: "start",       // start | game | result
  girlName: "りん",      // 選んだ女の子
  words: [],
  wordIndex: 0,
  tokens: [],
  tokenIndex: 0,
  buf: "",               // 現在のトークンに対して打った文字
  correctKeys: 0,
  missKeys: 0,
  startTime: 0,
  endTime: 0,
  timerId: null,
};

const $ = (id) => document.getElementById(id);

/* ================================================================
 * キー入力の判定
 * 戻り値: "ok" | "miss" | "done"(単語完了)
 * ================================================================ */
function processKey(ch) {
  const tok = state.tokens[state.tokenIndex];
  if (!tok) return "miss";

  const attempt = state.buf + ch;
  const matched = tok.candidates.filter((c) => c.startsWith(attempt));

  if (matched.length > 0) {
    state.buf = attempt;
    if (matched.some((c) => c === attempt)) {
      completeToken(attempt);
      return state.tokenIndex >= state.tokens.length ? "done" : "ok";
    }
    return "ok";
  }

  // 「ん」を n 1打で確定 → 同じキーを次のトークンで再判定
  const nextTok = state.tokens[state.tokenIndex + 1];
  if (tok.isN && state.buf === "n" && nextTok && !VOWELS_AND_SEMI.includes(ch)) {
    if (nextTok.candidates.some((c) => c.startsWith(ch))) {
      completeToken("n");
      return processKey(ch);
    }
  }
  return "miss";
}

function completeToken(typed) {
  state.tokens[state.tokenIndex].typed = typed;
  state.tokenIndex += 1;
  state.buf = "";
}

/* 現在の入力状況に合わせたローマ字表示(入力済み / 残り) */
function romajiView() {
  let done = "";
  let rest = "";
  state.tokens.forEach((tok, idx) => {
    if (idx < state.tokenIndex) {
      done += tok.typed;
    } else if (idx === state.tokenIndex) {
      done += state.buf;
      const cand = tok.candidates.find((c) => c.startsWith(state.buf)) || tok.candidates[0];
      rest += cand.slice(state.buf.length);
    } else {
      rest += tok.candidates[0];
    }
  });
  return { done, rest };
}

/* ================================================================
 * 画面制御
 * ================================================================ */
function showScreen(name) {
  state.screen = name;
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  $("screen-" + name).classList.add("active");
  window.scrollTo(0, 0); // 一覧を下までスクロールした状態から切り替わっても上から見せる
}

function pickWords() {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, WORDS_PER_GAME);
}

function startGame(girlName) {
  if (girlName) state.girlName = girlName;
  const girl = GIRLS[state.girlName];
  if (girl && girl.sample) {
    loadSampleBuffer(girl); // 先読みしておく
    girl._chunk = 0; // 音声を最初から
  }
  state.words = pickWords();
  state.wordIndex = 0;
  state.correctKeys = 0;
  state.missKeys = 0;
  state.startTime = performance.now();
  $("hud-girl").textContent = state.girlName;
  loadWord();
  showScreen("game");
  clearInterval(state.timerId);
  state.timerId = setInterval(updateHud, 100);
  speak("よろしくね!");
}

function loadWord() {
  const word = state.words[state.wordIndex];
  state.tokens = tokenize(toHiragana(word.kana));
  state.tokenIndex = 0;
  state.buf = "";
  $("word-display").textContent = word.display;
  $("word-kana").textContent = word.kana;
  renderRomaji();
  updateHud();
}

function renderRomaji() {
  const { done, rest } = romajiView();
  $("romaji-done").textContent = done;
  $("romaji-rest").textContent = rest;
}

function updateHud() {
  $("hud-progress").textContent = `${state.wordIndex + 1} / ${state.words.length}`;
  $("hud-miss").textContent = state.missKeys;
  const sec = (performance.now() - state.startTime) / 1000;
  $("hud-time").textContent = sec.toFixed(1);
  $("progress-fill").style.width =
    (state.wordIndex / state.words.length) * 100 + "%";
}

function flashMiss() {
  const card = $("word-card");
  card.classList.remove("shake");
  void card.offsetWidth; // アニメーション再トリガー
  card.classList.add("shake");
  card.addEventListener(
    "animationend",
    () => card.classList.remove("shake"),
    { once: true }
  );
}

function finishGame() {
  state.endTime = performance.now();
  clearInterval(state.timerId);

  const sec = (state.endTime - state.startTime) / 1000;
  const kpm = Math.round((state.correctKeys / sec) * 60);
  const total = state.correctKeys + state.missKeys;
  const acc = total > 0 ? (state.correctKeys / total) * 100 : 100;

  const line = RANK_LINES[rankOf(kpm, acc)];
  $("serif-name").textContent = state.girlName;
  $("result-serif").textContent = line;
  $("result-time").textContent = sec.toFixed(1) + " 秒";
  $("result-kpm").textContent = String(kpm);
  $("result-acc").textContent = acc.toFixed(1) + " %";
  $("result-miss").textContent = String(state.missKeys);
  showScreen("result");
  speak(line.replace(/[❤︎♡]/g, "")); // 記号は読み上げない
}

function rankOf(kpm, acc) {
  const score = kpm * (acc / 100);
  if (score >= 360) return "S";
  if (score >= 280) return "A";
  if (score >= 200) return "B";
  if (score >= 120) return "C";
  return "D";
}

/* ================================================================
 * キーイベント
 * ================================================================ */
/* 女の子一覧のカードを生成 */
function renderGirlList() {
  const list = $("girl-list");
  list.innerHTML = "";
  Object.entries(GIRLS).forEach(([name, girl]) => {
    const btn = document.createElement("button");
    btn.className = "girl";
    const hasPhoto = girl.photo !== "img/nophoto.jpg";
    const status = hasPhoto ? '<span class="girl-status">待機中</span>' : "";
    btn.innerHTML =
      `<span class="girl-photo"><img src="${girl.photo}" alt="${name}">${status}</span>` +
      `<span class="girl-name">${name} <span class="girl-age">(${girl.age})</span></span>`;
    btn.addEventListener("click", () => {
      btn.blur(); // スペースキーがボタン再クリックにならないように
      startGame(name);
    });
    list.appendChild(btn);
  });
}
renderGirlList();

$("btn-home").addEventListener("click", () => {
  showScreen("start");
});

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (state.screen === "start") return; // スタートは女の子の名前をクリック

  if (state.screen === "result") {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      startGame();
    }
    return;
  }

  // ゲーム中
  if (e.key === "Escape") {
    clearInterval(state.timerId);
    stopSample();
    showScreen("start");
    return;
  }
  if (e.key.length !== 1) return;
  e.preventDefault();

  const girl = GIRLS[state.girlName] || DEFAULT_GIRL;
  const result = processKey(e.key.toLowerCase());
  if (result === "miss") {
    state.missKeys += 1;
    flashMiss();
    playTone(180, 0.12, 0.06, "square"); // 低いブブッという音
  } else {
    state.correctKeys += 1;
    if (girl.sample) {
      playNextChunk(girl); // 録音ボイスを1秒ぶん再生して次へ進む
    } else {
      playTone(girl.tone); // その子の音程でポンと鳴る
    }
    if (result === "done") {
      state.wordIndex += 1;
      speak(PRAISE_LINES[Math.floor(Math.random() * PRAISE_LINES.length)]);
      if (state.wordIndex >= state.words.length) {
        finishGame();
        return;
      }
      loadWord();
    }
  }
  renderRomaji();
  updateHud();
});
