
// import jsdom from "jsdom-global";
// import "mockzilla-webextension";
import type { Browser } from "webextension-polyfill";
import { deepMock } from "mockzilla";


// jsdom(); // Setup the mock DOM

// This MUST be var to be "hoisted" before the mock on the next line
// eslint-disable-next-line no-var
var [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>("browser", false);

jest.mock("webextension-polyfill", () => ({
  // browser
  __esModule: true,
  default: browser,
}));

import { Message, DebugMessage, MessageResponse } from "../../types";
import { devBuild, info, error, debug, sendMessageToWindow } from "../helpers";


// jest.mock("webextension-polyfill", () => browser);

// let browser;
// let mockBrowser;
// let mockBrowserNode;

// jest.mock("webextension-polyfill", () => {
//   // browser
//   [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>("browser", false);
//   return browser;
// });

describe("devBuild", () => {

  let oldEnv: { [key: string]: string | undefined; };

  beforeEach(() => {
    oldEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...oldEnv };
  });

  it("returns true for development", () => {
    process.env.NODE_ENV="development";

    expect(devBuild()).toEqual(true);
  });

  it("returns false for production", () => {
    process.env.NODE_ENV="production";

    expect(devBuild()).toEqual(false);
  })

  it("returns false for unknown", () => {
    process.env.NODE_ENV=undefined;

    expect(devBuild()).toEqual(false);
  })
});

describe("info", () => {
  const logSpy = jest.spyOn(console, "log");

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("logs the message", () => {
    info("foo");
    expect(logSpy).toHaveBeenCalledWith("[Silver Dollar: Info] foo");
  });
});

describe("error", () => {
  const logSpy = jest.spyOn(console, "error");

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("logs the message", () => {
    error("foo");
    expect(logSpy).toHaveBeenCalledWith("[Silver Dollar: Error] foo");
  });
});

describe("debug", () => {
  const logSpy = jest.spyOn(console, "log");
  let oldEnv: { [key: string]: string | undefined; };

  beforeEach(() => {
    oldEnv = { ...process.env };
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = { ...oldEnv };
  });

  it("logs the message when development", () => {
    process.env.NODE_ENV="development";
    debug("foo");
    expect(logSpy).toHaveBeenCalledWith("[Silver Dollar: Debug] foo");
  });

  it("doesn't log the message when not development", () => {
    process.env.NODE_ENV="production";
    debug("foo");
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe("sendMessageToWindow", () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    mockBrowserNode.enable();
  })

  afterEach(() => {
    mockBrowserNode.disable();
  })

  it("sends the message to the tab", async () => {
    const mockTab: browser.tabs.Tab = {
      id: 1,
    } as browser.tabs.Tab;

    const message: DebugMessage = {
      type: "DEBUG",
      message: "Foo",
    };

    const mockListener = jest.fn();
    mockBrowser.runtime.onMessage.addListener.expect(
      mockListener,
      expect.anything(),
    );
    mockBrowser.tabs.query
      .expect({ currentWindow: true, active: true })
      .andResolve([mockTab]);
    mockBrowser.tabs.sendMessage
      .expect(expect.anything(), expect.anything())
      // .andResolve<Message>({ response: "Success" });
      .andResolve(true)

    expect(await sendMessageToWindow(message)).toEqual({response: "Success"});
  });
});
