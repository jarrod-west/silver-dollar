import { main } from "./index";
import { debug, info, error } from "./utils/helpers";
import { DebugMessage, Message, SettingsMessage } from "./types";

// Settings
const DEFAULT_SETTINGS: SettingsMessage = {
  type: "SETTINGS", // TODO
  transparency: 70,
}

// const setInitialSettings = async () => {
//   const currentStorage = await browser.storage.sync.get();
//   // Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
//   //   if (!currentStorage[key]) {
//   //     await browser.storage.sync.set({key: value});
//   //   }
//   // });

//   // Object.keys(DEFAULT_SETTINGS).filter(key => !(currentStorage.keys().includes(key)))
//   //   .reduce( (res, key) => (res[key] = DEFAULT_SETTINGS[key], res), {} );

//   const unset = Object.fromEntries(Object.entries(DEFAULT_SETTINGS).filter(([key, _value]) => !currentStorage.keys().includes(key)));
//   await browser.storage.sync.set(unset);
// }

// const onSettingsMessage = async (message: SettingsMessage) => {
//   debug(`Message received: ${JSON.stringify(message)}`);
//   await browser.storage.sync.set(message);

//   main();

//   return {response: "Response from content"};
// }

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
      error((message as DebugMessage).message);
      break;
    default:
      error(`Unexpected message type: ${message.type}`);
      return {response: "Error"};
  };

  return {response: "Success"};
}

export const getSetting = async (setting: keyof SettingsMessage) => {
  const settingNode = await browser.storage.sync.get(setting);

  if (!settingNode) {
    return DEFAULT_SETTINGS[setting];
  }

  return settingNode[setting];
}

export const getSettings = async () => {
  const settings = await browser.storage.sync.get(null);

  // Add any defaults
  Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
    if (!settings.keys().includes(key)) {
      settings[key] = value;
    }
  })

  return settings;
}

browser.runtime.onMessage.addListener(onMessage);

// setInitialSettings();