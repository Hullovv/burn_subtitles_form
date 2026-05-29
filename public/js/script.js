const availableFonts = [
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Arial Rounded MT Bold",
  "Baskerville",
  "Bauhaus 93",
  "Bell MT",
  "Berlin Sans FB",
  "Bernard MT Condensed",
  "Book Antiqua",
  "Bookman Old Style",
  "Bookshelf Symbol 7",
  "Bradley Hand ITC",
  "Britannic Bold",
  "Broadway",
  "Browallia New",
  "BrowalliaUPC",
  "Brush Script MT",
  "Calibri",
  "Calibri Light",
  "Californian FB",
  "Calisto MT",
  "Cambria",
  "Cambria Math",
  "Candara",
  "Century",
  "Century Gothic",
  "Century Schoolbook",
  "Chiller",
  "Colonna MT",
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Cooper Black",
  "Copperplate Gothic Bold",
  "Copperplate Gothic Light",
  "Corbel",
  "Courier New",
  "Curlz MT",
  "DaunPenh",
  "David",
  "DilleniaUPC",
  "DokChampa",
  "Dotum",
  "Ebrima",
  "Estrangelo Edessa",
  "EucrosiaUPC",
  "Euphemia",
  "FangSong",
  "Forte",
  "Franklin Gothic Medium",
  "FrankRuehl",
  "FreesiaUPC",
  "Gabriola",
  "Gadugi",
  "Garamond",
  "Gautami",
  "Georgia",
  "Gill Sans MT",
  "Gloucester MT Extra Condensed",
  "Goudy Old Style",
  "Goudy Stout",
  "Haettenschweiler",
  "Harlow Solid Italic",
  "Harrington",
  "High Tower Text",
  "Impact",
  "Informal Roman",
  "IrisUPC",
  "Iskoola Pota",
  "JasmineUPC",
  "Jokerman",
  "Juice ITC",
  "Kalinga",
  "Kartika",
  "Khmer UI",
  "KodchiangUPC",
  "Kokila",
  "Lao UI",
  "Latha",
  "Leelawadee",
  "Levenim MT",
  "LilyUPC",
  "Lucida Bright",
  "Lucida Calligraphy",
  "Lucida Console",
  "Lucida Fax",
  "Lucida Handwriting",
  "Lucida Sans",
  "Lucida Sans Typewriter",
  "Lucida Sans Unicode",
  "Magneto",
  "Maiandra GD",
  "Malgun Gothic",
  "Mangal",
  "Marlett",
  "Matura MT Script Capitals",
  "Meiryo",
  "Meiryo UI",
  "Microsoft Himalaya",
  "Microsoft JhengHei",
  "Microsoft New Tai Lue",
  "Microsoft PhagsPa",
  "Microsoft Sans Serif",
  "Microsoft Tai Le",
  "Microsoft Uighur",
  "Microsoft YaHei",
  "Microsoft Yi Baiti",
  "MingLiU",
  "MingLiU-ExtB",
  "MingLiU_HKSCS",
  "MingLiU_HKSCS-ExtB",
  "Miriam",
  "Miriam Fixed",
  "Mongolian Baiti",
  "MoolBoran",
  "MS Gothic",
  "MS Mincho",
  "MS PGothic",
  "MS PMincho",
  "MS UI Gothic",
  "MV Boli",
  "Myanmar Text",
  "Narkisim",
  "Neue Haas Grotesk Text Pro",
  "News Gothic MT",
  "Niagara Engraved",
  "Niagara Solid",
  "Nirmala UI",
  "NSimSun",
  "Nyala",
  "Palace Script MT",
  "Palatino Linotype",
  "Papyrus",
  "Parchment",
  "Perpetua",
  "Perpetua Titling MT",
  "Playbill",
  "PMingLiU",
  "PMingLiU-ExtB",
  "Poor Richard",
  "Pristina",
  "Raavi",
  "Ravie",
  "Rockwell",
  "Rockwell Condensed",
  "Rockwell Extra Bold",
  "Rod",
  "Sakkal Majalla",
  "Script MT Bold",
  "Segoe Print",
  "Segoe Script",
  "Segoe UI",
  "Segoe UI Historic",
  "Segoe UI Symbol",
  "Shonar Bangla",
  "Showcard Gothic",
  "SimHei",
  "Simplified Arabic",
  "Simplified Arabic Fixed",
  "SimSun",
  "SimSun-ExtB",
  "Sitka Banner",
  "Sitka Display",
  "Sitka Heading",
  "Sitka Small",
  "Sitka Subheading",
  "Sitka Text",
  "Snap ITC",
  "Stencil",
  "Sylfaen",
  "Symbol",
  "Tahoma",
  "Tempus Sans ITC",
  "Times New Roman",
  "Traditional Arabic",
  "Trebuchet MS",
  "Tunga",
  "Tw Cen MT",
  "Tw Cen MT Condensed",
  "Tw Cen MT Condensed Extra Bold",
  "Vani",
  "Verdana",
  "Vijaya",
  "Viner Hand ITC",
  "Vivaldi",
  "Vladimir Script",
  "Webdings",
  "Wide Latin",
  "Wingdings",
  "Wingdings 2",
  "Wingdings 3",
  "Yu Gothic",
  "Yu Gothic UI",
];

// DOM элементы
const fontSearch = document.getElementById("fontSearch");
const fontList = document.getElementById("fontList");
const selectedFont = document.getElementById("selectedFont");
const selectedFontDisplay = document.getElementById("selectedFontDisplay");
const fontSize = document.getElementById("fontSize");
const textColor = document.getElementById("textColor");
const outline = document.getElementById("outline");
const outlineValue = document.getElementById("outlineValue");
const outlineStatus = document.getElementById("outlineStatus");
const shadow = document.getElementById("shadow");
const shadowValue = document.getElementById("shadowValue");
const shadowStatus = document.getElementById("shadowStatus");
const subtitleText = document.getElementById("subtitleText");
const subtitleFile = document.getElementById("subtitleFile");
const previewBox = document.getElementById("previewBox");

let currentText = "Загрузите файл субтитров\nили выберите пример ниже";
let currentBg = "black";
let videoElement = null;
let currentFilteredFonts = [...availableFonts];

// Функция отображения списка шрифтов
function renderFontList(filter = "") {
  const filterLower = filter.toLowerCase();
  currentFilteredFonts = availableFonts.filter((font) =>
    font.toLowerCase().includes(filterLower),
  );

  if (currentFilteredFonts.length === 0) {
    fontList.innerHTML =
      '<div class="font-option" style="text-align: center; color: #999;">Шрифты не найдены</div>';
    return;
  }

  fontList.innerHTML = currentFilteredFonts
    .map(
      (font) => `
        <div class="font-option" data-font="${font}" onclick="selectFont('${font.replace(/'/g, "\\'")}')">
            <div class="font-preview" style="font-family: '${font}', Arial, sans-serif;">
                ${font} - Пример текста
            </div>
        </div>
    `,
    )
    .join("");
}

// Выбор шрифта
function selectFont(font) {
  selectedFont.value = font;
  selectedFontDisplay.innerHTML = `Выбран: <strong>${font}</strong> <span style="font-family: '${font}', Arial, sans-serif; margin-left: 10px;">(Пример: Абв)</span>`;
  fontSearch.value = font;
  fontList.classList.remove("show");
  updatePreview();
}

// Поиск шрифтов
fontSearch.addEventListener("input", function (e) {
  renderFontList(e.target.value);
  fontList.classList.add("show");
});

fontSearch.addEventListener("focus", function () {
  renderFontList(fontSearch.value);
  fontList.classList.add("show");
});

// Закрытие списка при клике вне
document.addEventListener("click", function (e) {
  if (!fontSearch.contains(e.target) && !fontList.contains(e.target)) {
    fontList.classList.remove("show");
  }
});

// Функция обновления предпросмотра
function updatePreview() {
  const font = selectedFont.value;
  const size = fontSize.value + "px";
  const color = getColorValue(textColor.value);
  const outlineWidth = parseInt(outline.value);
  const shadowSize = parseInt(shadow.value);

  // Сбрасываем все эффекты
  subtitleText.style.webkitTextStroke = "";
  subtitleText.style.textStroke = "";
  subtitleText.style.textShadow = "";

  // Применяем базовые стили
  subtitleText.style.fontFamily = `'${font}', Arial, sans-serif`;
  subtitleText.style.fontSize = size;
  subtitleText.style.color = color;
  subtitleText.style.fontWeight = "bold";
  subtitleText.style.letterSpacing = "0.5px";
  subtitleText.style.lineHeight = "1.5";

  // Эффект контура
  if (outlineWidth > 0) {
    const strokeWidth = outlineWidth + "px";
    subtitleText.style.webkitTextStroke = `${strokeWidth} rgba(0,0,0,0.8)`;
    subtitleText.style.textStroke = `${strokeWidth} rgba(0,0,0,0.8)`;
    outlineStatus.innerHTML = "✅ (активна)";
    outlineStatus.style.color = "#4caf50";
  } else {
    subtitleText.style.webkitTextStroke = "none";
    subtitleText.style.textStroke = "none";
    outlineStatus.innerHTML = "❌ (выключена)";
    outlineStatus.style.color = "#f44336";
  }

  // Эффект тени
  if (shadowSize > 0) {
    const shadowOffset = shadowSize * 1.5;
    const shadowBlur = shadowSize;
    const textShadow = `${shadowOffset}px ${shadowOffset}px ${shadowBlur}px rgba(0,0,0,0.8)`;
    subtitleText.style.textShadow = textShadow;
    shadowStatus.innerHTML = "✅ (активна)";
    shadowStatus.style.color = "#4caf50";
  } else {
    subtitleText.style.textShadow = "none";
    shadowStatus.innerHTML = "❌ (выключена)";
    shadowStatus.style.color = "#f44336";
  }
}

// Конвертация цвета FFmpeg в CSS цвет
function getColorValue(ffmpegColor) {
  const colorMap = {
    "&H00FFFFFF": "#FFFFFF",
    "&H0000FFFF": "#FFFF00",
    "&H00FF0000": "#FF0000",
    "&H0000FF00": "#00FF00",
    "&H000000FF": "#0000FF",
    "&H00FF00FF": "#FF00FF",
    "&H0000FFFF": "#FFA500",
  };
  return colorMap[ffmpegColor] || "#FFFFFF";
}

// Установка фона
function setBackground(type) {
  currentBg = type;

  document.querySelectorAll(".bg-option").forEach((opt) => {
    opt.classList.remove("selected");
  });
  document
    .querySelector(`.bg-option[data-bg="${type}"]`)
    .classList.add("selected");

  if (videoElement) {
    videoElement.pause();
    videoElement.remove();
    videoElement = null;
  }

  document.getElementById("videoBackground").style.display = "none";

  switch (type) {
    case "black":
      previewBox.style.background = "#000000";
      previewBox.style.backgroundImage = "none";
      document.querySelector(".preview-label").style.color = "white";
      break;
    case "white":
      previewBox.style.background = "#ffffff";
      previewBox.style.backgroundImage = "none";
      document.querySelector(".preview-label").style.color = "#333";
      break;
    case "gradient":
      previewBox.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      previewBox.style.backgroundImage =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      document.querySelector(".preview-label").style.color = "white";
      break;
    case "video":
      document.getElementById("videoBackground").style.display = "block";
      previewBox.style.background = "#2a2a2a";
      document.querySelector(".preview-label").style.color = "white";
      break;
  }

  const previewSubtitle = document.querySelector(".preview-subtitle");
  if (type === "white") {
    previewSubtitle.style.backgroundColor = "rgba(0,0,0,0.1)";
    previewSubtitle.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  } else {
    previewSubtitle.style.backgroundColor = "rgba(0,0,0,0.6)";
    previewSubtitle.style.boxShadow = "none";
  }
}

// Загрузка видео фона
function loadVideoBackground() {
  const videoUrl = document.getElementById("bgVideoUrl").value;
  if (!videoUrl) {
    alert("Введите URL видео для фона");
    return;
  }

  if (videoElement) {
    videoElement.pause();
    videoElement.remove();
  }

  videoElement = document.createElement("video");
  videoElement.src = videoUrl;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.style.position = "absolute";
  videoElement.style.top = "0";
  videoElement.style.left = "0";
  videoElement.style.width = "100%";
  videoElement.style.height = "100%";
  videoElement.style.objectFit = "cover";
  videoElement.style.borderRadius = "15px";

  previewBox.style.position = "relative";
  previewBox.style.overflow = "hidden";
  previewBox.insertBefore(videoElement, previewBox.firstChild);

  videoElement.play().catch((e) => console.log("Auto-play prevented:", e));
}

// Обновление значений слайдеров
outline.addEventListener("input", function () {
  outlineValue.textContent = this.value;
  updatePreview();
});

shadow.addEventListener("input", function () {
  shadowValue.textContent = this.value;
  updatePreview();
});

fontSize.addEventListener("input", updatePreview);
textColor.addEventListener("change", updatePreview);

// Установка примера текста
function setSampleText(text) {
  currentText = text;
  subtitleText.innerHTML = text.replace(/\n/g, "<br>");
  updatePreview();
}

// Загрузка первого субтитра из файла
function loadFirstSubtitle() {
  if (subtitleFile.files && subtitleFile.files[0]) {
    const file = subtitleFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      const lines = content.split("\n");
      let textLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (
          line &&
          !line.match(/^\d+$/) &&
          !line.match(/^\d{2}:\d{2}:\d{2}/) &&
          !line.includes("-->")
        ) {
          textLines.push(line);
          if (textLines.length >= 3) break;
        }
      }
      const subtitleContent = textLines.join("<br>") || "Субтитры загружены";
      setSampleText(subtitleContent);
    };
    reader.readAsText(file, "UTF-8");
  } else {
    alert("Пожалуйста, сначала выберите файл субтитров");
  }
}

// Обработка формы
const form = document.getElementById("burnForm");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", function (e) {
  const videoUrl = document.querySelector('input[name="video_url"]').value;
  if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
    e.preventDefault();
    alert("Пожалуйста, введите корректный URL видео");
    return;
  }

  loader.style.display = "block";
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Обработка...";
});

// Инициализация
renderFontList();
updatePreview();
setBackground("black");

// Установка шрифта по умолчанию
selectFont("Arial");
