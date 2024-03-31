import { info, error, devBuild } from "./utils/helpers";
import {
  render,
  createDisplayChangeObserver,
  createMessageListener,
} from "./utils/renderer";

info("Loaded");
if (devBuild()) {
  // Easy visual indicator that the extension has loaded
  document.body.style.border = "5px solid red";
}

// Create listeners
createDisplayChangeObserver();
createMessageListener();

// Do the initial render
render().catch((err) =>
  error(`Error calling main on start: ${(err as Error).message}`),
);
