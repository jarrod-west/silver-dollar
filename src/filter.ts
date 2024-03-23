import { debug } from "./utils/helpers";
import { Listing } from "./utils/parsers";

export const filterListing = (searchQuery: string, listing: Listing): boolean => {
  // Basic check that at least one word in the query matches
  debug(`Filtering on searchQuery: ${searchQuery}`);
  for (const word of searchQuery.toLowerCase().split(' ')) {
    if (listing.title.toLowerCase().includes(word)) {
      return false;
    }
  }

  return true;
}