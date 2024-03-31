import { debug, error, sendMessageToWindow } from "./utils/helpers";
import { getStoredSettings, PopupSetting } from "./utils/settings";
import { RawSettings } from "./utils/types";

// Initialse the UI with preloaded settings values, and create the listeners
getStoredSettings()
  .then((settings: RawSettings) => {
    sendMessageToWindow({
      type: "DEBUG",
      message: `Initial settings: "${JSON.stringify(settings)}"`,
    }).catch((err) =>
      error(`Error sending message: ${(err as Error).message}`),
    );
    const enabled = new PopupSetting("enabled", "checkbox", settings);
    const other = [
      new PopupSetting("transparency", "slider", settings),
      new PopupSetting("fuzziness", "slider", settings),
      new PopupSetting("titleOnly", "checkbox", settings),
    ];

    // All the other settings should be greyed out when the extension is disabled
    enabled.addChangeEventListener((_event: Event) => {
      for (const setting of other) {
        setting.setUiEnabled(enabled.getUiValue() as boolean);
      }
    });
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
