import { Blog, Game, Job, ContentListResult } from "./types";
import { ContentService } from "./content";
import { MarkdocRenderer } from "./markdoc";

// Search and filtering utilities
export class ContentSearchService {
  /**
   * Search across all blog posts
   */
  static async searchBlogs(query: string, limit?: number): Promise<Blog[]> {
    const allBlogs = await ContentService.blogs.getAll();
    const searchTerm = query.toLowerCase();

    const filteredBlogs = allBlogs.items.filter((blog) => {
      const titleMatch = blog.title.toLowerCase().includes(searchTerm);
      const excerptMatch = blog.excerpt.toLowerCase().includes(searchTerm);
      const contentText = MarkdocRenderer.extractText(
        blog.content,
      ).toLowerCase();
      const contentMatch = contentText.includes(searchTerm);

      return titleMatch || excerptMatch || contentMatch;
    });

    return limit ? filteredBlogs.slice(0, limit) : filteredBlogs;
  }

  /**
   * Search across all games
   */
  static async searchGames(query: string, limit?: number): Promise<Game[]> {
    const allGames = await ContentService.games.getAll();
    const searchTerm = query.toLowerCase();

    const filteredGames = allGames.items.filter((game) => {
      const titleMatch = game.title.toLowerCase().includes(searchTerm);
      const taglineMatch = game.tagline.toLowerCase().includes(searchTerm);
      const genresMatch = game.genres.toLowerCase().includes(searchTerm);
      const platformsMatch = game.platforms.toLowerCase().includes(searchTerm);
      const contentText = MarkdocRenderer.extractText(
        game.content,
      ).toLowerCase();
      const contentMatch = contentText.includes(searchTerm);

      return (
        titleMatch ||
        taglineMatch ||
        genresMatch ||
        platformsMatch ||
        contentMatch
      );
    });

    return limit ? filteredGames.slice(0, limit) : filteredGames;
  }

  /**
   * Search across all jobs
   */
  static async searchJobs(query: string, limit?: number): Promise<Job[]> {
    const allJobs = await ContentService.jobs.getAll();
    const searchTerm = query.toLowerCase();

    const filteredJobs = allJobs.items.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = job.description
        .toLowerCase()
        .includes(searchTerm);
      const locationMatch = job.location.toLowerCase().includes(searchTerm);
      const requirementsMatch = job.requirements.some((req) =>
        req.toLowerCase().includes(searchTerm),
      );
      const contentText = MarkdocRenderer.extractText(
        job.content,
      ).toLowerCase();
      const contentMatch = contentText.includes(searchTerm);

      return (
        titleMatch ||
        descriptionMatch ||
        locationMatch ||
        requirementsMatch ||
        contentMatch
      );
    });

    return limit ? filteredJobs.slice(0, limit) : filteredJobs;
  }

  /**
   * Global search across all content types
   */
  static async globalSearch(
    query: string,
    limit: number = 10,
  ): Promise<{
    blogs: Blog[];
    games: Game[];
    jobs: Job[];
    total: number;
  }> {
    const [blogs, games, jobs] = await Promise.all([
      this.searchBlogs(query, Math.ceil(limit / 3)),
      this.searchGames(query, Math.ceil(limit / 3)),
      this.searchJobs(query, Math.ceil(limit / 3)),
    ]);

    return {
      blogs,
      games,
      jobs,
      total: blogs.length + games.length + jobs.length,
    };
  }
}

// Content filtering utilities
export class ContentFilterService {
  /**
   * Filter games by multiple criteria
   */
  static async filterGames(filters: {
    genres?: string[];
    platforms?: string[];
    artStyles?: string[];
  }): Promise<Game[]> {
    const allGames = await ContentService.games.getAll();

    return allGames.items.filter((game) => {
      if (filters.genres && filters.genres.length > 0) {
        const gameGenres = game.genres
          .toLowerCase()
          .split(",")
          .map((g) => g.trim());
        const hasGenre = filters.genres.some((genre) =>
          gameGenres.some((gameGenre) =>
            gameGenre.includes(genre.toLowerCase()),
          ),
        );
        if (!hasGenre) return false;
      }

      if (filters.platforms && filters.platforms.length > 0) {
        const gamePlatforms = game.platforms
          .toLowerCase()
          .split(",")
          .map((p) => p.trim());
        const hasPlatform = filters.platforms.some((platform) =>
          gamePlatforms.some((gamePlatform) =>
            gamePlatform.includes(platform.toLowerCase()),
          ),
        );
        if (!hasPlatform) return false;
      }

      if (filters.artStyles && filters.artStyles.length > 0) {
        const gameArtStyles = game.artStyles
          .toLowerCase()
          .split(",")
          .map((a) => a.trim());
        const hasArtStyle = filters.artStyles.some((artStyle) =>
          gameArtStyles.some((gameArtStyle) =>
            gameArtStyle.includes(artStyle.toLowerCase()),
          ),
        );
        if (!hasArtStyle) return false;
      }

      return true;
    });
  }

  /**
   * Filter jobs by type and location
   */
  static async filterJobs(filters: {
    jobTypes?: string[];
    locations?: string[];
    remote?: boolean;
  }): Promise<Job[]> {
    const allJobs = await ContentService.jobs.getAll();

    return allJobs.items.filter((job) => {
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        if (!filters.jobTypes.includes(job.jobType)) return false;
      }

      if (filters.locations && filters.locations.length > 0) {
        const hasLocation = filters.locations.some((location) =>
          job.location.toLowerCase().includes(location.toLowerCase()),
        );
        if (!hasLocation) return false;
      }

      if (filters.remote !== undefined) {
        const isRemote = job.location.toLowerCase().includes("remote");
        if (filters.remote && !isRemote) return false;
        if (!filters.remote && isRemote) return false;
      }

      return true;
    });
  }

  /**
   * Filter blogs by date range
   */
  static async filterBlogsByDateRange(
    startDate?: string,
    endDate?: string,
  ): Promise<Blog[]> {
    const allBlogs = await ContentService.blogs.getAll();

    return allBlogs.items.filter((blog) => {
      const blogDate = new Date(blog.publishedAt);

      if (startDate) {
        const start = new Date(startDate);
        if (blogDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (blogDate > end) return false;
      }

      return true;
    });
  }
}

// Content aggregation utilities
export class ContentAggregationService {
  /**
   * Get homepage content bundle
   */
  static async getHomepageContent(): Promise<{
    featuredGames: Game[];
    recentBlogs: Blog[];
    activeSlides: any[];
    openJobs: Job[];
  }> {
    const [featuredGames, recentBlogs, activeSlides, openJobs] =
      await Promise.all([
        ContentService.games.getFeatured(6),
        ContentService.blogs.getRecent(3),
        ContentService.slides.getActive(),
        ContentService.jobs.getAll({ limit: 3 }),
      ]);

    return {
      featuredGames,
      recentBlogs,
      activeSlides,
      openJobs: openJobs.items,
    };
  }

  /**
   * Get related content based on tags/categories
   */
  static async getRelatedContent(
    contentType: "blog" | "game" | "job",
    currentSlug: string,
    limit: number = 3,
  ): Promise<Blog[] | Game[] | Job[]> {
    switch (contentType) {
      case "blog":
        const currentBlog = await ContentService.blogs.getBySlug(currentSlug);
        const allBlogs = await ContentService.blogs.getAll();
        // Simple related logic - exclude current and return recent
        return allBlogs.items
          .filter((blog) => blog.slug !== currentSlug)
          .slice(0, limit);

      case "game":
        const currentGame = await ContentService.games.getBySlug(currentSlug);
        const relatedGames = await ContentFilterService.filterGames({
          genres: currentGame.genres
            .split(",")
            .map((g) => g.trim())
            .slice(0, 2),
        });
        return relatedGames
          .filter((game) => game.slug !== currentSlug)
          .slice(0, limit);

      case "job":
        const currentJob = await ContentService.jobs.getBySlug(currentSlug);
        const relatedJobs = await ContentFilterService.filterJobs({
          jobTypes: [currentJob.jobType],
        });
        return relatedJobs
          .filter((job) => job.slug !== currentSlug)
          .slice(0, limit);

      default:
        return [];
    }
  }

  /**
   * Get content statistics
   */
  static async getContentStats(): Promise<{
    totalBlogs: number;
    totalGames: number;
    totalJobs: number;
    recentActivity: {
      type: "blog" | "game" | "job";
      title: string;
      slug: string;
      date: string;
    }[];
  }> {
    const [blogs, games, jobs] = await Promise.all([
      ContentService.blogs.getAll(),
      ContentService.games.getAll(),
      ContentService.jobs.getAll(),
    ]);

    // Combine recent activity from all content types
    const recentActivity = [
      ...blogs.items.slice(0, 3).map((blog) => ({
        type: "blog" as const,
        title: blog.title,
        slug: blog.slug,
        date: blog.publishedAt,
      })),
      ...jobs.items.slice(0, 2).map((job) => ({
        type: "job" as const,
        title: job.title,
        slug: job.slug,
        date: job.postedAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      totalBlogs: blogs.total,
      totalGames: games.total,
      totalJobs: jobs.total,
      recentActivity: recentActivity.slice(0, 5),
    };
  }
}

// Content validation utilities
export class ContentValidationService {
  /**
   * Validate content structure
   */
  static validateBlog(blog: Partial<Blog>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!blog.title || blog.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!blog.slug || blog.slug.trim().length === 0) {
      errors.push("Slug is required");
    }

    if (!blog.content) {
      errors.push("Content is required");
    }

    if (!blog.publishedAt) {
      errors.push("Published date is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate slug format
   */
  static validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }

  /**
   * Check if slug is unique
   */
  static async isSlugUnique(
    slug: string,
    contentType: "blog" | "game" | "job",
    excludeSlug?: string,
  ): Promise<boolean> {
    try {
      let content;
      switch (contentType) {
        case "blog":
          content = await ContentService.blogs.getBySlug(slug);
          break;
        case "game":
          content = await ContentService.games.getBySlug(slug);
          break;
        case "job":
          content = await ContentService.jobs.getBySlug(slug);
          break;
      }

      // If content exists and it's not the one we're excluding, slug is not unique
      return !content || (excludeSlug ? content.slug === excludeSlug : false);
    } catch (error) {
      // If content doesn't exist (throws error), slug is unique
      return true;
    }
  }
}
