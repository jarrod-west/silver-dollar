import { debug, info, error, devBuild } from "./utils/helpers";
import { Listing, parsePath, getListings, parseListing } from "./utils/parsers";
import { filterListings } from "./utils/filter";
import { getStoredSettings } from "./utils/settings";
import { Message, MessageResponse } from "./utils/types";
import browser from "webextension-polyfill";

// Classes
const MAIN_RESULTS_CLASS_NAME = "search-results-page__user-ad-collection";

const mutationCallback: MutationCallback = (
  mutationList: MutationRecord[],
  _observer: MutationObserver,
) => {
  // Rerun when mutation occurs
  debug(`Mutations occurred: ${mutationList.length}`);
  main().catch((err) =>
    error(`Error calling main on mutation: ${(err as Error).message}`),
  );
};

const onMessage = async (message: Message): Promise<MessageResponse> => {
  debug(`Message received: ${JSON.stringify(message)}`);

  const { type, ...remainder } = message;

  switch (type) {
    case "SETTINGS":
      await browser.storage.sync.set(remainder);
      await main();
      break;
    case "DEBUG":
      debug(message.message);
      break;
    case "ERROR":
      error(message.message);
      break;
    default:
      error(`Unexpected message type: ${JSON.stringify(message)}`);
      return { response: "Error" };
  }

  return { response: "Success" };
};

const createDisplayChangeObserver = () => {
  // Listen for changes to the radio button that chooses between "list" and "grid"
  const targetNode = document.getElementsByClassName(
    MAIN_RESULTS_CLASS_NAME,
  )?.[0];
  if (targetNode) {
    debug("Setting mutation observer");
    const config: MutationObserverInit = { attributes: true, subtree: true };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
  } else {
    error("Failed to set mutation observer");
  }
};

const createMessageListener = () => {
  browser.runtime.onMessage.addListener(onMessage);
};

export const main = async () => {
  debug("Main");

  if (devBuild()) {
    // Easy visual indicator that the extension has loaded
    document.body.style.border = "5px solid red";
  }

  const urlComponents = parsePath(document.URL);

  // May be a category browse, if so we skip
  if (!urlComponents.searchQuery) {
    return;
  }

  const listingsNode = getListings(urlComponents.view);
  const listings = Array.from(listingsNode).map((listing) =>
    parseListing(urlComponents.view, listing),
  );

  debug(`Found ${listingsNode.length} listings`);

  const settingsValues = await getStoredSettings();

  debug(`Retrieved stored settings: ${JSON.stringify(settingsValues)}`);

  const opacity = ((100 - settingsValues.transparency) / 100).toString(); // Inverse of the transparency setting
  const fuzziness = settingsValues.fuzziness / 100;

  let matchingListings: Listing[]; // Ones to make opaque
  let filteredListings: Listing[]; // Ones to make transparent

  if (settingsValues.enabled) {
    matchingListings = filterListings(
      urlComponents.searchQuery,
      fuzziness,
      settingsValues.titleOnly,
      listings,
    ).map((listing) => listing.item);
    filteredListings = listings.filter(
      (listing) => !matchingListings.includes(listing),
    );
  } else {
    matchingListings = listings;
    filteredListings = [];
  }

  debug(
    `Matching: ${matchingListings.length}. Filtered: ${filterListings.length}`,
  );

  // Set the filtered-out listings to the reduced opacity
  for (const listing of filteredListings) {
    listing.htmlNode.style.opacity = opacity;
  }

  // Reset the matching listings to 100% opacity
  for (const listing of matchingListings) {
    listing.htmlNode.style.opacity = "1";
  }
};

info("Loaded");
createDisplayChangeObserver();
createMessageListener();

// TODO: Do on-load
main().catch((err) =>
  error(`Error calling main on start: ${(err as Error).message}`),
);
