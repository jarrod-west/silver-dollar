import { debug, info, error } from "./utils/helpers";
import { parsePath, getListings, parseListing, parseSearchQuery } from "./utils/parsers";
import { filterListing } from "./filter";

// Classes
const DISPLAY_RADIO_BUTTON_CLASS_NAME = "radio-set__option srp-display-options__view";

// Settings
const OPACITY = "0.5";

const mutationCallback: MutationCallback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
  // Rerun when mutation occurs
  debug(`Mutations occurred: ${mutationList.length}`);
  main();
};


const createDisplayChangeObserver = () => {
  // Listen for changes to the radio button that chooses between "list" and "grid"
  const targetNode = document.getElementsByClassName(DISPLAY_RADIO_BUTTON_CLASS_NAME)?.[0];
  if (targetNode) {
    debug("Setting observer");
    const config: MutationObserverInit = { attributes: true, subtree: true };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
  } else {
    error("Failed to set observer");
  }
}

const main = () => {
  debug("Main");
  // Leave this in to make it clear the extension loaded
  document.body.style.border = "5px solid red";

  const urlComponents = parsePath(document.URL);
  // urlComponents.searchQuery = parseSearchQuery();
  const listingsNode = getListings(urlComponents.view);

  debug(`Found ${listingsNode.length} listings`);

  for (const listingNode of listingsNode) {
    // debug(`Listing: ${listing.ariaLabel}`);
    // listing.style.opacity = OPACITY;
    const listing = parseListing(urlComponents.view, listingNode);
    if (filterListing(urlComponents.searchQuery, listing)) {
      listingNode.style.opacity = OPACITY;
    }
  }
}


info("Loaded");
createDisplayChangeObserver();
main();