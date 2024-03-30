import { debug, info, error } from "./utils/helpers";
import { parsePath, getListings, parseListing } from "./utils/parsers";
import { filterListing } from "./filter";
import { getSetting } from "./settings";
import { TRANSPARENCY_SETTING } from "./types";

// Classes
const MAIN_RESULTS_CLASS_NAME = "search-results-page__user-ad-collection";

const mutationCallback: MutationCallback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
  // Rerun when mutation occurs
  debug(`Mutations occurred: ${mutationList.length}`);
  main();
};


const createDisplayChangeObserver = () => {
  // Listen for changes to the radio button that chooses between "list" and "grid"
  const targetNode = document.getElementsByClassName(MAIN_RESULTS_CLASS_NAME)?.[0];
  if (targetNode) {
    debug("Setting mutation observer");
    const config: MutationObserverInit = { attributes: true, subtree: true };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
  } else {
    error("Failed to set mutation observer");
  }
}

const calculateOpacity = async (): Promise<string> => {
  // Inverse of the transparency, converted to a decimal between 0 and 1, then to a string
  const transparency = await getSetting(TRANSPARENCY_SETTING);
  return ((100 - transparency) / 100).toString();
}

export const main = async () => {
  debug("Main");
  // Leave this in to make it clear the extension loaded
  document.body.style.border = "5px solid red";

  const urlComponents = parsePath(document.URL);
  const listingsNode = getListings(urlComponents.view);

  debug(`Found ${listingsNode.length} listings`);
  const opacity = await calculateOpacity();

  for (const listingNode of listingsNode) {
    const listing = parseListing(urlComponents.view, listingNode);
    if (filterListing(urlComponents.searchQuery, listing)) {
      listingNode.style.opacity = opacity;
    }
  }
}

info("Loaded");
createDisplayChangeObserver();
main(); // TODO: Do on-load