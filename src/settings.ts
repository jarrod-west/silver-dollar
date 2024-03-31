import { debug, error, sendMessageToWindow } from "./utils/helpers";
import { RawSettings, SettingsMessage } from "./types";
import browser from "webextension-polyfill";

// Settings
const DEFAULT_SETTINGS: RawSettings = {
  enabled: true,
  transparency: 70,
  fuzziness: 35,
  titleOnly: true,
};

export const getStoredSetting = async (setting: keyof RawSettings) => {
  const settingNode = await browser.storage.sync.get(setting);

  if (!settingNode) {
    return DEFAULT_SETTINGS[setting];
  }

  return settingNode[setting] as number | boolean;
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
      error(`Error initialising setting "${this.name}"`);
    }
    this.initialise(initialSettings);
  }

  public addChangeEventListener(callback: (event: Event) => void) {
    this.uiElement.addEventListener("change", callback);
  }

  public setUiEnabled(enabled: boolean) {
    this.uiElement.disabled = !enabled;
  }

  public getUiValue(): boolean | number {
    if (this.uiType === "checkbox") {
      return this.uiElement.checked;
    } else {
      return parseInt(this.uiElement.value);
    }
  }

  private initialise(initialSettings: RawSettings) {
    if (this.valid) {
      // Change Handler
      this.addChangeEventListener((_event: Event) => {
        debug(`Value for ${this.uiName} changed`);

        const message: Record<string, string | number | boolean> = {
          type: "SETTINGS",
        };
        message[this.name] =
          this.uiType === "checkbox"
            ? this.uiElement.checked
            : parseInt(this.uiElement.value);

        sendMessageToWindow(message as SettingsMessage).catch((err) =>
          error(`Error sending message: ${(err as Error).message}`),
        );
      });

      // Initial Value
      if (this.uiType === "checkbox") {
        this.uiElement.checked = initialSettings[this.name] as boolean;
      } else {
        this.uiElement.value = initialSettings[this.name].toString();
      }

      // Initial enabled/disabled
      if (this.name === "enabled") {
        this.setUiEnabled(true);
      } else {
        this.setUiEnabled(initialSettings.enabled);
      }
    }
  }
}
