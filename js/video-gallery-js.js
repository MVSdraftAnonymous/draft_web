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
    
];

let currentPairIndex = 0;
const totalPairs = videoPairs.length;

// DOM elements
const videoA = document.getElementById("videoA");
const videoB = document.getElementById("videoB");
const sourceATitle = document.getElementById("sourceATitle");
const sourceBTitle = document.getElementById("sourceBTitle");
const counter = document.getElementById("counter");

// Initialize videos
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
  counter.textContent     = `${currentPairIndex + 1}/${totalPairs}`;

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
}


// Navigation function
function navigateVideos(direction) {
    // Calculate new index with wrapping
    currentPairIndex = (currentPairIndex + direction + totalPairs) % totalPairs;
    
    // Load new videos
    loadCurrentVideoPair();
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentVideoPair();
});
