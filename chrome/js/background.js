// RELOAD ALL YOUTUBE TABS WHEN THE EXTENSION IS FIRST INSTALLED, DO NOTHING ON UPDATED
chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case "install":
      console.info("EXTENSION INSTALLED");
      chrome.tabs.query({}, (tabs) => {
        tabs
          .filter((tab) => tab.url.startsWith("https://www.youtube.com/"))
          .forEach(({ id }) => {
            chrome.tabs.reload(id);
          });
      });
      break;
    case "update":
      console.info("EXTENSION UPDATED");
      break;
    case "chrome_update":
    case "shared_module_update":
    default:
      console.info("BROWSER UPDATED");
      break;
  }
});

const taimuRipu = async () => {
  await new Promise((resolve, _reject) => {
    const videoContainer = document.getElementById("movie_player");
	var repeated = 0;

    const setTimeoutHandler = () => {
      const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");
      const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText;
      const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;

      if (isAd && skipLock) {
        const videoPlayer = document.getElementsByClassName("video-stream")[0];
        videoPlayer.muted = true; // videoPlayer.volume = 0;
        videoPlayer.currentTime = videoPlayer.duration - 0.1;
        videoPlayer.paused && videoPlayer.play()
        // CLICK ON THE SKIP AD BTN
		setTimeout(() => {
			document.querySelector(".ytp-ad-skip-button")?.click();
			document.querySelector(".ytp-ad-skip-button-modern")?.click();
		}, 50);
        clearInterval(myShit);
      } else if (isAd && surveyLock) {
        // CLICK ON THE SKIP SURVEY BTN
        document.querySelector(".ytp-ad-skip-button")?.click();
        document.querySelector(".ytp-ad-skip-button-modern")?.click();
        clearInterval(myShit);
     }
	 
	  repeated++;
	  if(repeated==10)
		  clearInterval(myShit);
      resolve();
    };

    var myShit = setInterval(setTimeoutHandler, 25);
  });

  taimuRipu();
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log("changeInfo.status");
	console.log(changeInfo.status);
  if (
    changeInfo.status === "complete" &&
    String(tab.url).includes("https://www.youtube.com/watch")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: taimuRipu,
    });
  }
});
