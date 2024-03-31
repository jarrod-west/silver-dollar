import { Message, MessageResponse } from "./types";
import browser from "webextension-polyfill";

export const devBuild = (): boolean => {
  return process.env.NODE_ENV === "development";
};

// TODO: Improve
export const info = (msg: string) => {
  console.log(`[Silver Dollar: Info] ${msg}`);
};

export const debug = (msg: string) => {
  if (devBuild()) {
    console.log(`[Silver Dollar: Debug] ${msg}`);
  }
};

export const error = (msg: string) => {
  console.error(`[Silver Dollar: Error] ${msg}`);
};

export const sendMessageToWindow = async (
  message: Message,
): Promise<MessageResponse> => {
  try {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      active: true,
    });

    for (const tab of tabs) {
      if (tab.id) {
        const response = (await browser.tabs.sendMessage(
          tab.id,
          message,
        )) as MessageResponse;
        debug(`Message sent, response: ${response.response}`);
        return response;
      } else {
        error(`No ID for tab: ${JSON.stringify(tab)}`);
      }
    }
  } catch (err) {
    error(`Error sending message: ${(err as Error).message}`);
  }

  return { response: "Error" };
};
