import jsdom from "jsdom-global";

jsdom(); // Setup the mock DOM

export const mockQuery = jest.fn();
export const mockSendMessage = jest.fn();
export const mockStorage = jest.fn();
export const mockMessageListener = jest.fn();

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
        set: mockStorage,
      },
    },
    runtime: {
      onMessage: {
        addListener: mockMessageListener,
      },
    },
  },
}));

// Create a UI Element
export const createElement = (innerHTML: string): HTMLElement => {
  const element = document.createElement("div");
  element.innerHTML = innerHTML;
  return element;
};

// Turn a list of elements into a HTMLCollection
export const createHtmlCollection = (
  elements: HTMLElement[],
): HTMLCollection => {
  const fragment = document.createDocumentFragment();

  for (const element of elements) {
    fragment.appendChild(element);
  }

  return fragment.children;
};

// Flush any outstanding promises
export const flushPromises = () => new Promise(setImmediate);
