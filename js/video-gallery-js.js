/* ------------------------------------------------------------
   Video gallery configuration
------------------------------------------------------------ */
const videoData = [
  { title: "Fast Moving", src: "videos/175.mp4" },
  { title: "Fast Moving", src: "videos/40.mp4" }
];

const tripletsData = [
  { title: "Visual comparison", src: "videos/40.mp4" },
  { title: "Visual comparison", src: "videos/41.mp4" }
];


// Slider video pairs (keeping original structure)
const videoPairs = [
  { 
    sourceA: "videos/40_pano.mp4", 
    sourceB: "videos/40_dino.mp4", 
    titleA: "Panoramic Video", 
    titleB: "DINO based features maps Panorama" 
  }
];

let currentVideoIndex = 0;
let tripletsVideoIndex = 0;
let currentPairIndex = 0;
const totalVideos = videoData.length;
const totalTriplets = tripletsData.length;
const totalPairs = videoPairs.length;

/* ------------------------------------------------------------
   DOM look-ups
------------------------------------------------------------ */
/* Single video gallery */
const currentVideo = document.getElementById("currentVideo");
const currentVideoSource = document.getElementById("currentVideoSource");
const currentVideoTitle = document.getElementById("currentVideoTitle");
const videoCounter = document.getElementById("videoCounter");
const galleryTitle = document.getElementById("galleryTitle");
const pagination = document.getElementById("pagination");

/* Slider gallery */
const sliderVideoA = document.getElementById("sliderVideoA");
const sliderVideoB = document.getElementById("sliderVideoB");
const sliderTitleA = document.getElementById("sliderTitleA");
const sliderTitleB = document.getElementById("sliderTitleB");
const sliderPagination = document.getElementById("sliderPagination");

/* ------------------------------------------------------------
   Helpers for dot indicators
------------------------------------------------------------ */
function renderDots(container, total) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      if (container === pagination) {
        goToVideo(i);
      } else {
        goToPair(i);
      }
    });
    container.appendChild(dot);
  }
}

function updateDots(container, index) {
  if (!container) return;
  container
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("active", i === index));
}

/* ------------------------------------------------------------
   Single video gallery functions
------------------------------------------------------------ */
function updateVideo() {
  if (!currentVideo || !currentVideoSource || !currentVideoTitle) return;
  
  const videoInfo = videoData[currentVideoIndex];
  
  // Update video source and title
  currentVideoSource.src = videoInfo.src;
  currentVideoTitle.textContent = videoInfo.title;
  
  // Update counter and gallery title
  if (videoCounter) {
    videoCounter.textContent = `${currentVideoIndex + 1}/${totalVideos}`;
  }
  if (galleryTitle) {
    galleryTitle.textContent = `${totalVideos} Input Videos:`;
  }
  
  // Reload video
  currentVideo.load();
  
  // Update dots
  updateDots(pagination, currentVideoIndex);
}

function goToVideo(index) {
  currentVideoIndex = (index + totalVideos) % totalVideos;
  updateVideo();
}

function navigateVideos(direction) {
  goToVideo(currentVideoIndex + direction);
}

/* ------------------------------------------------------------
   Slider gallery functions (keeping original)
------------------------------------------------------------ */
function loadSliderVideos() {
  if (!sliderVideoA || !sliderVideoB) return;
  
  const { sourceA, sourceB, titleA, titleB } = videoPairs[currentPairIndex];

  sliderVideoA.innerHTML = `<source src="${sourceA}" type="video/mp4">`;
  sliderVideoB.innerHTML = `<source src="${sourceB}" type="video/mp4">`;

  if (sliderTitleA) sliderTitleA.textContent = titleA;
  if (sliderTitleB) sliderTitleB.textContent = titleB;

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

function goToPair(index) {
  currentPairIndex = (index + totalPairs) % totalPairs;
  loadSliderVideos();
}

function navigateSliderVideos(direction) {
  goToPair(currentPairIndex + direction);
}

/* ------------------------------------------------------------
   Slider playback sync (keeping original)
------------------------------------------------------------ */
function syncSliderVideos() {
  if (!sliderVideoA || !sliderVideoB) return;
  
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
  // Initialize single video gallery
  if (pagination && currentVideo) {
    renderDots(pagination, totalVideos);
    updateVideo();
  }
  
  // Initialize slider gallery
  if (sliderPagination && sliderVideoA && sliderVideoB) {
    renderDots(sliderPagination, totalPairs);
    loadSliderVideos();
    syncSliderVideos();
  }
});