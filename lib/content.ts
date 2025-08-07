import { reader } from "@/app/(site)/reader";
import {
  Blog,
  Game,
  Job,
  Slide,
  Media,
  Legal,
  ContentListOptions,
  ContentListResult,
  ContentError,
  ImageAsset,
  DownloadLink,
  CTAButton,
} from "./types";

// Utility function to transform Keystatic image data to ImageAsset
function transformImageAsset(imageData: any): ImageAsset {
  if (!imageData) {
    return {
      src: "",
      alt: "",
      width: 0,
      height: 0,
    };
  }

  // If imageData is just a string (file path), return it as src
  if (typeof imageData === "string") {
    return {
      src: imageData,
      alt: "",
      width: 800,
      height: 450,
    };
  }

  return {
    src: imageData.src || imageData,
    alt: imageData.alt || "",
    width: imageData.width || 800,
    height: imageData.height || 450,
  };
}

// Utility function to safely serialize content
function safeSerializeContent(content: any): any {
  if (!content || content === undefined || content === null) return null;

  try {
    // Convert to plain object by serializing and parsing
    return JSON.parse(JSON.stringify(content));
  } catch (error) {
    console.warn("Failed to serialize content:", error);
    return null;
  }
}

// Blog content utilities
export class BlogService {
  static async getAll(
    options: ContentListOptions = {}
  ): Promise<ContentListResult<Blog>> {
    try {
      const blogs = await reader.collections.blogs.all();

      const transformedBlogs: Blog[] = await Promise.all(
        blogs.map(async ({ slug, entry }) => ({
          slug,
          title: entry.title || "",
          content: entry.content
            ? safeSerializeContent(await entry.content())
            : null,
          coverImage: transformImageAsset(entry.coverImage),
          publishedAt: entry.publishedAt || new Date().toISOString(),
          excerpt: entry.excerpt || "",
        }))
      );

      // Sort by published date (newest first)
      const sortedBlogs = transformedBlogs.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Apply pagination if specified
      const { limit, offset = 0 } = options;
      const paginatedBlogs = limit
        ? sortedBlogs.slice(offset, offset + limit)
        : sortedBlogs.slice(offset);

      return {
        items: paginatedBlogs,
        total: transformedBlogs.length,
        hasMore: limit ? offset + limit < transformedBlogs.length : false,
      };
    } catch (error) {
      throw new ContentError("Failed to fetch blogs", "FETCH_ERROR", error);
    }
  }

  static async getBySlug(slug: string): Promise<Blog> {
    try {
      const entry = await reader.collections.blogs.read(slug);

      if (!entry) {
        throw new ContentError(
          `Blog with slug "${slug}" not found`,
          "NOT_FOUND"
        );
      }

      return {
        slug,
        title: entry.title,
        content: entry.content
          ? safeSerializeContent(await entry.content())
          : null,
        coverImage: transformImageAsset(entry.coverImage),
        publishedAt: entry.publishedAt ?? "",
        excerpt: entry.excerpt,
      };
    } catch (error) {
      if (error instanceof ContentError) {
        throw error;
      }
      throw new ContentError(
        `Failed to fetch blog with slug "${slug}"`,
        "FETCH_ERROR",
        error
      );
    }
  }

  static async getRecent(count: number = 3): Promise<Blog[]> {
    const result = await this.getAll({ limit: count });
    return result.items;
  }
}

// Game content utilities
export class GameService {
  static async getAll(
    options: ContentListOptions = {}
  ): Promise<ContentListResult<Game>> {
    try {
      const games = await reader.collections.games.all();

      const transformedGames: Game[] = await Promise.all(
        games.map(async ({ slug, entry }) => ({
          slug,
          title: entry.title || "",
          tagline: entry.tagline || "",
          content: entry.content
            ? safeSerializeContent(await entry.content())
            : null,
          coverImage: transformImageAsset(entry.coverImage),
          genres: entry.genres || "",
          artStyles: entry.artStyles || "",
          platforms: entry.platforms || "",
          downloadLinks: (entry.downloadLinks as DownloadLink[]) || [],
        }))
      );

      // Sort by title alphabetically
      const sortedGames = transformedGames.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      // Apply pagination if specified
      const { limit, offset = 0 } = options;
      const paginatedGames = limit
        ? sortedGames.slice(offset, offset + limit)
        : sortedGames.slice(offset);

      return {
        items: paginatedGames,
        total: transformedGames.length,
        hasMore: limit ? offset + limit < transformedGames.length : false,
      };
    } catch (error) {
      throw new ContentError("Failed to fetch games", "FETCH_ERROR", error);
    }
  }

  static async getBySlug(slug: string): Promise<Game> {
    try {
      const entry = await reader.collections.games.read(slug);

      if (!entry) {
        throw new ContentError(
          `Game with slug "${slug}" not found`,
          "NOT_FOUND"
        );
      }

      return {
        slug,
        title: entry.title,
        tagline: entry.tagline,
        content: entry.content
          ? safeSerializeContent(await entry.content())
          : null,
        coverImage: transformImageAsset(entry.coverImage),
        genres: entry.genres,
        artStyles: entry.artStyles,
        platforms: entry.platforms,
        downloadLinks: entry.downloadLinks as DownloadLink[],
      };
    } catch (error) {
      if (error instanceof ContentError) {
        throw error;
      }
      throw new ContentError(
        `Failed to fetch game with slug "${slug}"`,
        "FETCH_ERROR",
        error
      );
    }
  }

  static async getFeatured(count: number = 6): Promise<Game[]> {
    const result = await this.getAll({ limit: count });
    return result.items;
  }

  static async getByGenre(genre: string): Promise<Game[]> {
    const allGames = await this.getAll();
    return allGames.items.filter((game) =>
      game.genres.toLowerCase().includes(genre.toLowerCase())
    );
  }
}

// Job content utilities
export class JobService {
  static async getAll(
    options: ContentListOptions = {}
  ): Promise<ContentListResult<Job>> {
    try {
      const jobs = await reader.collections.jobs.all();

      const transformedJobs: Job[] = await Promise.all(
        jobs.map(async ({ slug, entry }) => ({
          slug,
          title: entry.title,
          description: entry.description || "",
          content: entry.content
            ? safeSerializeContent(await entry.content())
            : null,
          jobType: entry.jobType,
          location: entry.location || "",
          requirements: entry.requirements ? [...entry.requirements] : [],
          postedAt: entry.postedAt || new Date().toISOString(),
          isActive: entry.isActive,
        }))
      );

      // Filter only active jobs and sort by posted date (newest first)
      const activeJobs = transformedJobs
        .filter((job) => job.isActive)
        .sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );

      // Apply pagination if specified
      const { limit, offset = 0 } = options;
      const paginatedJobs = limit
        ? activeJobs.slice(offset, offset + limit)
        : activeJobs.slice(offset);

      return {
        items: paginatedJobs,
        total: activeJobs.length,
        hasMore: limit ? offset + limit < activeJobs.length : false,
      };
    } catch (error) {
      throw new ContentError("Failed to fetch jobs", "FETCH_ERROR", error);
    }
  }

  static async getBySlug(slug: string): Promise<Job> {
    try {
      const entry = await reader.collections.jobs.read(slug);

      if (!entry) {
        throw new ContentError(
          `Job with slug "${slug}" not found`,
          "NOT_FOUND"
        );
      }

      return {
        slug,
        title: entry.title,
        description: entry.description,
        content: entry.content
          ? safeSerializeContent(await entry.content())
          : null,
        jobType: entry.jobType,
        location: entry.location,
        requirements: entry.requirements as string[],
        postedAt: entry.postedAt ?? "",
        isActive: entry.isActive,
      };
    } catch (error) {
      if (error instanceof ContentError) {
        throw error;
      }
      throw new ContentError(
        `Failed to fetch job with slug "${slug}"`,
        "FETCH_ERROR",
        error
      );
    }
  }

  static async getByType(jobType: string): Promise<Job[]> {
    const allJobs = await this.getAll();
    return allJobs.items.filter((job) => job.jobType === jobType);
  }
}

// Slide content utilities
export class SlideService {
  static async getAll(): Promise<Slide[]> {
    try {
      const slides = await reader.collections.slides.all();

      const transformedSlides: Slide[] = slides.map(({ slug, entry }) => ({
        slug,
        title: entry.title,
        backgroundImage: transformImageAsset(entry.backgroundImage),
        overlayText: entry.overlayText,
        titleImage: entry.titleImage
          ? transformImageAsset(entry.titleImage)
          : undefined,
        ctaButtons: entry.ctaButtons as CTAButton[],
        order: entry.order || 0,
        isActive: entry.isActive,
      }));

      // Filter active slides and sort by order
      return transformedSlides
        .filter((slide) => slide.isActive)
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new ContentError("Failed to fetch slides", "FETCH_ERROR", error);
    }
  }

  static async getActive(): Promise<Slide[]> {
    return this.getAll(); // getAll already filters for active slides
  }
}

// Media content utilities
export class MediaService {
  static async getAll(
    options: ContentListOptions = {}
  ): Promise<ContentListResult<Media>> {
    try {
      const media = await reader.collections.media.all();

      const transformedMedia: Media[] = media.map(({ slug, entry }) => ({
        slug,
        name: entry.name,
        file: transformImageAsset(entry.file),
        altText: entry.altText,
        caption: entry.caption,
        category: entry.category,
        tags: entry.tags,
      }));

      // Sort by name alphabetically
      const sortedMedia = transformedMedia.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Apply pagination if specified
      const { limit, offset = 0 } = options;
      const paginatedMedia = limit
        ? sortedMedia.slice(offset, offset + limit)
        : sortedMedia.slice(offset);

      return {
        items: paginatedMedia,
        total: transformedMedia.length,
        hasMore: limit ? offset + limit < transformedMedia.length : false,
      };
    } catch (error) {
      throw new ContentError("Failed to fetch media", "FETCH_ERROR", error);
    }
  }

  static async getByCategory(category: string): Promise<Media[]> {
    const allMedia = await this.getAll();
    return allMedia.items.filter((media) => media.category === category);
  }

  static async getBySlug(slug: string): Promise<Media> {
    try {
      const entry = await reader.collections.media.read(slug);

      if (!entry) {
        throw new ContentError(
          `Media with slug "${slug}" not found`,
          "NOT_FOUND"
        );
      }

      return {
        slug,
        name: entry.name,
        file: transformImageAsset(entry.file),
        altText: entry.altText,
        caption: entry.caption,
        category: entry.category,
        tags: entry.tags,
      };
    } catch (error) {
      if (error instanceof ContentError) {
        throw error;
      }
      throw new ContentError(
        `Failed to fetch media with slug "${slug}"`,
        "FETCH_ERROR",
        error
      );
    }
  }
}

// Legal content utilities
export class LegalService {
  static async getAll(
    options: ContentListOptions = {}
  ): Promise<ContentListResult<Legal>> {
    try {
      const legal = await reader.collections.legal.all();

      const transformedLegal: Legal[] = await Promise.all(
        legal.map(async ({ slug, entry }) => ({
          slug,
          title: entry.title || "",
          content: entry.content
            ? safeSerializeContent(await entry.content())
            : null,
          lastUpdated: entry.lastUpdated || new Date().toISOString(),
          excerpt: entry.excerpt || "",
        }))
      );

      // Sort by last updated date (newest first)
      const sortedLegal = transformedLegal.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );

      // Apply pagination if specified
      const { limit, offset = 0 } = options;
      const paginatedLegal = limit
        ? sortedLegal.slice(offset, offset + limit)
        : sortedLegal.slice(offset);

      return {
        items: paginatedLegal,
        total: transformedLegal.length,
        hasMore: limit ? offset + limit < transformedLegal.length : false,
      };
    } catch (error) {
      throw new ContentError(
        "Failed to fetch legal pages",
        "FETCH_ERROR",
        error
      );
    }
  }

  static async getBySlug(slug: string): Promise<Legal> {
    try {
      const entry = await reader.collections.legal.read(slug);
      if (!entry) {
        throw new ContentError(
          `Legal page with slug "${slug}" not found`,
          "NOT_FOUND"
        );
      }

      return {
        slug,
        title: entry.title || "",
        content: entry.content
          ? safeSerializeContent(await entry.content())
          : null,
        lastUpdated: entry.lastUpdated || new Date().toISOString(),
        excerpt: entry.excerpt || "",
      };
    } catch (error) {
      if (error instanceof ContentError) {
        throw error;
      }
      throw new ContentError(
        `Failed to fetch legal page with slug "${slug}"`,
        "FETCH_ERROR",
        error
      );
    }
  }
}

// Unified content service for convenience
export class ContentService {
  static blogs = BlogService;
  static games = GameService;
  static jobs = JobService;
  static slides = SlideService;
  static media = MediaService;
  static legal = LegalService;
}
