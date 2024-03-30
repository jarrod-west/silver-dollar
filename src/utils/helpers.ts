import { Message } from "../types";

// TODO: Improve
export const info = (msg: string) => {
  console.log(`[Silver Dollar] ${msg}`);
}

export const debug = (msg: string) => {
  console.log(`[Silver Dollar] ${msg}`);
}

export const error = (msg: string) => {
  console.error(`[Silver Dollar] ${msg}`);
}

export const sendMessageToWindow = async (message: Message): Promise<void> => {
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