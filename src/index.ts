import { debug, info, error } from "./utils/helpers";
import { parsePath, getListings, parseListing } from "./utils/parsers";
import { filterListing } from "./filter";

// Classes
const MAIN_RESULTS_CLASS_NAME = "search-results-page__user-ad-collection";

// Settings
const OPACITY = "0.5";

const mutationCallback: MutationCallback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
  // Rerun when mutation occurs
  debug(`Mutations occurred: ${mutationList.length}`);
  main();
};


const createDisplayChangeObserver = () => {
  // Listen for changes to the radio button that chooses between "list" and "grid"
  const targetNode = document.getElementsByClassName(MAIN_RESULTS_CLASS_NAME)?.[0];
  if (targetNode) {
    debug("Setting observer");
    const config: MutationObserverInit = { attributes: true, subtree: true };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
  } else {
    error("Failed to set observer");
  }
}

const main = async () => {
  debug("Main");
  // Leave this in to make it clear the extension loaded
  // document.body.style.border = "5px solid red";

  try {
    let color = "blue"; // TODO: Necessary?
    const stored = await browser.storage.sync.get("color");
    if (stored.color) {
      color = stored.color;
    }
    document.body.style.border = `5px solid ${color}`;
  } catch (err) {
    error(`Error retrieving color: ${err}`);
  }

  const urlComponents = parsePath(document.URL);
  const listingsNode = getListings(urlComponents.view);

  debug(`Found ${listingsNode.length} listings`);

  for (const listingNode of listingsNode) {
    const listing = parseListing(urlComponents.view, listingNode);
    if (filterListing(urlComponents.searchQuery, listing)) {
      listingNode.style.opacity = OPACITY;
    }
  }
}

browser.runtime.onMessage.addListener((request) => {
  debug(`Message received: ${request.message}`);

  return Promise.resolve({response: "Response from content"});
})


info("Loaded");
createDisplayChangeObserver();
// createToolbarButton();
// main(); // TODO: Still necessary, or does the initial load get triggered as a mutation?