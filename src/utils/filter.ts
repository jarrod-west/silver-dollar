import { debug } from "./helpers";
import { Listing } from "./parsers";
import Fuse, { FuseResult } from "fuse.js";

export const filterListings = (
  searchQuery: string,
  fuzziness: number,
  titleOnly: boolean,
  listings: Listing[],
): FuseResult<Listing>[] => {
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
