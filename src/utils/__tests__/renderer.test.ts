import {
  createElement,
  mockStorage,
  mockMessageListener,
  createHtmlCollection,
} from "../../__tests__/testHelper";
import * as renderer from "../renderer";
import * as helpers from "../helpers";
import { Message } from "../types";

// describe("onMutation", () => {

//   afterEach(() => {
//     jest.resetAllMocks();
//   })

//   it ("calls render", () => {
//     const renderSpy = jest.spyOn(renderer, "render");
//     renderSpy.mockResolvedValueOnce(undefined);
//     renderer["onMutation"]();
//     expect(renderSpy).toHaveBeenCalledTimes(1)
//   });
// })

describe("createMessageListener", () => {
  it("calls addListener", () => {
    mockMessageListener.mockReturnValueOnce(undefined);
    renderer.createMessageListener();
    expect(mockMessageListener).toHaveBeenCalledTimes(1);
  });
});

describe("createDisplayChangeObserver", () => {
  let old: {
    prototype: MutationObserver;
    new (callback: MutationCallback): MutationObserver;
  };

  const mockMutationObserver = jest.fn();
  const observeSpy = jest.fn();

  const getElementSpy = jest.spyOn(document, "getElementsByClassName");
  const mockElement = createElement("mock");

  beforeEach(() => {
    old = global.MutationObserver;
    mockMutationObserver.mockImplementation(() => ({
      observe: observeSpy,
    }));

    global.MutationObserver = mockMutationObserver;
  });

  afterEach(() => {
    global.MutationObserver = old;
    jest.resetAllMocks();
  });

  it("creates the observer", () => {
    getElementSpy.mockReturnValueOnce(createHtmlCollection([mockElement]));
    renderer.createDisplayChangeObserver();

    expect(observeSpy).toHaveBeenCalledWith(mockElement, {
      attributes: true,
      subtree: true,
    });
  });

  it("logs an error if the target node isn't found", () => {
    const errorSpy = jest.spyOn(helpers, "error");
    getElementSpy.mockReturnValueOnce(createHtmlCollection([]));
    renderer.createDisplayChangeObserver();

    expect(observeSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith("Failed to set mutation observer");
  });
});

describe("onMessage", () => {
  it("logs a debug message for DEBUG messages", async () => {
    const message: Message = { type: "DEBUG", message: "foo" };
    const debugSpy = jest.spyOn(helpers, "debug");

    expect(await renderer.onMessage(message)).toEqual({ response: "Success" });
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining("Message received"),
    );
    expect(debugSpy).toHaveBeenCalledWith("foo");
  });

  it("logs an error for ERROR messages", async () => {
    const message: Message = { type: "ERROR", message: "bar" };
    const errorSpy = jest.spyOn(helpers, "error");
    expect(await renderer.onMessage(message)).toEqual({ response: "Success" });
    expect(errorSpy).toHaveBeenCalledWith("bar");
  });

  it("stores settings and re-renders for SETTINGS messages", async () => {
    const renderSpy = jest.spyOn(renderer, "render");
    renderSpy.mockResolvedValueOnce(undefined);
    mockStorage.mockResolvedValueOnce(undefined);

    const message: Message = { type: "SETTINGS", transparency: 12345 };

    expect(await renderer.onMessage(message)).toEqual({ response: "Success" });

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(mockStorage).toHaveBeenCalledWith({ transparency: 12345 });
  });

  it("returns an error for unknown messages", async () => {
    const message: Message = {
      type: "UNKNOWN",
      message: "baz",
    } as unknown as Message;
    const errorSpy = jest.spyOn(helpers, "error");
    expect(await renderer.onMessage(message)).toEqual({ response: "Error" });
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Unexpected message type"),
    );
  });
});
