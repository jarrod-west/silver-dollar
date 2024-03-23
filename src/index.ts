import { debug, info } from "./utils/utils";

const main = () => {
  debug("Main");
  document.body.style.border = "5px solid red";

  const listings = document.getElementsByClassName("user-ad-row-new-design");

  for (const listing of listings) {
    debug(`Listing: ${listing.ariaLabel}`);
  }
}

info("Loaded");
main();