/* ------------------------------------------------------------
   Video gallery configuration
------------------------------------------------------------ */
const videoPairs = [
  {
    sourceA: "videos/video1A.mp4",
    sourceB: "videos/video1B.mp4",
    titleA : "Source A - Video 1",
    titleB : "Source B - Video 1"
  },
  {
    sourceA: "videos/video2A.mp4",
    sourceB: "videos/video2B.mp4",
    titleA : "Source A - Video 2",
    titleB : "Source B - Video 2"
  },
  // …add more pairs here…
];

let currentPairIndex = 0;
const totalPairs      = videoPairs.length;

/* ------------------------------------------------------------
   DOM look-ups
------------------------------------------------------------ */
/* Regular gallery */
const videoA        = document.getElementById("videoA");
const videoB        = document.getElementById("videoB");
const sourceATitle  = document.getElementById("sourceATitle");
const sourceBTitle  = document.getElementById("sourceBTitle");
const pagination    = document.getElementById("pagination");          // ◉◉◉ dots

/* Slider gallery */
const sliderVideoA  = document.getElementById("sliderVideoA");
const sliderVideoB  = document.getElementById("sliderVideoB");
const sliderTitleA  = document.getElementById("sliderTitleA");
const sliderTitleB  = document.getElementById("sliderTitleB");
const sliderPagination = document.getElementById("sliderPagination"); // ◉◉◉ dots

/* ------------------------------------------------------------
   Helpers for dot indicators
------------------------------------------------------------ */
function renderDots(container, total) {
  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToPair(i)); // optional click-to-jump
    container.appendChild(dot);
  }
}

function updateDots(container, index) {
  container
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("active", i === index));
}

/* ------------------------------------------------------------
   Regular gallery loader
------------------------------------------------------------ */
function loadCurrentVideoPair() {
  const { sourceA, sourceB, titleA, titleB } = videoPairs[currentPairIndex];

  /* 1) swap <source> tags */
  videoA.innerHTML = `<source src="${sourceA}" type="video/mp4">`;
  videoB.innerHTML = `<source src="${sourceB}" type="video/mp4">`;

  /* 2) titles */
  sourceATitle.textContent = titleA;
  sourceBTitle.textContent = titleB;

  /* 3) reload / play */
  videoA.load();
  videoB.load();

  Promise.all([
    videoA.readyState >= 2 ? Promise.resolve()
                           : new Promise(res => (videoA.oncanplay = res)),
    videoB.readyState >= 2 ? Promise.resolve()
                           : new Promise(res => (videoB.oncanplay = res))
  ])
    .then(() => {
      videoA.currentTime = 0;
      videoB.currentTime = 0;
      return Promise.all([videoA.play(), videoB.play()]);
    })
    .catch(err => console.warn("Autoplay failed:", err));

  /* 4) update dots */
  updateDots(pagination, currentPairIndex);

  /* 5) keep slider gallery in sync */
  loadSliderVideos();
}

/* ------------------------------------------------------------
   Slider gallery loader
------------------------------------------------------------ */
function loadSliderVideos() {
  const { sourceA, sourceB, titleA, titleB } = videoPairs[currentPairIndex];

  sliderVideoA.innerHTML = `<source src="${sourceA}" type="video/mp4">`;
  sliderVideoB.innerHTML = `<source src="${sourceB}" type="video/mp4">`;

  sliderTitleA.textContent = titleA;
  sliderTitleB.textContent = titleB;

  sliderVideoA.load();
  sliderVideoB.load();

  Promise.all([
    sliderVideoA.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => (sliderVideoA.oncanplay = res)),
    sliderVideoB.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => (sliderVideoB.oncanplay = res))
  ])
    .then(() => {
      sliderVideoA.currentTime = 0;
      sliderVideoB.currentTime = 0;
      return Promise.all([sliderVideoA.play(), sliderVideoB.play()]);
    })
    .catch(err => console.warn("Slider autoplay failed:", err));

  updateDots(sliderPagination, currentPairIndex);
}

/* ------------------------------------------------------------
   Navigation helpers
------------------------------------------------------------ */
function goToPair(index) {
  currentPairIndex = (index + totalPairs) % totalPairs;
  loadCurrentVideoPair();
}

function navigateVideos(direction) {
  goToPair(currentPairIndex + direction);
}

function navigateSliderVideos(direction) {
  goToPair(currentPairIndex + direction);
}

/* ------------------------------------------------------------
   Slider playback sync
------------------------------------------------------------ */
function syncSliderVideos() {
  sliderVideoA.addEventListener("play", () => sliderVideoB.play());
  sliderVideoB.addEventListener("play", () => sliderVideoA.play());

  sliderVideoA.addEventListener("pause", () => sliderVideoB.pause());
  sliderVideoB.addEventListener("pause", () => sliderVideoA.pause());

  sliderVideoA.addEventListener("timeupdate", () => {
    if (Math.abs(sliderVideoA.currentTime - sliderVideoB.currentTime) > 0.5) {
      sliderVideoB.currentTime = sliderVideoA.currentTime;
    }
  });
}

/* ------------------------------------------------------------
   Init on DOM ready
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  /* build dot bars once */
  renderDots(pagination, totalPairs);
  renderDots(sliderPagination, totalPairs);

  loadCurrentVideoPair();
  syncSliderVideos();
});
