import { debug, error } from "./utils/helpers";
import { getSettings } from "./settings";
import { Message, Settings } from "./types";

const sendMessage = async (message: Message): Promise<void> => {
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

// Listeners
const transparencySlider = document.getElementById("transparency-slider") as HTMLInputElement;
if (transparencySlider) {
  transparencySlider.addEventListener("change", async (_event: Event) => {
    debug("Transparency value changed!");
    await sendMessage({type: "SETTINGS", transparency: parseInt(transparencySlider.value)});
  });
}
const fuzzinessSlider = document.getElementById("fuzziness-slider") as HTMLInputElement;
if (fuzzinessSlider) {
  fuzzinessSlider.addEventListener("change", async (_event: Event) => {
    debug("Fuzziness value changed!");
    await sendMessage({type: "SETTINGS", fuzziness: parseInt(fuzzinessSlider.value)});
  });
}

const titleOnlyCheckbox = document.getElementById("title-checkbox") as HTMLInputElement;
if (titleOnlyCheckbox) {
  titleOnlyCheckbox.addEventListener("change", async (_event: Event) => {
    debug("TitleOnly value changed!");
    await sendMessage({type: "SETTINGS", titleOnly: titleOnlyCheckbox.checked});
  });
}

// Set the values from storage
getSettings().then((settings: Settings) => {
  sendMessage({type: "DEBUG", message: `Initial settings: "${JSON.stringify(settings)}"`});
  transparencySlider.value = settings.transparency.toString();
  fuzzinessSlider.value = settings.fuzziness.toString();
  titleOnlyCheckbox.checked = settings.titleOnly;
}).catch(err => {
  sendMessage({type: "DEBUG", message: `Error setting initial settings: ${err}`});
});

debug("Popup loaded");