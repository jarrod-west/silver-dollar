import { debug, error } from "./helpers";

// Classes
const SEARCH_TEXTBOX_ID = "input-search-input";
const ROW_LISTINGS_CLASS_NAME = "user-ad-row-new-design";
const GALLERY_LISTINGS_CLASS_NAME = "user-ad-square-new-design";
const ROW_LISTING_TITLE_CLASS_NAME = "user-ad-row-new-design__title-span";
const GALLERY_LISTING_TITLE_CLASS_NAME = "user-ad-square-new-design__title";

const PAGE_REGEX = new RegExp(/^page\-(\d+)$/);

export type UrlComponents = {
  category?: string;
  searchQuery: string;
  page: number;
  view: string;
};

export type Listing = {
  title: string;
};

export const parsePath = (urlString: string): UrlComponents => {

  // Format = /[category]/search/[page]/[id]
  // If category is present, prefixed with "s-".  If not, the search is prefixes with "s-"
  // If the page is not present it's page one, otherwise it's "page-N"
  // When splitting, the initial "/" becomes the 0th item in the list

  const url = new URL(urlString);
  const pathTokens = url.pathname.split('/');

  let category;
  let searchQuery;
  let pageMatch;
  if (pathTokens.length == 3) {
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

  if (!category) {
    searchQuery = searchQuery.slice(2); // Remove the "s-""
  }

  // 0th result is the entire match, first is the group
  const page = pageMatch ? parseInt(pageMatch[1]) : 1;

  // Query params
  const searchParams = new URLSearchParams(url.searchParams);

  return {
    category,
    searchQuery,
    page,
    view: searchParams.get("view") || "list"
  };
}

export const getListings = (view: string): HTMLCollectionOf<HTMLElement> => {
  const className = view === "gallery" ? GALLERY_LISTINGS_CLASS_NAME : ROW_LISTINGS_CLASS_NAME;

  return document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
}

export const parseSearchQuery = (): string => {
  const searchNode = document.getElementById(SEARCH_TEXTBOX_ID);

  debug(`Search query: ${searchNode}`);

  return searchNode?.nodeValue || "Unknown";
}

export const parseListing = (view: string, listingsNode: HTMLElement): Listing => {
  const titleNode = listingsNode.getElementsByClassName(view === "gallery" ? GALLERY_LISTING_TITLE_CLASS_NAME: ROW_LISTING_TITLE_CLASS_NAME);
  debug(`Title node: ${titleNode[0].innerHTML}`);

  let title = titleNode?.[0]?.innerHTML;

  if (!title) {
    error('Title not found');
    title = "Unknown";
  }

  return {
    title
  }
}