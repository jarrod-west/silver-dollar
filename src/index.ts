import { debug, info, error } from "./utils/utils";

const ROW_LISTINGS_CLASS_NAME = "user-ad-row-new-design";
const GALLERY_LISTINGS_CLASS_NAME = "user-ad-square-new-design";
const OPACITY = "0.5";

const getListings = (view: string): HTMLCollectionOf<HTMLElement> => {
  const className = view === "gallery" ? GALLERY_LISTINGS_CLASS_NAME : ROW_LISTINGS_CLASS_NAME;

  return document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
}

const main = () => {
  debug("Main");
  document.body.style.border = "5px solid red";

  const listings = getListings("gallery");

  debug(`Found ${listings.length} listings`);

  for (const listing of listings) {
    debug(`Listing: ${listing.ariaLabel}`);
    listing.style.opacity = OPACITY;
  }
}

const mutationCallback = (mutationList: any, observer: any) => {
  for (const mutation of mutationList) {
    // if (mutation.type === "childList") {
    //   console.log("A child node has been added or removed.");
    // } else if (mutation.type === "attributes") {
    //   console.log(`The ${mutation.attributeName} attribute was modified.`);
    // }
    debug(`Mutation of type: ${mutation.type}`);
  }
};

const targetNode = document.getElementsByClassName("radio-set__option srp-display-options__view");
if (targetNode) {
  debug("Setting observer");
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode[0], config);
} else {
  error("Failed to set observer");
}

info("Loaded");
main();