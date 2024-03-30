import { debug, error } from "./utils/helpers";
import { getSetting, getSettings } from "./settings";

// const getEventTarget = (event: Event): HTMLElement | null => {
//   if (!event?.target) {
//     return null;
//   }

//   return event.target as HTMLElement;
// }

const sendMessage = async (message: any): Promise<void> => {
  try {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});

    for (const tab of tabs) {
      const response = await browser.tabs.sendMessage(tab.id as number, message);
      debug(`Message sent, response: ${response.response}`);
    }
  } catch (err) {
    error(`Error sending message: ${err}`);
  }
}

// document.addEventListener("click", async (event: Event) => {
//   if (!event?.target) {
//     return;
//   }

//   const target = event.target as HTMLElement;

//   // if (!target.classList.contains("page-choice")) {
//   //   return;
//   // }

//   // const chosenPage = `https://${target.textContent}`;
//   // browser.tabs.create({
//   //   url: chosenPage,
//   // });

//   try {
//     const tabs = await browser.tabs.query({currentWindow: true, active: true});

//     for (const tab of tabs) {
//       const response = await browser.tabs.sendMessage(tab.id as number, {message: "a message"});
//       debug(`Message sent, response: ${response.response}`);
//     }
//   } catch (err) {
//     error(`Error sending message: ${err}`);
//   }
// });

// Listener
const slider = document.getElementById("transparency-slider") as HTMLInputElement;
if (slider) {
  slider.addEventListener("change", async (_event: Event) => {
    debug("Slider value changed!");
    await sendMessage({type: "SETTINGS", transparency: slider.value});
  });
}

// Set the values from storage
// getSettings().then(settings => {
//   // debug();
//   sendMessage({type: "DEBUG", message: `Setting slider value to "${settings.transparency}"`});
//   slider.value = settings.transparency;
// }).catch(err => {
//   // error(`Error setting initial slider value: ${err}`);
//   sendMessage({type: "DEBUG", message: `Error setting initial slider value: ${err}`});
// });

getSetting("transparency").then((transparency: string) => {
  // debug();
  sendMessage({type: "DEBUG", message: `Setting slider value to "${transparency}"`});
  slider.value = transparency;
}).catch(err => {
  // error(`Error setting initial slider value: ${err}`);
  sendMessage({type: "DEBUG", message: `Error setting initial slider value: ${err}`});
});


debug("Popup loaded");