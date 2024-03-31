import "../../__tests__/testHelper";
import { getListings, parseListing, parsePath } from "../parsers";
import jsdom from "jsdom-global";

jsdom(); // Setup the mock DOM

// Helper to turn a list of elements into a HTMLCollection
const createHtmlCollection = (elements: HTMLElement[]): HTMLCollection => {
  const fragment = document.createDocumentFragment();

  for (const element of elements) {
    fragment.appendChild(element);
  }

  return fragment.children;
};

const createElement = (innerHTML: string): HTMLElement => {
  const element = document.createElement("div");
  element.innerHTML = innerHTML;
  return element;
};

describe("parsePath", () => {
  it("parses the first results page", () => {
    const url = "https://www.gumtree.com.au/s-cars-vans-utes/test/k0c18320r10";

    expect(parsePath(url)).toEqual({
      category: "cars-vans-utes",
      searchQuery: "test",
      page: 1,
      view: "list",
    });
  });

  it("parses secondary results pages", () => {
    const url =
      "https://www.gumtree.com.au/s-cars-vans-utes/test/page-2/k0c18320r10";

    expect(parsePath(url)).toEqual({
      category: "cars-vans-utes",
      searchQuery: "test",
      page: 2,
      view: "list",
    });
  });

  it("parses the query params", () => {
    const url =
      "https://www.gumtree.com.au/s-cars-vans-utes/test/k0c18320r10?view=gallery";

    expect(parsePath(url)).toEqual({
      category: "cars-vans-utes",
      searchQuery: "test",
      page: 1,
      view: "gallery",
    });
  });

  it("handles search only", () => {
    const url = "https://www.gumtree.com.au/s-test/k0c18320r10";

    expect(parsePath(url)).toEqual({
      searchQuery: "test",
      page: 1,
      view: "list",
    });
  });

  it("handles search only with page", () => {
    const url = "https://www.gumtree.com.au/s-test/page-3/k0c18320r10";

    expect(parsePath(url)).toEqual({
      searchQuery: "test",
      page: 3,
      view: "list",
    });
  });

  it("handles category-only", () => {
    const url = "https://www.gumtree.com.au/s-home-garden/c18397";

    expect(parsePath(url)).toEqual({
      category: "home-garden",
      page: 1,
      view: "list",
    });
  });

  it("handles category-only with page", () => {
    const url = "https://www.gumtree.com.au/s-home-garden/page-2/c18397";

    expect(parsePath(url)).toEqual({
      category: "home-garden",
      page: 2,
      view: "list",
    });
  });
});

describe("parseListing", () => {
  const getElementSpy = jest.spyOn(
    HTMLElement.prototype,
    "getElementsByClassName",
  );
  const mockListingElement = createElement("foo");

  const mockTitleElement = createElement("mock-title");
  const mockSummaryElement = createElement("mock-summary");

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when list-style", () => {
    it("parses the list-style listing", () => {
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockTitleElement]),
      );
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockSummaryElement]),
      );

      expect(parseListing("list", mockListingElement)).toEqual({
        htmlNode: mockListingElement,
        title: "mock-title",
        summary: "mock-summary",
      });

      expect(getElementSpy).toHaveBeenCalledTimes(2);
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-row-new-design__title-span",
      );
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-row-new-design__description-text",
      );
    });
  });

  describe("when gallery-style", () => {
    it("parses the gallery-style listing", () => {
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockTitleElement]),
      );
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockSummaryElement]),
      );

      expect(parseListing("gallery", mockListingElement)).toEqual({
        htmlNode: mockListingElement,
        title: "mock-title",
        summary: "mock-summary",
      });

      expect(getElementSpy).toHaveBeenCalledTimes(2);
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-square-new-design__title",
      );
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-square-new-design__description",
      );
    });

    it("tries all possible classes", () => {
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockTitleElement]),
      );
      getElementSpy.mockReturnValueOnce(createHtmlCollection([]));
      getElementSpy.mockReturnValueOnce(
        createHtmlCollection([mockSummaryElement]),
      );

      expect(parseListing("gallery", mockListingElement)).toEqual({
        htmlNode: mockListingElement,
        title: "mock-title",
        summary: "mock-summary",
      });

      expect(getElementSpy).toHaveBeenCalledTimes(3);
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-square-new-design__title",
      );
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-square-new-design__description",
      );
      expect(getElementSpy).toHaveBeenCalledWith(
        "user-ad-square-new-design__description user-ad-square-new-design__description--two-lines",
      );
    });
  });

  it("handles missing title", () => {
    getElementSpy.mockReturnValueOnce(createHtmlCollection([]));
    getElementSpy.mockReturnValueOnce(
      createHtmlCollection([mockSummaryElement]),
    );

    expect(parseListing("list", mockListingElement)).toEqual({
      htmlNode: mockListingElement,
      title: "Unknown",
      summary: "mock-summary",
    });

    expect(getElementSpy).toHaveBeenCalledTimes(2);
    expect(getElementSpy).toHaveBeenCalledWith(
      "user-ad-row-new-design__title-span",
    );
    expect(getElementSpy).toHaveBeenCalledWith(
      "user-ad-row-new-design__description-text",
    );
  });

  it("handles missing summary", () => {
    getElementSpy.mockReturnValueOnce(createHtmlCollection([mockTitleElement]));
    getElementSpy.mockReturnValueOnce(createHtmlCollection([]));
    getElementSpy.mockReturnValueOnce(createHtmlCollection([]));

    expect(parseListing("gallery", mockListingElement)).toEqual({
      htmlNode: mockListingElement,
      title: "mock-title",
      summary: "Unknown",
    });

    expect(getElementSpy).toHaveBeenCalledTimes(3);
    expect(getElementSpy).toHaveBeenCalledWith(
      "user-ad-square-new-design__title",
    );
    expect(getElementSpy).toHaveBeenCalledWith(
      "user-ad-square-new-design__description",
    );
    expect(getElementSpy).toHaveBeenCalledWith(
      "user-ad-square-new-design__description user-ad-square-new-design__description--two-lines",
    );
  });
});

describe("getListings", () => {
  const getElementSpy = jest.spyOn(document, "getElementsByClassName");
  const mockListingElement = createElement("foo");

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns the listings", () => {
    const collection = createHtmlCollection([mockListingElement]);
    getElementSpy.mockReturnValueOnce(collection);

    expect(getListings("list")).toEqual(collection);
    expect(getElementSpy).toHaveBeenCalledTimes(1);
  });
});
