const sourceText = document.querySelector("#sourceText");
const convertButton = document.querySelector("#convertButton");
const copyKatakanaButton = document.querySelector("#copyKatakanaButton");
const copyHiraganaButton = document.querySelector("#copyHiraganaButton");
const speakKatakanaButton = document.querySelector("#speakKatakanaButton");
const speakHiraganaButton = document.querySelector("#speakHiraganaButton");
const pinyinOutput = document.querySelector("#pinyinOutput");
const katakanaOutput = document.querySelector("#katakanaOutput");
const hiraganaOutput = document.querySelector("#hiraganaOutput");
const detailTableBody = document.querySelector("#detailTableBody");
const statusMessage = document.querySelector("#statusMessage");
const ttsStatusMessage = document.querySelector("#ttsStatusMessage");
const hiraganaReference = document.querySelector("#hiraganaReference");
const katakanaReference = document.querySelector("#katakanaReference");
const copyToast = document.querySelector("#copyToast");
const sampleButtons = document.querySelectorAll("[data-sample]");

const VOICEVOX_BASE_URL = "https://tts.537428.xyz";
const VOICEVOX_SPEAKER = 1;

const hanRunRegex = /[\p{Script=Han}]+/gu;
const punctuationRegex = /^[，。！？；：、,.!?;:）》】」』]$/;

const INITIALS = [
  "zh",
  "ch",
  "sh",
  "b",
  "p",
  "m",
  "f",
  "d",
  "t",
  "n",
  "l",
  "g",
  "k",
  "h",
  "j",
  "q",
  "x",
  "r",
  "z",
  "c",
  "s",
  "y",
  "w",
];

const ROW_MAP = {
  "": { a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ" },
  b: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ" },
  p: { a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ" },
  m: { a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ" },
  f: { a: "ファ", i: "フィ", u: "フ", e: "フェ", o: "フォ" },
  d: { a: "ダ", i: "ディ", u: "ドゥ", e: "デ", o: "ド" },
  t: { a: "タ", i: "ティ", u: "トゥ", e: "テ", o: "ト" },
  n: { a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ" },
  l: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ" },
  g: { a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ" },
  k: { a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ" },
  h: { a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ" },
  j: { a: "ジャ", i: "ジ", u: "ジュ", e: "ジェ", o: "ジョ" },
  q: { a: "チャ", i: "チ", u: "チュ", e: "チェ", o: "チョ" },
  x: { a: "シャ", i: "シ", u: "シュ", e: "シェ", o: "ショ" },
  zh: { a: "ヂャ", i: "ヂ", u: "ヂュ", e: "ヂェ", o: "ヂョ" },
  ch: { a: "チャ", i: "チ", u: "チュ", e: "チェ", o: "チョ" },
  sh: { a: "シャ", i: "シ", u: "シュ", e: "シェ", o: "ショ" },
  r: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ" },
  z: { a: "ザ", i: "ズィ", u: "ズ", e: "ゼ", o: "ゾ" },
  c: { a: "ツァ", i: "ツィ", u: "ツ", e: "ツェ", o: "ツォ" },
  s: { a: "サ", i: "スィ", u: "ス", e: "セ", o: "ソ" },
};

const SPECIAL_SYLLABLES = {
  zhi: "ヂ",
  chi: "チ",
  shi: "シ",
  ri: "リ",
  zi: "ズィ",
  ci: "ツィ",
  si: "スィ",
  er: "アル",
};

const COMPOSITION_RULES = [
  { finals: ["iang"], vowel: "i", suffix: "アン" },
  { finals: ["iong"], vowel: "i", suffix: "ヨン" },
  { finals: ["ian"], vowel: "i", suffix: "エン" },
  { finals: ["iao"], vowel: "i", suffix: "アオ" },
  { finals: ["ing"], vowel: "i", suffix: "ン" },
  { finals: ["in"], vowel: "i", suffix: "ン" },
  { finals: ["iu"], vowel: "i", suffix: "ウ" },
  { finals: ["ie"], vowel: "i", suffix: "エ" },
  { finals: ["ia"], vowel: "i", suffix: "ア" },
  { finals: ["i"], vowel: "i", suffix: "" },
  { finals: ["uang"], vowel: "u", suffix: "アン" },
  { finals: ["uan"], vowel: "u", suffix: "アン" },
  { finals: ["uai"], vowel: "u", suffix: "アイ" },
  { finals: ["ueng"], vowel: "u", suffix: "オン" },
  { finals: ["uo"], vowel: "u", suffix: "オ" },
  { finals: ["ua"], vowel: "u", suffix: "ア" },
  { finals: ["ui"], vowel: "u", suffix: "エイ" },
  { finals: ["un"], vowel: "u", suffix: "ン" },
  { finals: ["u"], vowel: "u", suffix: "" },
  { finals: ["van"], vowel: "u", suffix: "エン" },
  { finals: ["ve"], vowel: "u", suffix: "エ" },
  { finals: ["vn"], vowel: "u", suffix: "ン" },
  { finals: ["v"], vowel: "u", suffix: "" },
  { finals: ["ang"], vowel: "a", suffix: "ン" },
  { finals: ["an"], vowel: "a", suffix: "ン" },
  { finals: ["ai"], vowel: "a", suffix: "イ" },
  { finals: ["ao"], vowel: "a", suffix: "オ" },
  { finals: ["a"], vowel: "a", suffix: "" },
  { finals: ["eng"], vowel: "e", suffix: "ン" },
  { finals: ["en"], vowel: "e", suffix: "ン" },
  { finals: ["ei"], vowel: "e", suffix: "イ" },
  { finals: ["e"], vowel: "e", suffix: "" },
  { finals: ["ong"], vowel: "o", suffix: "ン" },
  { finals: ["ou"], vowel: "o", suffix: "ウ" },
  { finals: ["o"], vowel: "o", suffix: "" },
];

const KANA_REFERENCE_SECTIONS = [
  {
    title: "基础音",
    headers: ["a", "i", "u", "e", "o"],
    rows: [
      { label: "", hira: ["あ", "い", "う", "え", "お"], kata: ["ア", "イ", "ウ", "エ", "オ"] },
      { label: "k", hira: ["か", "き", "く", "け", "こ"], kata: ["カ", "キ", "ク", "ケ", "コ"] },
      { label: "s", hira: ["さ", "し", "す", "せ", "そ"], kata: ["サ", "シ", "ス", "セ", "ソ"] },
      { label: "t", hira: ["た", "ち", "つ", "て", "と"], kata: ["タ", "チ", "ツ", "テ", "ト"] },
      { label: "n", hira: ["な", "に", "ぬ", "ね", "の"], kata: ["ナ", "ニ", "ヌ", "ネ", "ノ"] },
      { label: "h", hira: ["は", "ひ", "ふ", "へ", "ほ"], kata: ["ハ", "ヒ", "フ", "ヘ", "ホ"] },
      { label: "m", hira: ["ま", "み", "む", "め", "も"], kata: ["マ", "ミ", "ム", "メ", "モ"] },
      { label: "y", hira: ["や", "", "ゆ", "", "よ"], kata: ["ヤ", "", "ユ", "", "ヨ"] },
      { label: "r", hira: ["ら", "り", "る", "れ", "ろ"], kata: ["ラ", "リ", "ル", "レ", "ロ"] },
      { label: "w", hira: ["わ", "", "", "", "を"], kata: ["ワ", "", "", "", "ヲ"] },
      { label: "n", hira: ["", "", "ん", "", ""], kata: ["", "", "ン", "", ""] },
    ],
  },
  {
    title: "浊音与半浊音",
    headers: ["a", "i", "u", "e", "o"],
    rows: [
      { label: "g", hira: ["が", "ぎ", "ぐ", "げ", "ご"], kata: ["ガ", "ギ", "グ", "ゲ", "ゴ"] },
      { label: "z", hira: ["ざ", "じ", "ず", "ぜ", "ぞ"], kata: ["ザ", "ジ", "ズ", "ゼ", "ゾ"] },
      { label: "d", hira: ["だ", "ぢ", "づ", "で", "ど"], kata: ["ダ", "ヂ", "ヅ", "デ", "ド"] },
      { label: "b", hira: ["ば", "び", "ぶ", "べ", "ぼ"], kata: ["バ", "ビ", "ブ", "ベ", "ボ"] },
      { label: "p", hira: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"], kata: ["パ", "ピ", "プ", "ペ", "ポ"] },
    ],
  },
  {
    title: "拗音",
    headers: ["ya", "yu", "yo"],
    rows: [
      { label: "ky", hira: ["きゃ", "きゅ", "きょ"], kata: ["キャ", "キュ", "キョ"] },
      { label: "sh", hira: ["しゃ", "しゅ", "しょ"], kata: ["シャ", "シュ", "ショ"] },
      { label: "ch", hira: ["ちゃ", "ちゅ", "ちょ"], kata: ["チャ", "チュ", "チョ"] },
      { label: "ny", hira: ["にゃ", "にゅ", "にょ"], kata: ["ニャ", "ニュ", "ニョ"] },
      { label: "hy", hira: ["ひゃ", "ひゅ", "ひょ"], kata: ["ヒャ", "ヒュ", "ヒョ"] },
      { label: "my", hira: ["みゃ", "みゅ", "みょ"], kata: ["ミャ", "ミュ", "ミョ"] },
      { label: "ry", hira: ["りゃ", "りゅ", "りょ"], kata: ["リャ", "リュ", "リョ"] },
      { label: "gy", hira: ["ぎゃ", "ぎゅ", "ぎょ"], kata: ["ギャ", "ギュ", "ギョ"] },
      { label: "j", hira: ["じゃ", "じゅ", "じょ"], kata: ["ジャ", "ジュ", "ジョ"] },
      { label: "by", hira: ["びゃ", "びゅ", "びょ"], kata: ["ビャ", "ビュ", "ビョ"] },
      { label: "py", hira: ["ぴゃ", "ぴゅ", "ぴょ"], kata: ["ピャ", "ピュ", "ピョ"] },
    ],
  },
  {
    title: "常用小假名",
    headers: ["a", "i", "u", "e", "o", "ya", "yu", "yo", "tsu", "wa", "ka", "ke"],
    rows: [
      {
        label: "small",
        hira: ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ", "ゎ", "ゕ", "ゖ"],
        kata: ["ァ", "ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ッ", "ヮ", "ヵ", "ヶ"],
      },
    ],
  },
];

const ttsState = {
  voice: null,
  isSpeaking: false,
  activeButton: null,
  audio: null,
  audioUrl: null,
};

let toastTimerId = null;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#8a2418" : "";
}

function setTtsStatus(message, isError = false) {
  ttsStatusMessage.textContent = message;
  ttsStatusMessage.style.color = isError ? "#8a2418" : "";
}

function showToast(message) {
  if (!copyToast) {
    return;
  }

  copyToast.textContent = message;
  copyToast.classList.add("visible");

  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
  }

  toastTimerId = window.setTimeout(() => {
    copyToast.classList.remove("visible");
  }, 1500);
}

function cleanupVoicevoxAudio() {
  if (ttsState.audio) {
    ttsState.audio.pause();
    ttsState.audio = null;
  }

  if (ttsState.audioUrl) {
    URL.revokeObjectURL(ttsState.audioUrl);
    ttsState.audioUrl = null;
  }
}

function normalizeSpeechText(text) {
  return text.replace(/\s+/g, "").trim();
}

async function copyText(value, successMessage, failureMessage) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(successMessage);
  } catch (error) {
    setStatus(failureMessage, true);
  }
}

function setSpeechButtonsEnabled(isEnabled) {
  speakKatakanaButton.disabled = !isEnabled;
  speakHiraganaButton.disabled = !isEnabled;
}

function setActiveSpeechButton(button) {
  [speakKatakanaButton, speakHiraganaButton].forEach((item) => {
    if (!item) {
      return;
    }

    item.textContent = item.dataset.defaultLabel || item.textContent;
    item.dataset.playing = "false";
  });

  ttsState.activeButton = button || null;

  if (button) {
    button.textContent = "正在播放...";
    button.dataset.playing = "true";
  }
}

function getJapaneseVoice() {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => /^ja[-_]?jp$/i.test(voice.lang)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ja")) ||
    null
  );
}

function refreshVoiceState() {
  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
    ttsState.voice = null;
    setSpeechButtonsEnabled(Boolean(VOICEVOX_BASE_URL));
    if (VOICEVOX_BASE_URL) {
      setTtsStatus("浏览器本地朗读不可用，将优先尝试 VOICEVOX 远端朗读。");
    } else {
      setTtsStatus("当前浏览器不支持语音朗读。", true);
    }
    return;
  }

  const japaneseVoice = getJapaneseVoice();
  ttsState.voice = japaneseVoice;

  if (japaneseVoice) {
    setSpeechButtonsEnabled(true);
    setTtsStatus("已找到日语语音，可以播放。");
    return;
  }

  setSpeechButtonsEnabled(true);
  setTtsStatus("未检测到专用日语语音，将尝试使用浏览器默认语音朗读。");
}

function detectInitial(syllable) {
  return INITIALS.find((item) => syllable.startsWith(item)) || "";
}

function canonicalizeSyllable(rawSyllable) {
  const syllable = rawSyllable.toLowerCase().replace(/u:/g, "v").replace(/ü/g, "v");
  let initial = detectInitial(syllable);
  let finals = syllable.slice(initial.length);

  if (initial === "y") {
    initial = "";
    if (!finals) {
      finals = "i";
    } else if (finals === "u") {
      finals = "v";
    } else if (finals === "ue") {
      finals = "ve";
    } else if (finals === "uan") {
      finals = "van";
    } else if (finals === "un") {
      finals = "vn";
    } else if (finals === "ong") {
      finals = "iong";
    } else if (finals === "ou") {
      finals = "iu";
    } else if (finals === "e") {
      finals = "ie";
    } else if (finals === "a") {
      finals = "ia";
    } else if (finals === "an") {
      finals = "ian";
    } else if (finals === "ang") {
      finals = "iang";
    } else if (finals === "ao") {
      finals = "iao";
    }
  }

  if (initial === "w") {
    initial = "";
    if (!finals) {
      finals = "u";
    } else if (finals === "o") {
      finals = "uo";
    } else if (finals === "a") {
      finals = "ua";
    } else if (finals === "ai") {
      finals = "uai";
    } else if (finals === "ei") {
      finals = "ui";
    } else if (finals === "an") {
      finals = "uan";
    } else if (finals === "ang") {
      finals = "uang";
    } else if (finals === "en") {
      finals = "un";
    } else if (finals === "eng") {
      finals = "ueng";
    }
  }

  if (["j", "q", "x"].includes(initial) && finals.startsWith("u")) {
    finals = `v${finals.slice(1)}`;
  }

  if ((initial === "n" || initial === "l") && ["ue", "uan", "un"].includes(finals)) {
    finals = finals.replace(/^u/, "v");
  }

  return { initial, finals };
}

function buildKatakana(initial, finals) {
  const combined = `${initial}${finals}`;
  if (SPECIAL_SYLLABLES[combined]) {
    return SPECIAL_SYLLABLES[combined];
  }

  const row = ROW_MAP[initial];
  if (!row) {
    return combined.toUpperCase();
  }

  const matchedRule = COMPOSITION_RULES.find((rule) => rule.finals.includes(finals));
  if (!matchedRule) {
    return combined.toUpperCase();
  }

  if (!initial && finals === "uo") {
    return "ウォ";
  }

  return `${row[matchedRule.vowel]}${matchedRule.suffix}`;
}

function katakanaToHiragana(text) {
  return Array.from(text, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x30a1 && code <= 0x30f6) {
      return String.fromCharCode(code - 0x60);
    }
    return char;
  }).join("");
}

function extractTokens(text) {
  const segments = [];
  let lastIndex = 0;

  for (const match of text.matchAll(hanRunRegex)) {
    const [run] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "raw", text: text.slice(lastIndex, index) });
    }

    const syllables = window.pinyinPro.pinyin(run, {
      toneType: "none",
      type: "array",
      v: true,
    });

    Array.from(run).forEach((char, charIndex) => {
      const pinyin = syllables[charIndex] || "";
      const { initial, finals } = canonicalizeSyllable(pinyin);
      const katakana = buildKatakana(initial, finals);
      const hiragana = katakanaToHiragana(katakana);

      segments.push({
        type: "han",
        char,
        pinyin,
        katakana,
        hiragana,
      });
    });

    lastIndex = index + run.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "raw", text: text.slice(lastIndex) });
  }

  return segments;
}

function formatOutput(segments, key) {
  return segments
    .map((segment, index) => {
      if (segment.type === "raw") {
        return segment.text;
      }

      const next = segments[index + 1];
      const currentText = segment[key];
      if (!next || next.type !== "han") {
        return currentText;
      }

      return `${currentText} `;
    })
    .join("")
    .replace(/\s+([，。！？；：、,.!?;:）》】」』])/g, "$1");
}

function renderTable(segments) {
  const rows = segments.filter((segment) => segment.type === "han");
  if (!rows.length) {
    detailTableBody.innerHTML = '<tr class="empty-row"><td colspan="4">这里会显示逐字对照。</td></tr>';
    return;
  }

  detailTableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.char}</td>
          <td>${row.pinyin}</td>
          <td>${row.katakana}</td>
          <td>${row.hiragana}</td>
        </tr>
      `
    )
    .join("");
}

function convertText() {
  const text = sourceText.value.trim();

  if (!window.pinyinPro || typeof window.pinyinPro.pinyin !== "function") {
    setStatus("拼音库加载失败，请确认网络可用后刷新页面。", true);
    return;
  }

  if (!text) {
    pinyinOutput.textContent = "";
    katakanaOutput.value = "";
    hiraganaOutput.value = "";
    renderTable([]);
    setStatus("先输入一句中文。");
    return;
  }

  const segments = extractTokens(text);
  const hanSegments = segments.filter((segment) => segment.type === "han");

  pinyinOutput.textContent = formatOutput(segments, "pinyin");
  katakanaOutput.value = formatOutput(segments, "katakana");
  hiraganaOutput.value = formatOutput(segments, "hiragana");
  renderTable(segments);

  if (!hanSegments.length) {
    setStatus("没有识别到中文字符，所以没有生成拟音。", true);
    return;
  }

  setStatus(`已生成 ${hanSegments.length} 个汉字的拟音结果。`);
}

async function copyResult(element, label) {
  const value = (typeof element.value === "string" ? element.value : element.textContent).trim();
  if (!value) {
    setStatus(`还没有可复制的${label}。`, true);
    return;
  }

  await copyText(value, "复制成功", `复制${label}失败，请手动复制。`);
}

async function speakWithVoicevox(text, button, label) {
  const audioQueryUrl = new URL("/audio_query", VOICEVOX_BASE_URL);
  audioQueryUrl.searchParams.set("text", text);
  audioQueryUrl.searchParams.set("speaker", String(VOICEVOX_SPEAKER));

  const audioQueryResponse = await fetch(audioQueryUrl, {
    method: "POST",
  });

  if (!audioQueryResponse.ok) {
    throw new Error(`audio_query failed: ${audioQueryResponse.status}`);
  }

  const audioQuery = await audioQueryResponse.json();

  const synthesisUrl = new URL("/synthesis", VOICEVOX_BASE_URL);
  synthesisUrl.searchParams.set("speaker", String(VOICEVOX_SPEAKER));

  const synthesisResponse = await fetch(synthesisUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(audioQuery),
  });

  if (!synthesisResponse.ok) {
    throw new Error(`synthesis failed: ${synthesisResponse.status}`);
  }

  const audioBlob = await synthesisResponse.blob();
  cleanupVoicevoxAudio();

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  ttsState.audio = audio;
  ttsState.audioUrl = audioUrl;

  audio.onplay = () => {
    ttsState.isSpeaking = true;
    setActiveSpeechButton(button);
    setTtsStatus(`正在使用 VOICEVOX 播放${label}...`);
  };

  audio.onended = () => {
    ttsState.isSpeaking = false;
    setActiveSpeechButton(null);
    cleanupVoicevoxAudio();
    setTtsStatus("VOICEVOX 远端朗读完成。");
  };

  audio.onerror = () => {
    ttsState.isSpeaking = false;
    setActiveSpeechButton(null);
    cleanupVoicevoxAudio();
    setTtsStatus("VOICEVOX 音频播放失败，将尝试浏览器本地朗读。", true);
  };

  await audio.play();
}

async function speakKana(text, button, label) {
  const speechText = normalizeSpeechText(text);

  if (!speechText) {
    setTtsStatus("当前没有可朗读的内容。", true);
    return;
  }

  cleanupVoicevoxAudio();

  if (VOICEVOX_BASE_URL) {
    try {
      if ("speechSynthesis" in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel();
      }

      await speakWithVoicevox(speechText, button, label);
      return;
    } catch (error) {
      setTtsStatus("VOICEVOX 不可用，已切换到浏览器本地朗读。", true);
    }
  }

  refreshVoiceState();

  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
    setTtsStatus("当前浏览器不支持语音朗读。", true);
    return;
  }

  const utterance = new window.SpeechSynthesisUtterance(speechText);
  utterance.lang = "ja-JP";
  if (ttsState.voice) {
    utterance.voice = ttsState.voice;
  }
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  utterance.onstart = () => {
    ttsState.isSpeaking = true;
    setActiveSpeechButton(button);
    setTtsStatus(`正在播放${label}...`);
  };

  utterance.onend = () => {
    ttsState.isSpeaking = false;
    setActiveSpeechButton(null);
    if (ttsState.voice) {
      setTtsStatus("已找到日语语音，可以播放。");
    } else {
      setTtsStatus("已使用浏览器默认语音朗读。");
    }
  };

  utterance.onerror = (event) => {
    const errorCode = event?.error || "";
    if (errorCode === "canceled" || errorCode === "interrupted") {
      return;
    }

    ttsState.isSpeaking = false;
    setActiveSpeechButton(null);
    setTtsStatus("日语朗读失败，请确认浏览器语音权限和语音包状态。", true);
  };

  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 40);
}

function buildKanaReferenceSection(section, type) {
  const tableClassName =
    section.headers.length > 5 ? "kana-reference-table compact-table" : "kana-reference-table";
  const headerCells = section.headers
    .map((header) => `<th scope="col">${header}</th>`)
    .join("");

  const rowMarkup = section.rows
    .map((row) => {
      const chars = row[type];
      const cells = chars
        .map((char) => {
          if (!char) {
            return '<td><span class="kana-char-empty">-</span></td>';
          }

          return `
            <td>
              <button class="kana-char-button" type="button" data-kana-char="${char}">
                ${char}
              </button>
            </td>
          `;
        })
        .join("");

      return `
        <tr>
          <th scope="row" class="row-label">${row.label}</th>
          ${cells}
        </tr>
      `;
    })
    .join("");

  return `
    <section class="kana-reference-section">
      <h3 class="kana-section-title">${section.title}</h3>
      <div class="kana-reference-table-wrap">
        <table class="${tableClassName}">
          <thead>
            <tr>
              <th></th>
              ${headerCells}
            </tr>
          </thead>
          <tbody>
            ${rowMarkup}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderKanaReferences() {
  if (!hiraganaReference || !katakanaReference) {
    return;
  }

  hiraganaReference.innerHTML = KANA_REFERENCE_SECTIONS.map((section) =>
    buildKanaReferenceSection(section, "hira")
  ).join("");

  katakanaReference.innerHTML = KANA_REFERENCE_SECTIONS.map((section) =>
    buildKanaReferenceSection(section, "kata")
  ).join("");
}

async function handleKanaReferenceClick(event) {
  const button = event.target.closest("[data-kana-char]");
  if (!button) {
    return;
  }

  const kanaChar = button.dataset.kanaChar;
  if (!kanaChar) {
    return;
  }

  await copyText(kanaChar, "复制成功", `复制 ${kanaChar} 失败，请手动复制。`);
}

speakKatakanaButton.dataset.defaultLabel = speakKatakanaButton.textContent.trim();
speakHiraganaButton.dataset.defaultLabel = speakHiraganaButton.textContent.trim();

convertButton.addEventListener("click", convertText);

copyKatakanaButton.addEventListener("click", () => {
  void copyResult(katakanaOutput, "片假名");
});

copyHiraganaButton.addEventListener("click", () => {
  void copyResult(hiraganaOutput, "平假名");
});

speakKatakanaButton.addEventListener("click", () => {
  void speakKana(katakanaOutput.value, speakKatakanaButton, "片假名");
});

speakHiraganaButton.addEventListener("click", () => {
  void speakKana(hiraganaOutput.value, speakHiraganaButton, "平假名");
});

sourceText.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    convertText();
  }
});

sampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sourceText.value = button.dataset.sample || "";
    convertText();
  });
});

hiraganaReference.addEventListener("click", handleKanaReferenceClick);
katakanaReference.addEventListener("click", handleKanaReferenceClick);

if ("speechSynthesis" in window) {
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoiceState);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshVoiceState;
  }
}

renderTable([]);
renderKanaReferences();
refreshVoiceState();
convertText();
