const init = async () => {
  console.log("INITIALIZATION");
  const hideElementsBySelector = (selector) => {
    [...document.querySelectorAll(selector)].forEach(
      (el) => (el.style.display = "none")
    );
  }
  document.hideElementsBySelector = hideElementsBySelector;
    
  var fad_videoContainer = null;
  var fad_videoPlayer = null;
  var fad_isAd = false;
  var fad_skipLock = false;
  var fad_surveyLock = false;
  var fad_ExecutedAdSkipper = false;
  const updateVideoContainer = async () => {
    fad_videoContainer = document.getElementById("movie_player");
    fad_videoPlayer = document.getElementsByClassName("video-stream")[0];
  }
  const updateIsAd = async () => {
    fad_isAd = fad_videoContainer?.classList.contains("ad-interrupting") || fad_videoContainer?.classList.contains("ad-showing");
  }
  const updateSkipLock = async () => {
    fad_skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText;
  }
  const updateSurveyLock = async () => {
    fad_surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;
  }
  const staticAds = [
    ".ytd-companion-slot-renderer", ".ytd-action-companion-ad-renderer", // in-feed video ads
    ".ytd-watch-next-secondary-results-renderer.sparkles-light-cta", ".ytd-unlimited-offer-module-renderer", // similar components
    ".ytp-ad-overlay-image", ".ytp-ad-text-overlay", // deprecated overlay ads (04-06-2023)
    "div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint", "div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer",
    ".ytd-display-ad-renderer", ".ytd-statement-banner-renderer", ".ytd-in-feed-ad-layout-renderer", // homepage ads
    "div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy", // sponsors
    ".ytd-banner-promo-renderer", ".ytd-video-masthead-ad-v3-renderer", ".ytd-primetime-promo-renderer" // subscribe for premium & youtube tv ads
  ];
  const removeStaticAds = async () => {
    staticAds.forEach((ad) => {
        document.hideElementsBySelector(ad);
    });
  }
  const runDetections = async () => {
    if (fad_ExecutedAdSkipper) return;
    if (fad_isAd || fad_skipLock) {

      if(typeof(fad_videoContainer) == "undefined") return;
      if(typeof(fad_videoPlayer) == "undefined") return;
      if(typeof(fad_videoPlayer.duration) == "undefined") return;
      if(typeof(fad_videoPlayer.currentTime) == "undefined") return;

      fad_ExecutedAdSkipper = true;
      fad_videoPlayer.muted = true; // videoPlayer.volume = 0;
      try { // sometimes its throwing error here
        if (fad_videoPlayer.currentTime < fad_videoPlayer.duration - 0.1) 
        {
          fad_videoPlayer.currentTime = fad_videoPlayer.duration - 0.1;
        }
      } catch{}
      fad_videoPlayer.paused && fad_videoPlayer.play();
      // CLICK ON THE SKIP AD BTN
      await new Promise(resolve => setTimeout(resolve, 50)); // delay the click to always hit it!!
      document.querySelector(".ytp-ad-skip-button")?.click();
      document.querySelector(".ytp-ad-skip-button-modern")?.click();
      await new Promise(resolve => setTimeout(() => 
      { 
        fad_ExecutedAdSkipper = false; 
        resolve(); 
      }, 500)); // delay next execution
    } 
    // else {
    //   if (fad_isAd && fad_surveyLock) {
    //     fad_ExecutedAdSkipper = true;
    //     // CLICK ON THE SKIP SURVEY BTN
    //     document.querySelector(".ytp-ad-skip-button")?.click();
    //     document.querySelector(".ytp-ad-skip-button-modern")?.click();
    //     await new Promise(resolve => setTimeout(() => 
    //     { 
    //       fad_ExecutedAdSkipper = false; 
    //       resolve(); 
    //     }, 500)); // delay next execution
    //  }
    // }
  }

  setInterval(updateVideoContainer, 50);
  setInterval(updateIsAd, 50);
  setInterval(updateSkipLock, 50);
  setInterval(updateSurveyLock, 50);
  setInterval(removeStaticAds, 500);
  setInterval(runDetections, 50);
};

init();