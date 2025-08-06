import { config, collection, fields, singleton } from "@keystatic/core";
import soham901Config from "./soham901.config";

export const markdocConfig = fields.markdoc.createMarkdocConfig({});

export default config({
  storage: {
    kind: "github",
    repo: `${soham901Config.backup.github.REPO_OWNER}/${soham901Config.backup.github.REPO_NAME}`,
  },
  ui: {
    brand: {
      name: soham901Config.brand.name,
      mark: () => <div></div>,
    },
    navigation: {
      Content: ["games", "blogs", "slides", "media", "jobs"],
      "Social Links": ["socialLinks"],
    },
  },
  singletons: {
    socialLinks: singleton({
      label: "Social Links",
      schema: {
        linkedin: fields.url({
          label: "Linkedin",
          defaultValue: "https://www.linkedin.com/company/henmova",
        }),
        youtube: fields.url({
          label: "Youtube",
          defaultValue: "https://www.youtube.com/@Henmova",
        }),
        discord: fields.url({
          label: "Discord",
          defaultValue: "https://discord.gg/cDqWFj3jGJ",
        }),
        x: fields.url({ label: "X", defaultValue: "https://x.com/Henmova" }),
        instagram: fields.url({
          label: "Instagram",
          defaultValue: "https://www.instagram.com/henmova",
        }),
      },
    }),
  },
  collections: {
    blogs: collection({
      label: "Blogs",
      slugField: "title",
      path: "data/blogs/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.markdoc({
          label: "Content",
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/blogs",
          publicPath: "/blogs/",
        }),
        publishedAt: fields.date({
          label: "Published Date",
          defaultValue: { kind: "today" },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "Brief description of the blog post",
        }),
      },
    }),
    games: collection({
      label: "Games",
      slugField: "title",
      path: "data/games/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        tagline: fields.text({
          label: "Tagline",
          description: "Short description or tagline for the game",
        }),
        content: fields.markdoc({
          label: "Description",
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/games",
          publicPath: "/games/",
        }),
        genres: fields.text({
          label: "Genres",
          description: "Comma-separated list of genres",
        }),
        artStyles: fields.text({
          label: "Art Styles",
          description: "Comma-separated list of art styles",
        }),
        platforms: fields.text({
          label: "Platforms",
          description: "Comma-separated list of platforms",
        }),
        downloadLinks: fields.array(
          fields.object({
            platform: fields.select({
              label: "Platform",
              options: [
                { label: "Steam", value: "steam" },
                { label: "Epic Games", value: "epic" },
                { label: "App Store", value: "appstore" },
                { label: "Google Play", value: "googleplay" },
              ],
              defaultValue: "steam",
            }),
            url: fields.url({
              label: "Download URL",
            }),
          }),
          {
            label: "Download Links",
            itemLabel: (props) => props.fields.platform.value,
          },
        ),
      },
    }),
    jobs: collection({
      label: "Jobs",
      slugField: "title",
      path: "data/jobs/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Job Title" } }),
        description: fields.text({
          label: "Job Description",
          multiline: true,
        }),
        content: fields.markdoc({
          label: "Detailed Description",
        }),
        jobType: fields.select({
          label: "Job Type",
          options: [
            { label: "Full Time", value: "fulltime" },
            { label: "Part Time", value: "parttime" },
            { label: "Contract", value: "contract" },
            { label: "Internship", value: "internship" },
          ],
          defaultValue: "fulltime",
        }),
        location: fields.text({
          label: "Location",
          description: "Job location (e.g., Remote, New York, etc.)",
        }),
        requirements: fields.array(fields.text({ label: "Requirement" }), {
          label: "Requirements",
          itemLabel: (props) => props.value,
        }),
        postedAt: fields.date({
          label: "Posted Date",
          defaultValue: { kind: "today" },
        }),
        isActive: fields.checkbox({
          label: "Active Job Listing",
          defaultValue: true,
        }),
      },
    }),
    slides: collection({
      label: "Slides",
      slugField: "title",
      path: "data/slides/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Slide Title" } }),
        backgroundImage: fields.image({
          label: "Background Image",
          directory: "public/carousel",
          publicPath: "/carousel/",
        }),
        overlayText: fields.text({
          label: "Overlay Text",
          multiline: true,
        }),
        titleImage: fields.image({
          label: "Title Image (Optional)",
          directory: "public/carousel",
          publicPath: "/carousel/",
        }),
        ctaButtons: fields.array(
          fields.object({
            text: fields.text({ label: "Button Text" }),
            url: fields.url({ label: "Button URL" }),
            style: fields.select({
              label: "Button Style",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Outline", value: "outline-solid" },
              ],
              defaultValue: "primary",
            }),
          }),
          {
            label: "Call-to-Action Buttons",
            itemLabel: (props) => props.fields.text.value,
          },
        ),
        order: fields.integer({
          label: "Display Order",
          description:
            "Order in which this slide appears (lower numbers first)",
        }),
        isActive: fields.checkbox({
          label: "Active Slide",
          defaultValue: true,
        }),
      },
    }),
    media: collection({
      label: "Media",
      slugField: "name",
      path: "data/media/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Media Name" } }),
        file: fields.image({
          label: "Media File",
          directory: "public/media",
          publicPath: "/media/",
        }),
        altText: fields.text({
          label: "Alt Text",
          description: "Alternative text for accessibility",
        }),
        caption: fields.text({
          label: "Caption",
          multiline: true,
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Game Screenshots", value: "game-screenshots" },
            { label: "Logos", value: "logos" },
            { label: "Icons", value: "icons" },
            { label: "Blog Images", value: "blog-images" },
            { label: "General", value: "general" },
          ],
          defaultValue: "general",
        }),
        tags: fields.text({
          label: "Tags",
          description: "Comma-separated tags for organization",
        }),
      },
    }),
  },
});
