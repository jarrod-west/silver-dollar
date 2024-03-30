import { debug, error, sendMessageToWindow } from "./utils/helpers";
import { getStoredSettings, PopupSetting } from "./settings";
import { RawSettings } from "./types";

// Initialse the UI with preloaded settings values, and create the listeners
getStoredSettings()
  .then((settings: RawSettings) => {
    sendMessageToWindow({
      type: "DEBUG",
      message: `Initial settings: "${JSON.stringify(settings)}"`,
    }).catch((err) =>
      error(`Error sending message: ${(err as Error).message}`),
    );
    new PopupSetting("enabled", "checkbox", settings);
    new PopupSetting("transparency", "slider", settings);
    new PopupSetting("fuzziness", "slider", settings);
    new PopupSetting("titleOnly", "checkbox", settings);
  })
  .catch((err) => {
    sendMessageToWindow({
      type: "DEBUG",
      message: `Error setting initial settings: ${err}`,
    }).catch((err) =>
      error(`Error sending message: ${(err as Error).message}`),
    );
  });

debug("Popup loaded");
