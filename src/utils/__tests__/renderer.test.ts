import {
  createElement,
  mockStorage,
  mockMessageListener,
  createHtmlCollection,
} from "../../__tests__/testHelper";
import * as renderer from "../renderer";
import * as helpers from "../helpers";
import * as parsers from "../parsers";
import * as filter from "../filter";
import { Message } from "../types";

describe("onMutation", () => {
  let renderSpy: jest.SpyInstance;
  let old: {
    prototype: MutationObserver;
    new (callback: MutationCallback): MutationObserver;
  };
  const mockMutationObserver = jest.fn();

  beforeEach(() => {
    old = global.MutationObserver;
    global.MutationObserver = mockMutationObserver;
    renderSpy = jest.spyOn(renderer, "render");
  });

  afterEach(() => {
    global.MutationObserver = old;
    jest.resetAllMocks();
    jest.resetAllMocks();
    renderSpy.mockRestore();
  });

  it("calls render", () => {
    renderSpy.mockResolvedValueOnce(undefined);
    renderer.onMutation(
      [{ type: "attributes" } as MutationRecord],
      new MutationObserver(() => {}),
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});

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
  // const renderSpy = jest.spyOn(renderer, "render");
  let renderSpy: jest.SpyInstance;

  beforeEach(() => {
    renderSpy = jest.spyOn(renderer, "render");
  });

  afterEach(() => {
    jest.resetAllMocks();
    renderSpy.mockRestore();
  });

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

describe("render", () => {
  const parsePathSpy = jest.spyOn(parsers, "parsePath");
  const getListingsSpy = jest.spyOn(parsers, "getListings");
  const parseListingSpy = jest.spyOn(parsers, "parseListing");
  const filterListings = jest.spyOn(filter, "filterListings");

  const mockListing1 = createElement("listing1");
  const mockListing2 = createElement("listing2");
  const mockListing3 = createElement("listing3");

  const collection = createHtmlCollection([
    mockListing1,
    mockListing2,
    mockListing3,
  ]);

  const listings = [
    {
      title: "listing1 title",
      summary: "listing1 summary",
      htmlNode: mockListing1,
    },
    {
      title: "listing2 title",
      summary: "listing2 summary",
      htmlNode: mockListing2,
    },
    {
      title: "listing3 title",
      summary: "listing3 summary",
      htmlNode: mockListing3,
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns early if the page is not a query-based search", async () => {
    parsePathSpy.mockReturnValueOnce({
      category: "cars-vans-utes",
      page: 1,
      view: "list",
    });

    await renderer.render();
    expect(getListingsSpy).not.toHaveBeenCalled();
  });

  describe("when the page is a query-based search", () => {
    const mockFilterResponse = [
      { item: listings[0], refIndex: 1 },
      { item: listings[2], refIndex: 3 },
    ];

    const mockSettings = {
      transparency: 80,
      enabled: true,
      fuzziness: 30,
      titleOnly: true,
    };

    beforeEach(() => {
      parsePathSpy.mockReturnValueOnce({
        category: "cars-vans-utes",
        searchQuery: "rx7",
        page: 1,
        view: "list",
      });

      getListingsSpy.mockReturnValueOnce(
        collection as HTMLCollectionOf<HTMLElement>,
      );

      parseListingSpy.mockReturnValueOnce(listings[0]);
      parseListingSpy.mockReturnValueOnce(listings[1]);
      parseListingSpy.mockReturnValueOnce(listings[2]);
    });

    it("sets the non-filtered listings to a lower opacity", async () => {
      mockStorage.mockResolvedValueOnce(mockSettings);

      filterListings.mockReturnValueOnce(mockFilterResponse);

      await renderer.render();

      expect(listings[0].htmlNode.style.opacity).toEqual("1");
      expect(listings[2].htmlNode.style.opacity).toEqual("1");
      expect(listings[1].htmlNode.style.opacity).toEqual("0.2");
    });

    it("sets all listings to full opacity when the extension is disabled", async () => {
      mockStorage.mockResolvedValueOnce({
        ...mockSettings,
        enabled: false,
      });

      await renderer.render();

      expect(filterListings).not.toHaveBeenCalled();
      expect(listings[0].htmlNode.style.opacity).toEqual("1");
      expect(listings[2].htmlNode.style.opacity).toEqual("1");
      expect(listings[1].htmlNode.style.opacity).toEqual("1");
    });
  });
});
