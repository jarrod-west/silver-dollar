import { debug, error } from "./helpers";

// Classes
const CLASSES = {
  gallery: {
    listingsClassName: "user-ad-square-new-design",
    titleClassName: "user-ad-square-new-design__title",
    summaryClassName: [
      "user-ad-square-new-design__description user-ad-square-new-design__description--two-lines",
      "user-ad-square-new-design__description",
    ],
  },
  list: {
    listingsClassName: "user-ad-row-new-design",
    titleClassName: "user-ad-row-new-design__title-span",
    summaryClassName: ["user-ad-row-new-design__description-text"],
  },
};

const PAGE_REGEX = new RegExp(/^page-(\d+)$/);

type View = "gallery" | "list";

export type UrlComponents = {
  category?: string;
  searchQuery?: string;
  page: number;
  view: View;
};

export type Listing = {
  htmlNode: HTMLElement;
  title: string;
  summary: string;
};

const removePrefix = (value: string): string => {
  return value.slice(2); // Remove the "s-" prefix
};

export const parsePath = (urlString: string): UrlComponents => {
  // Format = /[category]/search/[page]/[id]
  // If category is present, prefixed with "s-".  If not, the search is prefixes with "s-"
  // If the page is not present it's page one, otherwise it's "page-N"
  // When splitting, the initial "/" becomes the 0th item in the list

  const url = new URL(urlString);
  const pathTokens = url.pathname.split("/");

  let category;
  let searchQuery;
  let pageMatch;

  if (pathTokens[pathTokens.length - 1].startsWith("c")) {
    // Category-only search
    category = pathTokens[1];
  } else if (pathTokens.length == 3) {
    // No category, page 1
    searchQuery = pathTokens[1];
  } else if (pathTokens.length == 5) {
    // Both category AND page 2+
    category = pathTokens[1];
    searchQuery = pathTokens[2];
    pageMatch = PAGE_REGEX.exec(pathTokens[3]);
  } else {
    // 4.  Could be two things
    pageMatch = PAGE_REGEX.exec(pathTokens[2]);

    if (pageMatch) {
      // No category, but page 2+
      searchQuery = pathTokens[1];
    } else {
      // Category and page 1
      category = pathTokens[1];
      searchQuery = pathTokens[2];
      pageMatch = PAGE_REGEX.exec(pathTokens[3]);
    }
  }

  if (category) {
    category = removePrefix(category);
  } else if (searchQuery) {
    searchQuery = removePrefix(searchQuery);
  }

  // 0th result is the entire match, first is the group
  const page = pageMatch ? parseInt(pageMatch[1]) : 1;

  // Query params
  const searchParams = new URLSearchParams(url.searchParams);

  return {
    category,
    searchQuery,
    page,
    view: (searchParams.get("view") || "list") as View,
  };
};

export const getListings = (view: View): HTMLCollectionOf<HTMLElement> => {
  const className = CLASSES[view].listingsClassName;

  return document.getElementsByClassName(
    className,
  ) as HTMLCollectionOf<HTMLElement>;
};

const getByClassName = (
  view: View,
  type: "title" | "summary",
  parentNode: HTMLElement,
) => {
  // Retrieve an item by class name
  let classes = CLASSES[view][`${type}ClassName`];

  if (!Array.isArray(classes)) {
    classes = [classes];
  }

  for (const className of classes) {
    const value = parentNode.getElementsByClassName(className)?.[0]?.innerHTML;
    if (value) {
      return value;
    }
  }

  error(`Couldn't find class for ${type}`);

  return "Unknown";
};

export const parseListing = (
  view: View,
  listingsNode: HTMLElement,
): Listing => {
  const title = getByClassName(view, "title", listingsNode);
  const summary = getByClassName(view, "summary", listingsNode);
  debug(`Title: ${title}`);
  debug(`Summary: ${summary}`);

  return {
    htmlNode: listingsNode,
    title,
    summary,
  };
};
