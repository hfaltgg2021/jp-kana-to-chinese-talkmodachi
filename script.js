const sourceText = document.querySelector("#sourceText");
const convertButton = document.querySelector("#convertButton");
const copyKatakanaButton = document.querySelector("#copyKatakanaButton");
const copyHiraganaButton = document.querySelector("#copyHiraganaButton");
const pinyinOutput = document.querySelector("#pinyinOutput");
const katakanaOutput = document.querySelector("#katakanaOutput");
const hiraganaOutput = document.querySelector("#hiraganaOutput");
const detailTableBody = document.querySelector("#detailTableBody");
const statusMessage = document.querySelector("#statusMessage");
const sampleButtons = document.querySelectorAll("[data-sample]");

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

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#8a2418" : "";
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
    katakanaOutput.textContent = "";
    hiraganaOutput.textContent = "";
    renderTable([]);
    setStatus("先输入一句中文。");
    return;
  }

  const segments = extractTokens(text);
  const hanSegments = segments.filter((segment) => segment.type === "han");

  pinyinOutput.textContent = formatOutput(segments, "pinyin");
  katakanaOutput.textContent = formatOutput(segments, "katakana");
  hiraganaOutput.textContent = formatOutput(segments, "hiragana");
  renderTable(segments);

  if (!hanSegments.length) {
    setStatus("没有识别到中文字符，所以没有生成拟音。", true);
    return;
  }

  setStatus(`已生成 ${hanSegments.length} 个汉字的拟音结果。`);
}

async function copyResult(element, label) {
  const value = element.textContent.trim();
  if (!value) {
    setStatus(`还没有可复制的${label}。`, true);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus(`${label}已复制到剪贴板。`);
  } catch (error) {
    setStatus(`复制${label}失败，请手动复制。`, true);
  }
}

convertButton.addEventListener("click", convertText);

copyKatakanaButton.addEventListener("click", () => {
  copyResult(katakanaOutput, "片假名");
});

copyHiraganaButton.addEventListener("click", () => {
  copyResult(hiraganaOutput, "平假名");
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

renderTable([]);
convertText();
