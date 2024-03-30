import { debug } from "./utils/helpers";
import { Listing } from "./utils/parsers";
import Fuse from "fuse.js";

export const filterListings = (
  searchQuery: string,
  fuzziness: number,
  listings: Listing[],
) => {
  debug(
    `Filtering on searchQuery: ${searchQuery} with threshold: ${fuzziness}`,
  );
  const fuse = new Fuse(listings, {
    ignoreLocation: true, // Include results anywhere in the string
    keys: ["title"],
    threshold: fuzziness,
    // TODO: Optional "summary" key
  });

  return fuse.search(searchQuery);
};
