const PAGE_REGEX = new RegExp(/^page\-(\d+)$/);

export type UrlComponents = {
  category: string;
  searchQuery: string;
  page: number;
  view?: string;
}

export const parsePath = (urlString: string): UrlComponents => {
  const url = new URL(urlString);
  const pathTokens = url.pathname.split('/');

  const [_, category, searchQuery, ...rest] = pathTokens;

  const pageMatch = PAGE_REGEX.exec(rest[0]);

  // 0th result is the entire match, first is the group
  const page = pageMatch ? parseInt(pageMatch[1]) : 1;

  // Query params
  const searchParams = new URLSearchParams(url.searchParams);

  return {
    category,
    searchQuery,
    page,
    view: searchParams.get("view") || undefined
  };
}

// TODO: Improve
export const info = (msg: string) => {
  console.log(`[Silver Dollar] ${msg}`);
}

export const debug = (msg: string) => {
  console.log(`[Silver Dollar] ${msg}`);
}

export const error = (msg: string) => {
  console.error(`[Silver Dollar] ${msg}`);
}