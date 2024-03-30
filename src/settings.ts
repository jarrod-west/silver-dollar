import { main } from "./index";
import { debug, error } from "./utils/helpers";
import { DebugMessage, ErrorMessage, Message, Settings } from "./types";

// Settings
const DEFAULT_SETTINGS: Settings = {
  transparency: 70,
  fuzziness: 95,
  titleOnly: true
}

const onMessage = async (message: Message) => {
  debug(`Message received: ${JSON.stringify(message)}`);

  let { type, ...remainder } = message;

  switch (message.type) {
    case "SETTINGS":
      await browser.storage.sync.set(remainder);
      main();
      break;
    case "DEBUG":
      debug((message as DebugMessage).message);
      break;
    case "ERROR":
      error((message as ErrorMessage).message);
      break;
    default:
      error(`Unexpected message type: ${message}`);
      return {response: "Error"};
  };

  return {response: "Success"};
}

export const getSetting = async (setting: keyof Settings) => {
  const settingNode = await browser.storage.sync.get(setting);

  if (!settingNode) {
    return DEFAULT_SETTINGS[setting];
  }

  return settingNode[setting];
}

export const getSettings = async (): Promise<Settings> => {
  const settings = await browser.storage.sync.get(null);

  // Add any defaults
  Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
    if (!(Object.keys(settings).includes(key))) {
      settings[key] = value;
    }
  })

  return settings as Settings;
}

browser.runtime.onMessage.addListener(onMessage);