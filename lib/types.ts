// Core content types based on Keystatic schema

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface DownloadLink {
  platform: "steam" | "epic" | "appstore" | "googleplay";
  url: string;
}

export interface CTAButton {
  text: string;
  url: string;
  style: "primary" | "secondary" | "outline-solid";
  target?: "_blank" | "_self"; // Optional, defaults to "_self"
}

// Blog content type
export interface Blog {
  slug: string;
  title: string;
  content: any; // Markdoc content
  coverImage: ImageAsset;
  publishedAt: string;
  excerpt: string;
}

// Game content type
export interface Game {
  slug: string;
  title: string;
  tagline: string;
  content: any; // Markdoc content
  coverImage: ImageAsset;
  genres: string;
  artStyles: string;
  platforms: string;
  downloadLinks: DownloadLink[];
}

// Job content type
export interface Job {
  slug: string;
  title: string;
  description: string;
  content: any; // Markdoc content
  jobType: "fulltime" | "parttime" | "contract" | "internship";
  location: string;
  requirements: string[];
  postedAt: string;
  isActive: boolean;
}

// Slide content type
export interface Slide {
  slug: string;
  title: string;
  backgroundImage: ImageAsset;
  overlayText: string;
  titleImage?: ImageAsset;
  ctaButtons: CTAButton[];
  order: number;
  isActive: boolean;
}

// Media content type
export interface Media {
  slug: string;
  name: string;
  file: ImageAsset;
  altText: string;
  caption: string;
  category: "game-screenshots" | "logos" | "icons" | "blog-images" | "general";
  tags: string;
}

// Utility types for content fetching
export interface ContentListOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ContentListResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

// Rich text rendering types
export interface MarkdocContent {
  $$mdtype: "Tag";
  name: string;
  attributes: Record<string, any>;
  children: MarkdocContent[];
}

// Error types
export class ContentError extends Error {
  code: "NOT_FOUND" | "INVALID_SLUG" | "FETCH_ERROR" | "PARSE_ERROR";
  details?: any;

  constructor(
    message: string,
    code: "NOT_FOUND" | "INVALID_SLUG" | "FETCH_ERROR" | "PARSE_ERROR",
    details?: any,
  ) {
    super(message);
    this.name = "ContentError";
    this.code = code;
    this.details = details;
  }
}
