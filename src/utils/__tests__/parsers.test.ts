import { parsePath } from "../parsers";

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

  it("handles category-only", () => {
    const url = "https://www.gumtree.com.au/s-home-garden/c18397";

    expect(parsePath(url)).toEqual({
      category: "home-garden",
      page: 1,
      view: "list",
    });
  });
});
