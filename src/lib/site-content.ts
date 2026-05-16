export interface PageContent {
  writeUp: string;
  images: string[];
}

export interface SiteContent {
  pages: Record<string, PageContent>;
}

const STORAGE_KEY = "ecclesia_site_content";

const emptyContent: SiteContent = {
  pages: {},
};

export const getSiteContent = (): SiteContent => {
  if (typeof window === "undefined") return emptyContent;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyContent;
    return JSON.parse(stored) as SiteContent;
  } catch {
    return emptyContent;
  }
};

export const saveSiteContent = (content: SiteContent) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
};

export const getPageContent = (pagePath: string): PageContent => {
  const normalizedPath = normalizePath(pagePath);
  const content = getSiteContent();
  return content.pages[normalizedPath] || { writeUp: "", images: [] };
};

export const savePageContent = (pagePath: string, pageContent: PageContent) => {
  const normalizedPath = normalizePath(pagePath);
  const content = getSiteContent();
  saveSiteContent({
    ...content,
    pages: {
      ...content.pages,
      [normalizedPath]: {
        writeUp: pageContent.writeUp,
        images: pageContent.images,
      },
    },
  });
};

export const clearPageContent = (pagePath: string) => {
  const normalizedPath = normalizePath(pagePath);
  const content = getSiteContent();
  const pages = { ...content.pages };
  delete pages[normalizedPath];
  saveSiteContent({ ...content, pages });
};

export const normalizePath = (path: string) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};
