import { debug } from "./utils/helpers";
import { Listing } from "./utils/parsers";
// import Fuse from "fuse.js";


export const filterListing = (
  searchQuery: string,
  fuzziness: number,
  listing: Listing,
): boolean => {
  // Basic check that at least one word in the query matches
  debug(`Filtering on searchQuery: ${searchQuery}`);
  for (const word of searchQuery.toLowerCase().split(" ")) {
    if (listing.title.toLowerCase().includes(word)) {
      return false;
    }
  }

  return true;
};

// export const filterListings = (
//   searchQuery: string,
//   fuzziness: number,
//   listings: Listing[],
// ) => {
//   const fuseOptions = {
//     keys: ["title"]
//     // TODO: Optional "summary" key
//   };
//   const fuse = new Fuse(listings, fuseOptions);

//   return fuse.search(searchQuery);
// }