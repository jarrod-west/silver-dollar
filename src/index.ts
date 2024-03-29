import { debug, info, error } from "./utils/helpers";
import { parsePath, getListings, parseListing } from "./utils/parsers";
import { filterListing } from "./filter";
import { SettingsMessage } from "./types";

// Classes
const MAIN_RESULTS_CLASS_NAME = "search-results-page__user-ad-collection";

// Settings
const DEFAULT_SETTINGS = {
  transparency: 70,
}

const setInitialSettings = async () => {
  const currentStorage = await browser.storage.sync.get();
  // Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
  //   if (!currentStorage[key]) {
  //     await browser.storage.sync.set({key: value});
  //   }
  // });

  // Object.keys(DEFAULT_SETTINGS).filter(key => !(currentStorage.keys().includes(key)))
  //   .reduce( (res, key) => (res[key] = DEFAULT_SETTINGS[key], res), {} );

  const unset = Object.fromEntries(Object.entries(DEFAULT_SETTINGS).filter(([key, _value]) => !currentStorage.keys().includes(key)));
  await browser.storage.sync.set(unset);
}

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
  const transparency: number = parseInt((await browser.storage.sync.get("transparency")).transparency);

  for (const listingNode of listingsNode) {
    const listing = parseListing(urlComponents.view, listingNode);
    if (filterListing(urlComponents.searchQuery, listing)) {
      // listingNode.style.opacity = OPACITY;
      listingNode.style.opacity = ((100 - transparency) / 100).toString();
    }
  }
}

const onSettingsMessage = async (message: SettingsMessage) => {
  debug(`Message received: ${JSON.stringify(message)}`);
  await browser.storage.sync.set(message);

  main();

  return {response: "Response from content"};
}

// browser.runtime.onMessage.addListener(async (message) => {
//   debug(`Message received: ${JSON.stringify(message)}`);

//   Object.entries(message).forEach(([key, value]) => {
    
//   });

//   await browser.storage.sync.set({})

//   // return Promise.resolve({response: "Response from content"});
//   return {response: "Response from content"};
// });

// export const saveOptions = async (event: Event) => {
//   event.preventDefault();

//   const element = document.querySelector("#color") as HTMLInputElement;

//   if (element) {
//     await browser.storage.sync.set({
//       color: element.value,
//     });
//   }
// }


info("Loaded");
createDisplayChangeObserver();
setInitialSettings();
browser.runtime.onMessage.addListener(onSettingsMessage);
// createToolbarButton();
// main(); // TODO: Still necessary, or does the initial load get triggered as a mutation?