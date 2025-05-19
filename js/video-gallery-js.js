// Video gallery configuration
const videoPairs = [
    { 
        sourceA: "videos/video1A.mp4", 
        sourceB: "videos/video1B.mp4",
        titleA: "Source A - Video 1",
        titleB: "Source B - Video 1"
    },
    { 
        sourceA: "videos/video2A.mp4", 
        sourceB: "videos/video2B.mp4",
        titleA: "Source A - Video 2",
        titleB: "Source B - Video 2"
    },
    // Add more video pairs as needed
];

let currentPairIndex = 0;
const totalPairs = videoPairs.length;

// DOM elements - regular video gallery
const videoA = document.getElementById("videoA");
const videoB = document.getElementById("videoB");
const sourceATitle = document.getElementById("sourceATitle");
const sourceBTitle = document.getElementById("sourceBTitle");
const counter = document.getElementById("counter");

// DOM elements - slider video gallery
const sliderVideoA = document.getElementById("sliderVideoA");
const sliderVideoB = document.getElementById("sliderVideoB");
const sliderTitleA = document.getElementById("sliderTitleA");
const sliderTitleB = document.getElementById("sliderTitleB");
const sliderCounter = document.getElementById("sliderCounter");

// Initialize videos for regular gallery
function loadCurrentVideoPair() {
  const currentPair = videoPairs[currentPairIndex];

  // 1) swap out the <source> tags
  videoA.innerHTML = `
    <source src="${currentPair.sourceA}" type="video/mp4">
    Your browser does not support the video tag.
  `;
  videoB.innerHTML = `
    <source src="${currentPair.sourceB}" type="video/mp4">
    Your browser does not support the video tag.
  `;

  // 2) update titles & counter
  sourceATitle.textContent = currentPair.titleA;
  sourceBTitle.textContent = currentPair.titleB;
  counter.textContent = `${currentPairIndex + 1}/${totalPairs}`;

  // 3) tell the browser to fetch the new videos
  videoA.load();
  videoB.load();

  // 4) once both can play, reset time and play simultaneously
  Promise.all([
    videoA.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => videoA.oncanplay = res),
    videoB.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => videoB.oncanplay = res)
  ]).then(() => {
    videoA.currentTime = 0;
    videoB.currentTime = 0;
    return Promise.all([ videoA.play(), videoB.play() ]);
  }).catch(err => {
    console.warn("Autoplay failed (browser policy):", err);
  });
  
  // Also update the sliding comparison videos
  loadSliderVideos();
}

// Initialize videos for slider gallery
function loadSliderVideos() {
  const currentPair = videoPairs[currentPairIndex];
  
  // 1) swap out the <source> tags
  sliderVideoA.innerHTML = `
    <source src="${currentPair.sourceA}" type="video/mp4">
    Your browser does not support the video tag.
  `;
  sliderVideoB.innerHTML = `
    <source src="${currentPair.sourceB}" type="video/mp4">
    Your browser does not support the video tag.
  `;
  
  // 2) update titles & counter
  sliderTitleA.textContent = currentPair.titleA;
  sliderTitleB.textContent = currentPair.titleB;
  sliderCounter.textContent = `${currentPairIndex + 1}/${totalPairs}`;
  
  // 3) tell the browser to fetch the new videos
  sliderVideoA.load();
  sliderVideoB.load();
  
  // 4) once both can play, reset time and play simultaneously
  Promise.all([
    sliderVideoA.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => sliderVideoA.oncanplay = res),
    sliderVideoB.readyState >= 2
      ? Promise.resolve()
      : new Promise(res => sliderVideoB.oncanplay = res)
  ]).then(() => {
    sliderVideoA.currentTime = 0;
    sliderVideoB.currentTime = 0;
    return Promise.all([ sliderVideoA.play(), sliderVideoB.play() ]);
  }).catch(err => {
    console.warn("Slider autoplay failed (browser policy):", err);
  });
}

// Navigation function for regular video gallery
function navigateVideos(direction) {
    // Calculate new index with wrapping
    currentPairIndex = (currentPairIndex + direction + totalPairs) % totalPairs;
    
    // Load new videos
    loadCurrentVideoPair();
}

// Navigation function for slider video gallery
function navigateSliderVideos(direction) {
    // Calculate new index with wrapping
    currentPairIndex = (currentPairIndex + direction + totalPairs) % totalPairs;
    
    // Load new videos for both galleries
    loadCurrentVideoPair();
}

// Synchronize video playback between the two videos in the slider
function syncSliderVideos() {
    // When one video plays, play the other
    sliderVideoA.addEventListener('play', () => {
        sliderVideoB.play();
    });
    sliderVideoB.addEventListener('play', () => {
        sliderVideoA.play();
    });
    
    // When one video pauses, pause the other
    sliderVideoA.addEventListener('pause', () => {
        sliderVideoB.pause();
    });
    sliderVideoB.addEventListener('pause', () => {
        sliderVideoA.pause();
    });
    
    // Try to keep videos time-synchronized
    sliderVideoA.addEventListener('timeupdate', () => {
        // Only sync if they're more than 0.5 seconds apart
        if (Math.abs(sliderVideoA.currentTime - sliderVideoB.currentTime) > 0.5) {
            sliderVideoB.currentTime = sliderVideoA.currentTime;
        }
    });
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentVideoPair();
    syncSliderVideos();
});
