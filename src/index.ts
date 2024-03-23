import { parsePath, debug, info, error } from "./utils/utils";

// Classes
const ROW_LISTINGS_CLASS_NAME = "user-ad-row-new-design";
const GALLERY_LISTINGS_CLASS_NAME = "user-ad-square-new-design";
const DISPLAY_RADIO_BUTTON_CLASS_NAME = "radio-set__option srp-display-options__view";

// Settings
const OPACITY = "0.5";

const getListings = (view: string | undefined): HTMLCollectionOf<HTMLElement> => {
  const className = view === "gallery" ? GALLERY_LISTINGS_CLASS_NAME : ROW_LISTINGS_CLASS_NAME;

  return document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
}

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

  const listings = getListings(urlComponents.view);

  debug(`Found ${listings.length} listings`);

  for (const listing of listings) {
    debug(`Listing: ${listing.ariaLabel}`);
    listing.style.opacity = OPACITY;
  }
}


info("Loaded");
createDisplayChangeObserver();
main();