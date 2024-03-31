import jsdom from "jsdom-global";

jsdom(); // Setup the mock DOM

export const mockQuery = jest.fn();
export const mockSendMessage = jest.fn();
export const mockStorage = jest.fn();

jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    tabs: {
      query: mockQuery,
      sendMessage: mockSendMessage,
    },
    storage: {
      sync: {
        get: mockStorage,
      },
    },
  },
}));

export const createElement = (innerHTML: string): HTMLElement => {
  const element = document.createElement("div");
  element.innerHTML = innerHTML;
  return element;
};

export const flushPromises = () => new Promise(setImmediate);
