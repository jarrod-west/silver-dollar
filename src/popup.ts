import { debug, sendMessageToWindow } from "./utils/helpers";
import { getStoredSettings, PopupSetting } from "./settings";
import { RawSettings } from "./types";

// Initialse the UI with preloaded settings values, and create the listeners
getStoredSettings().then((settings: Settings) => {
  sendMessageToWindow({type: "DEBUG", message: `Initial settings: "${JSON.stringify(settings)}"`});
  new PopupSetting("transparency", "slider", settings);
  new PopupSetting("fuzziness", "slider", settings);
  new PopupSetting("titleOnly", "checkbox", settings);
}).catch(err => {
  sendMessageToWindow({type: "DEBUG", message: `Error setting initial settings: ${err}`});
});

debug("Popup loaded");