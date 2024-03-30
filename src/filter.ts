import { debug } from "./utils/helpers";
import { Listing } from "./utils/parsers";
import Fuse from "fuse.js";

export const filterListings = (
  searchQuery: string,
  fuzziness: number,
  titleOnly: boolean,
  listings: Listing[],
) => {
  debug(
    `Filtering on searchQuery: ${searchQuery} with threshold: ${fuzziness}`,
  );

  const keys = ["title"];
  if (!titleOnly) {
    keys.push("summary");
  }

  const fuse = new Fuse(listings, {
    ignoreLocation: true, // Include results anywhere in the string
    threshold: fuzziness,
    keys,
  });

  return fuse.search(searchQuery);
};
