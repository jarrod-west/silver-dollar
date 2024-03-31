import { mockQuery, mockSendMessage } from "../../__tests__/testHelper";
import { DebugMessage } from "../types";
import { devBuild, info, error, debug, sendMessageToWindow } from "../helpers";

describe("devBuild", () => {
  let oldEnv: { [key: string]: string | undefined };

  beforeEach(() => {
    oldEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...oldEnv };
  });

  it("returns true for development", () => {
    process.env.NODE_ENV = "development";

    expect(devBuild()).toEqual(true);
  });

  it("returns false for production", () => {
    process.env.NODE_ENV = "production";

    expect(devBuild()).toEqual(false);
  });

  it("returns false for unknown", () => {
    process.env.NODE_ENV = undefined;

    expect(devBuild()).toEqual(false);
  });
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
  let oldEnv: { [key: string]: string | undefined };

  beforeEach(() => {
    oldEnv = { ...process.env };
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = { ...oldEnv };
  });

  it("logs the message when development", () => {
    process.env.NODE_ENV = "development";
    debug("foo");
    expect(logSpy).toHaveBeenCalledWith("[Silver Dollar: Debug] foo");
  });

  it("doesn't log the message when not development", () => {
    process.env.NODE_ENV = "production";
    debug("foo");
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe("sendMessageToWindow", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockTab = { id: 1 };

  const message: DebugMessage = {
    type: "DEBUG",
    message: "Foo",
  };

  it("sends the message to the tab", async () => {
    mockQuery.mockResolvedValueOnce([mockTab]);
    mockSendMessage.mockResolvedValueOnce({ response: "Success" });

    expect(await sendMessageToWindow(message)).toEqual({ response: "Success" });

    expect(mockQuery).toHaveBeenCalledWith({
      currentWindow: true,
      active: true,
    });
    expect(mockSendMessage).toHaveBeenCalledWith(1, message);
  });

  it("returns an error if no tab is found", async () => {
    mockQuery.mockResolvedValueOnce([{}]);

    expect(await sendMessageToWindow(message)).toEqual({ response: "Error" });
    expect(mockQuery).toHaveBeenCalledWith({
      currentWindow: true,
      active: true,
    });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("returns an error if the query errors", async () => {
    mockQuery.mockRejectedValue({ message: "An error occurred" });

    expect(await sendMessageToWindow(message)).toEqual({ response: "Error" });
    expect(mockQuery).toHaveBeenCalledWith({
      currentWindow: true,
      active: true,
    });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("returns an error if the message send errors", async () => {
    mockQuery.mockResolvedValueOnce([mockTab]);
    mockSendMessage.mockRejectedValue({ message: "An error occurred" });

    expect(await sendMessageToWindow(message)).toEqual({ response: "Error" });
    expect(mockQuery).toHaveBeenCalledWith({
      currentWindow: true,
      active: true,
    });
    expect(mockSendMessage).toHaveBeenCalledWith(1, message);
  });
});
