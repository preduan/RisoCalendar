
// Riso Portion

let dpi = 150;
let pageW = 8.5;
let pageH = 11;
let color1, color2;
const risoColors = ["red", "green", "blue", "yellow", "fluorescentpink", "orange", "aqua"];
let currentPic;

// complementary color map
const complementaryColors = {
  red: "yellow",
  green: "red",
  blue: "orange",
  yellow: "aqua",
  fluorescentpink: "green",
  orange: "yellow",
  aqua: "orange"
};

const month = 0;
const year = 2026;
const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Calendar layout constants (positions are relative to the canvas)
const calendarLeftInset = 100;   // x position for the month (from canvas left)
const calendarRightInset = 100;  // inset from canvas right for numeric day
const calendarTextY = 300;       // y position for month and numeric day (pixels from top)

let total = 12;
let pics = [];
let picDates = [];
let myFont;
let index = 0;

//preload
async function preload() {
  myFont = loadFont("VTCBayard-Regular.otf");
  await preloadPicsWithExif();
}

//preload images with ExIF
async function preloadPicsWithExif() {
  for (let i = 0; i < total; i++) {
    const url = `photos/${i}.jpg`;

    // Load p5 image for Riso processing
    const img = loadImage(url);
    pics.push(img);

    // Fetch raw binary data to read EXIF
    const exifDate = await getExifDate(url);
    picDates.push(exifDate || "Unknown");
    console.log(`Photo ${i} EXIF date:`, exifDate);
  }
}

//get EXIF date
async function getExifDate(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch", url);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();

    // Try ExifReader first (works for JPEG/HEIC when EXIF exists)
    let date = null;
    try {
      const tags = ExifReader.load(arrayBuffer);
      if (tags) {
        if (tags.DateTimeOriginal) date = tags.DateTimeOriginal.description || tags.DateTimeOriginal;
        else if (tags.DateTime) date = tags.DateTime.description || tags.DateTime;
        else if (tags.DateTimeDigitized) date = tags.DateTimeDigitized.description || tags.DateTimeDigitized;
      }
    } catch (e) {
      // ExifReader may throw on unsupported formats; we'll fallback below
      console.warn('ExifReader.load failed for', url, e);
    }

    // Fallback: try the local HEIC parser first, then the JPEG parser (if available)
    if (!date) {
      // Try HEIC-specific finder
      if (typeof findEXIFinHEIC === 'function') {
        try {
          const exifTagsHEIC = findEXIFinHEIC(arrayBuffer);
          if (exifTagsHEIC) {
            if (exifTagsHEIC.DateTimeOriginal) date = exifTagsHEIC.DateTimeOriginal;
            else if (exifTagsHEIC.DateTime) date = exifTagsHEIC.DateTime;
            if (date) console.log('EXIF date found via findEXIFinHEIC for', url, date);
          }
        } catch (e) {
          console.warn('findEXIFinHEIC failed for', url, e);
        }
      }

      // Then try JPEG/TIFF-style finder
      if (!date && typeof findEXIFinJPEG === 'function') {
        try {
          const exifTags = findEXIFinJPEG(arrayBuffer);
          if (exifTags) {
            if (exifTags.DateTimeOriginal) date = exifTags.DateTimeOriginal;
            else if (exifTags.DateTime) date = exifTags.DateTime;
            if (date) console.log('EXIF date found via findEXIFinJPEG for', url, date);
          }
        } catch (e) {
          console.warn('findEXIFinJPEG failed for', url, e);
        }
      }
    }

    // Final fallback: use Last-Modified header (useful for PNGs or files without EXIF)
    if (!date) {
      const lm = response.headers.get('last-modified') || response.headers.get('Last-Modified');
      if (lm) {
        date = lm; // Example: 'Mon, 02 Nov 2025 12:34:56 GMT'
      }
    }

    return date; // may be null if no metadata or headers available
  } catch (err) {
    console.error("Error reading EXIF:", err);
    return null;
  }
}

 //EXIF date parsing
  function parseExifDateString(raw) {
    if (!raw || raw === 'Unknown') return null;

    // If ExifReader returned an object with description, extract it
    if (typeof raw === 'object' && raw.description) raw = raw.description;
    if (typeof raw !== 'string') raw = String(raw);

    raw = raw.trim();

    // Common EXIF format: "YYYY:MM:DD HH:MM:SS"
    const exifDateMatch = raw.match(/^(\d{4}):(\d{2}):(\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
    if (exifDateMatch) {
      const y = parseInt(exifDateMatch[1], 10);
      const m = parseInt(exifDateMatch[2], 10) - 1; // JS months 0-11
      const d = parseInt(exifDateMatch[3], 10);
      const hh = exifDateMatch[4] ? parseInt(exifDateMatch[4], 10) : 0;
      const mm = exifDateMatch[5] ? parseInt(exifDateMatch[5], 10) : 0;
      const ss = exifDateMatch[6] ? parseInt(exifDateMatch[6], 10) : 0;
    // Construct as local time (camera EXIF timestamps are typically local to the device)
    return new Date(y, m, d, hh, mm, ss);
    }

    // Try RFC/ISO parseable strings (e.g., Last-Modified header)
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed;

    // Try swapping colons in the date portion and parse again
    const swapped = raw.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const parsed2 = new Date(swapped);
    if (!isNaN(parsed2.getTime())) return parsed2;

    return null;
  }

  function getPhotoDate(idx) {
    if (!Array.isArray(picDates) || idx < 0 || idx >= picDates.length) return null;
    return parseExifDateString(picDates[idx]);
  }

//setup
function setup() {
  createCanvas(8.5 * dpi, 11 * dpi, { willReadFrequently: true });
  pixelDensity(1);
  textFont(myFont);

  currentPic = pics[index];
  randomRisoColor(currentPic);
}

//random riso color picking
function randomRisoColor(img) {
  let avgColor = getAverageColor(img);
  let imgInk = pickClosestRiso(avgColor);
  let textInk = complementaryColors[imgInk];

  color1 = new Riso(imgInk);
  color2 = new Riso(textInk);
  console.log("Detected Hue:", avgColor, "Current inks:", imgInk, "and", textInk);
}

//avg color
function getAverageColor(img) {
  if (!img.pixels || img.pixels.length === 0) {
    img.loadPixels();
  }

  let r = 0, g = 0, b = 0;
  const numPixels = img.width * img.height;

  for (let i = 0; i < img.pixels.length; i += 4) {
    r += img.pixels[i];
    g += img.pixels[i + 1];
    b += img.pixels[i + 2];
  }

  r /= numPixels;
  g /= numPixels;
  b /= numPixels;

  return [r, g, b];
}

//pick the closest riso color
function pickClosestRiso([r, g, b]) {
  const colorMap = {
    red:  [255, 102, 94],
    green: [0, 169, 92],
    blue: [0, 120, 191],
    yellow: [255, 232, 0],
    fluorescentpink: [255, 72, 176],
    orange: [255, 108, 47],
    aqua: [94, 200, 229]
  };

  let closest = "red";
  let minDist = Infinity;
  for (let ink in colorMap) {
    const [cr, cg, cb] = colorMap[ink];
    let dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (dist < minDist) {
      minDist = dist;
      closest = ink;
    }
  }
  return closest;
}

//draw function
function draw() {
  background(250);
  clearRiso();
  // Compute a centered rectangle that preserves the image aspect ratio
  // and respects a uniform padding from each edge.
  // Padding is a fraction of the canvas (e.g. 0.05 = 5%).
  const paddingFraction = 0.05; // change this value to adjust padding
  //const textGap = 5; // fixed vertical gap (pixels) from image bottom to text
  const textSize = 220; // change to reduce/increase calendar text size
  const imageScaleFactor = 0.95; // extra multiplier to make image slightly smaller (0.0-1.0)

    let picX, picY, picWidth, picHeight;
    if (currentPic && currentPic.width && currentPic.height) {
      const canvasW = width;
      const canvasH = height;
      const imgW = currentPic.width;
      const imgH = currentPic.height;

      // Available space inside padding
  const availW = canvasW * (1 - 2 * paddingFraction);
  // Reserve vertical space for text below the image so text doesn't run off canvas.
  const reservedText = textSize + 20; // extra buffer
  const availH = canvasH * (1 - 2 * paddingFraction) - reservedText;

      // Scale to fit while preserving aspect ratio
  let scale = Math.min(availW / imgW, availH / imgH);
  // Apply a final scaling factor so images are slightly smaller than the available area.
  scale = scale * imageScaleFactor;
      picWidth = imgW * scale;
      picHeight = imgH * scale;

      // Center inside the canvas (margins will be equal because we used avail area)
      picX = (canvasW - picWidth) / 2;
      picY = (canvasH - picHeight) / 2;
    } else {
      // Fallback fixed placement if image not ready
      picX = (width - width * 0.5) / 2;
      picY = (height - height * 0.5) / 2;
      picWidth = width * 0.5;
      picHeight = height * 0.5;
    }
  if (pics.length > 0) {

  

    // Separate CMYK channels
    let cs = extractCMYKChannel(currentPic, "cyan");
    let ms = extractCMYKChannel(currentPic, "magenta");
    let ys = extractCMYKChannel(currentPic, "yellow");
    let bs = extractCMYKChannel(currentPic, "black");

    // Write to Riso layers
    color1.image(bs, picX, picY, picWidth, picHeight);
    color1.image(cs, picX, picY, picWidth, picHeight);
    color2.image(ms, picX, picY, picWidth, picHeight);
    color2.image(ys, picX, picY, picWidth, picHeight);
  }

  // Place text in a fixed gap below the centered image
  const textX = picX; // base reference
  let textY = picY + picHeight ;//+ textGap;

  color2.textSize(textSize);
  color2.fill(255);
  color2.textFont(myFont);

  // Map the photo's month/day into the calendar for the target year (2026)
  const photoDate = getPhotoDate(index);
  let displayMonth, displayDayNum, displayDayName;
  if (photoDate) {
    const m = photoDate.getMonth();
    const d = photoDate.getDate();
    displayMonth = months[m];
    displayDayNum = String(d);
    // Recalculate weekday for the target year (constant `year` defined above)
    displayDayName = days[new Date(year, m, d).getDay()];
  } else {
    displayMonth = months[month];
    displayDayNum = '31';
    displayDayName = days[0];
  }
   
  //year
  color2.text(year, width/2, 50);
  // Draw month and numeric day at canvas-relative positions (not tied to image)
  // Month (left side)
  color2.textAlign(LEFT, TOP);
  color2.text(displayMonth, calendarLeftInset, calendarTextY);

  // Numeric day (right side)
  color2.textAlign(RIGHT, TOP);
  color2.text(displayDayNum, width - calendarRightInset, calendarTextY);

  // Draw day name centered under the image
  color2.textAlign(CENTER, TOP);
  const dayNameX = picX + picWidth / 2;
  color2.text(displayDayName, dayNameX, textY);

  //   color2.text(days[0], 400, 600);
  //color2.cutout(color1);

  drawRiso();
}

//next image
function getImage() {
  index++;
  if (index === pics.length) index = 0;

  currentPic = pics[index];
  randomRisoColor(currentPic);

  clearRiso();
}

function keyPressed() {
  if (key === 's'){
    exportRiso();
  }

  if(key === 'n') {
    getImage();
  }
}
