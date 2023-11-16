// // RELOAD ALL YOUTUBE TABS WHEN THE EXTENSION IS FIRST INSTALLED, DO NOTHING ON UPDATED
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

// const taimuRipu = async () => {
//   await new Promise((resolve, _reject) => {
//     const videoContainer = document.getElementById("movie_player");
// 	  var bg_repeated = 0;
//     var bg_intervalThread = null;

//     const setTimeoutHandler = () => {
//       const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");
//       const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText;
//       const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;

//       if (isAd && skipLock) {
//         const videoPlayer = document.getElementsByClassName("video-stream")[0];
//         videoPlayer.muted = true; // videoPlayer.volume = 0;
//         videoPlayer.currentTime = videoPlayer.duration - 0.1;
//         videoPlayer.paused && videoPlayer.play()
//         // CLICK ON THE SKIP AD BTN
//         setTimeout(() => {
//           document.autoClickSkipButton();
//         }, 50);
//         clearInterval(bg_intervalThread);
//       } else if (isAd && surveyLock) {
//         // CLICK ON THE SKIP SURVEY BTN
//         document.autoClickSkipButton();
//         clearInterval(bg_intervalThread);
//       }
	 
//       bg_repeated++;
//       if(bg_repeated==10)
//         clearInterval(bg_intervalThread);
//       resolve();
//     };

//     bg_intervalThread = setInterval(setTimeoutHandler, 25);
//   });

//   taimuRipu();
// };

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	console.log("changeInfo.status");
// 	console.log(changeInfo.status);
//   if (
//     changeInfo.status === "complete" &&
//     String(tab.url).includes("https://www.youtube.com/watch")
//   ) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       function: taimuRipu,
//     });
//   }
// });
