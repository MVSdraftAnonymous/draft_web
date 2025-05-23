/* ------------------------------------------------------------
   Video gallery configuration
------------------------------------------------------------ */
const videoData = [
  {src: "videos/175.mp4" },
  {src: "videos/224.mp4" }
];

const tripletsData = [
  { src: "videos/41.mp4" },
  { src: "videos/mountain.mp4" },
  { src: "videos/40.mp4" }
];

// Slider video pairs (keeping original structure)
const videoPairs = [
  { 
    sourceA: "videos/40_pano.mp4", 
    sourceB: "videos/40_dino.mp4", 
    titleA: "Panoramic Video", 
    titleB: "DINO Panoramic Video" 
  },
  { 
    sourceA: "videos/case4_pano.mp4", 
    sourceB: "videos/case4_dino.mp4", 
    titleA: "Panoramic Video", 
    titleB: "DINO Panoramic Video" 
  }
];

let currentVideoIndex = 0;
let currentVideoIndexTriplets = 0;
let currentPairIndex = 0;
const totalVideos = videoData.length;
const totalVideosTriplets = tripletsData.length;
const totalPairs = videoPairs.length;

/* ------------------------------------------------------------
   DOM look-ups
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  /* Single video gallery n=2 */
  const currentVideo = document.getElementById("currentVideo");
  const currentVideoSource = document.getElementById("currentVideoSource");
  const videoCounter = document.getElementById("videoCounter");
  const pagination = document.getElementById("pagination");

  /* Single video gallery n=3 */
  const currentVideoTriplets = document.getElementById("currentVideoTriplets");
  const currentVideoSourceTriplets = document.getElementById("currentVideoSourceTriplets");
  const videoCounterTriplets = document.getElementById("videoCounterTriplets");
  const paginationTriplets = document.getElementById("paginationTriplets");

  /* Slider gallery */
  const sliderVideoA = document.getElementById("sliderVideoA");
  const sliderVideoB = document.getElementById("sliderVideoB");
  const sliderTitleA = document.getElementById("sliderTitleA");
  const sliderTitleB = document.getElementById("sliderTitleB");
  const sliderPagination = document.getElementById("sliderPagination");

  /* ------------------------------------------------------------
     Helpers for dot indicators
  ------------------------------------------------------------ */
  function renderDots(container, total, clickHandler) {
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => clickHandler(i));
      container.appendChild(dot);
    }
  }

  function updateDots(container, index) {
    if (!container) return;
    const dots = container.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  /* ------------------------------------------------------------
     Single video gallery functions
  ------------------------------------------------------------ */
  function updateVideo() {
    if (!currentVideo || !currentVideoSource) return;
    
    const videoInfo = videoData[currentVideoIndex];
    
    // Update video source and title
    currentVideoSource.src = videoInfo.src;
    
    // Update counter and gallery title
    if (videoCounter) {
      videoCounter.textContent = `${currentVideoIndex + 1}/${totalVideos}`;
    }
    
    // Reload video
    currentVideo.load();
    currentVideo.play().catch(e => console.log("Autoplay prevented:", e));
    
    // Update dots
    updateDots(pagination, currentVideoIndex);
  }

  function updateVideoTriplets() {
    if (!currentVideoTriplets || !currentVideoSourceTriplets) return;
    
    const videoInfo = tripletsData[currentVideoIndexTriplets];
    
    // Update video source and title
    currentVideoSourceTriplets.src = videoInfo.src;
    
    // Update counter and gallery title
    if (videoCounterTriplets) {
      videoCounterTriplets.textContent = `${currentVideoIndexTriplets + 1}/${totalVideosTriplets}`;
    }
    
    // Reload video
    currentVideoTriplets.load();
    currentVideoTriplets.play().catch(e => console.log("Autoplay prevented:", e));
    
    // Update dots
    updateDots(paginationTriplets, currentVideoIndexTriplets);
  }

  function goToVideo(index) {
    currentVideoIndex = (index + totalVideos) % totalVideos;
    updateVideo();
  }

  function goToVideoTriplets(index) {
    currentVideoIndexTriplets = (index + totalVideosTriplets) % totalVideosTriplets;
    updateVideoTriplets();
  }

  /* ------------------------------------------------------------
     Slider gallery functions
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
     Navigation event handlers
  ------------------------------------------------------------ */
  // Expose navigation functions to global scope for button clicks
  window.navigateVideos = function(direction) {
    goToVideo(currentVideoIndex + direction);
  };

  window.navigateVideosTriplets = function(direction) {
    goToVideoTriplets(currentVideoIndexTriplets + direction);
  };

  window.navigateSliderVideos = function(direction) {
    goToPair(currentPairIndex + direction);
  };

  /* ------------------------------------------------------------
     Initialize everything
  ------------------------------------------------------------ */
  // Initialize N=2 video gallery
  if (pagination && currentVideo) {
    renderDots(pagination, totalVideos, goToVideo);
    updateVideo();
  }
  
  // Initialize N=3 video gallery (TRIPLETS)
  if (paginationTriplets && currentVideoTriplets) {
    renderDots(paginationTriplets, totalVideosTriplets, goToVideoTriplets);
    updateVideoTriplets();
  }
  
  // Initialize slider gallery
  if (sliderPagination && sliderVideoA && sliderVideoB) {
    renderDots(sliderPagination, totalPairs, goToPair);
    loadSliderVideos();
    syncSliderVideos();
  }
});