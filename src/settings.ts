import { debug, error, sendMessageToWindow } from "./utils/helpers";
import { RawSettings, SettingsMessage, BaseMessage } from "./types";

// Settings
const DEFAULT_SETTINGS: RawSettings = {
  transparency: 70,
  fuzziness: 95,
  titleOnly: true,
};

export const getStoredSetting = async (setting: keyof RawSettings) => {
  const settingNode = await browser.storage.sync.get(setting);

  if (!settingNode) {
    return DEFAULT_SETTINGS[setting];
  }

  return settingNode[setting];
};

export const getStoredSettings = async (): Promise<RawSettings> => {
  const settings = await browser.storage.sync.get(null);

  // Add any defaults
  Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
    if (!Object.keys(settings).includes(key)) {
      settings[key] = value;
    }
  });

  return settings as RawSettings;
};

export class PopupSetting {
  private name: keyof RawSettings;
  private uiType: string;
  private uiName: string;
  private uiElement: HTMLInputElement;
  private valid: boolean;

  constructor(
    name: keyof RawSettings,
    uiType: string,
    initialSettings: RawSettings,
  ) {
    this.name = name;
    this.uiType = uiType;
    this.uiName = `${name}-${uiType}`;
    this.uiElement = document.getElementById(this.uiName) as HTMLInputElement;
    this.valid = this.uiElement ? true : false;
    if (!this.valid) {
      error(`Error initialising setting: ${this.name}`);
    }
    this.initialise(initialSettings);
  }

  private async initialise(initialSettings: RawSettings) {
    if (this.valid) {
      // Change Handler
      this.uiElement.addEventListener("change", async (_event: Event) => {
        debug(`Value for ${this.uiName} changed`);

        let message: Record<string, string | number | boolean> = {
          type: "SETTINGS",
        };
        message[this.name] =
          this.uiType === "checkbox"
            ? this.uiElement.checked
            : this.uiElement.value;

        await sendMessageToWindow(message as SettingsMessage);
      });

      // Initial Value
      if (this.uiType === "checkbox") {
        this.uiElement.checked = initialSettings[this.name] as boolean;
      } else {
        this.uiElement.value = initialSettings[this.name].toString();
      }
    }
  }
}
