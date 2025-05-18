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
    
    // Set video sources
    videoA.innerHTML = `<source src="${currentPair.sourceA}" type="video/mp4">
                       Your browser does not support the video tag.`;
    videoB.innerHTML = `<source src="${currentPair.sourceB}" type="video/mp4">
                       Your browser does not support the video tag.`;
    
    // Set titles
    sourceATitle.textContent = currentPair.titleA;
    sourceBTitle.textContent = currentPair.titleB;
    
    // Update counter
    counter.textContent = `${currentPairIndex + 1}/${totalPairs}`;
    
    // Load the videos
    videoA.load();
    videoB.load();
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
