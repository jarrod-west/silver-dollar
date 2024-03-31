import { Message } from "../../types";
import { devBuild, info, error, debug, sendMessageToWindow } from "../helpers";
// import jsdom from "jsdom-global";
// import "mockzilla-webextension";

// import type { Browser } from "webextension-polyfill";
// import { deepMock } from "mockzilla";

// jsdom(); // Setup the mock DOM

// const [browser, _mockBrowser, mockBrowserNode] = deepMock<Browser>("browser", false);

// jest.mock("webextension-polyfill", () => browser);

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

// describe("sendMessageToWindow", () => {
//   // const tabQuerySpy = jest.spyOn(browser.tabs, "query");
//   // const sendMessageSpy = jest.spyOn(browser.tabs, "sendMessage");

//   afterEach(() => {
//     // jest.resetAllMocks();
//   });

//   it("sends the message to the tab", async () => {
//     const mockTab: browser.tabs.Tab = {
//       id: 1,
//     } as browser.tabs.Tab;

//     const message: Message = {
//       type: "DEBUG",
//       message: "Foo",
//     };

//     // tabQuerySpy.mockResolvedValueOnce([mockTab]);
//     // sendMessageSpy.mockResolvedValueOnce({response: "success"});
//     const mockListener = jest.fn();
//     mockBrowser.runtime.onMessage.addListener.expect(
//       mockListener,
//       expect.anything(),
//     );
//     mockBrowser.tabs.query
//       .expect({ currentWindow: true, active: true })
//       .andResolve([mockTab]);
//     mockBrowser.tabs.sendMessage
//       .expect(1, message)
//       .andResolve({ response: "success" } as any);

//     await sendMessageToWindow(message);

//     // expect(sendMessageSpy).toHaveBeenCalledWith(1, message);
//     // mockBrowser.
//   });
// });
