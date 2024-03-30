import { debug, info, error, devBuild } from "./utils/helpers";
import { parsePath, getListings, parseListing } from "./utils/parsers";
import { filterListings } from "./filter";
import { getStoredSetting } from "./settings";
import {
  TRANSPARENCY_SETTING,
  FUZZINESS_SETTING,
  Message,
  MessageResponse,
} from "./types";

// Classes
const MAIN_RESULTS_CLASS_NAME = "search-results-page__user-ad-collection";

const mutationCallback: MutationCallback = (
  mutationList: MutationRecord[],
  _observer: MutationObserver,
) => {
  // Rerun when mutation occurs
  debug(`Mutations occurred: ${mutationList.length}`);
  main().catch((err) =>
    error(`Error calling main on muation: ${(err as Error).message}`),
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

const calculateOpacity = async (): Promise<string> => {
  // Inverse of the transparency, converted to a decimal between 0 and 1, then to a string
  const transparency = (await getStoredSetting(TRANSPARENCY_SETTING)) as number;
  return ((100 - transparency) / 100).toString();
};

const calculateFuzziness = async (): Promise<number> => {
  const fuzziness = (await getStoredSetting(FUZZINESS_SETTING)) as number;
  return fuzziness / 100;
};

export const main = async () => {
  debug("Main");

  if (devBuild()) {
    // Easy visual indicator that the extension has loaded
    document.body.style.border = "5px solid red";
  }

  const urlComponents = parsePath(document.URL);
  const listingsNode = getListings(urlComponents.view);
  const listings = Array.from(listingsNode).map((listing) =>
    parseListing(urlComponents.view, listing),
  );

  debug(`Found ${listingsNode.length} listings`);
  const opacity = await calculateOpacity();
  const fuzziness = await calculateFuzziness();

  // Get the filtered-in listings, then use that to get the filtered-out ones
  const matchingListings = filterListings(
    urlComponents.searchQuery,
    fuzziness,
    listings,
  ).map((listing) => listing.item);
  const filteredListings = listings.filter(
    (listing) => !matchingListings.includes(listing),
  );

  // Set the filtered-out listings to the opacity
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
  error(`Error calling main on muation: ${(err as Error).message}`),
);
