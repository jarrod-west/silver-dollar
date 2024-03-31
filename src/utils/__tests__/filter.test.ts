import "../../__tests__/testHelper";
import { filterListings } from "../filter";
import { Listing } from "../parsers";
import Fuse from "fuse.js";

const searchSpy = jest.fn();
jest.mock("fuse.js", () => {
  return jest.fn().mockImplementation(() => {
    return { search: searchSpy };
  });
});

describe("filterListings", () => {
  const searchQuery = "foo-search";
  const fuzziness = 62;
  const titleOnly = true;
  const listings = [
    {
      title: "title-1",
      summary: "summary-1",
    },
    {
      title: "title-2",
      summary: "summary-2",
    },
  ] as Listing[];
  const filteredListings = listings.map((listing, index) => ({
    refIndex: index,
    item: listing,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    searchSpy.mockReturnValueOnce(filteredListings);
  });

  it("calls fuse search with correct parameters", () => {
    expect(filterListings(searchQuery, fuzziness, titleOnly, listings)).toEqual(
      filteredListings,
    );

    expect(searchSpy).toHaveBeenCalledWith(searchQuery);
    expect(Fuse).toHaveBeenCalledWith(listings, {
      ignoreLocation: true,
      threshold: fuzziness,
      keys: ["title"],
    });
  });

  it("adds the summary field if not set to titleOnly", () => {
    expect(filterListings(searchQuery, fuzziness, false, listings)).toEqual(
      filteredListings,
    );

    expect(searchSpy).toHaveBeenCalledWith(searchQuery);
    expect(Fuse).toHaveBeenCalledWith(listings, {
      ignoreLocation: true,
      threshold: fuzziness,
      keys: ["title", "summary"],
    });
  });
});
