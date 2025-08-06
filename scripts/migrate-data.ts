import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function migrateContactSubmissions() {
  const contactsFile = join(process.cwd(), "data", "contact-submissions.json");

  if (existsSync(contactsFile)) {
    try {
      const contactsData = JSON.parse(readFileSync(contactsFile, "utf-8"));

      for (const contact of contactsData) {
        await prisma.contactSubmission.create({
          data: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            mobile: contact.mobile,
            topic: contact.topic,
            requirements: contact.requirements,
            fileName: contact.fileName,
            filePath: contact.filePath,
            submittedAt: new Date(contact.submittedAt),
            status: contact.status || "pending",
          },
        });
      }

      console.log(`✅ Migrated ${contactsData.length} contact submissions`);
    } catch (error) {
      console.error("❌ Error migrating contact submissions:", error);
    }
  }
}

async function migrateGames() {
  const gamesDir = join(process.cwd(), "data", "games");

  if (existsSync(gamesDir)) {
    try {
      const fs = await import("fs/promises");
      const gameFiles = await fs.readdir(gamesDir);

      for (const file of gameFiles) {
        if (file.endsWith(".json")) {
          const gameData = JSON.parse(
            readFileSync(join(gamesDir, file), "utf-8")
          );

          const slug = file.replace(".json", "");

          await prisma.game.create({
            data: {
              slug,
              title: gameData.title || slug,
              description: gameData.description || "",
              content: gameData.content || "",
              coverImage: gameData.coverImage,
              platforms: gameData.platforms || [],
              status: gameData.status || "development",
              releaseDate: gameData.releaseDate
                ? new Date(gameData.releaseDate)
                : null,
              featured: gameData.featured || false,
            },
          });
        }
      }

      console.log(
        `✅ Migrated ${
          gameFiles.filter((f) => f.endsWith(".json")).length
        } games`
      );
    } catch (error) {
      console.error("❌ Error migrating games:", error);
    }
  }
}

async function migrateBlogPosts() {
  const blogsDir = join(process.cwd(), "data", "blogs");

  if (existsSync(blogsDir)) {
    try {
      const fs = await import("fs/promises");
      const blogFiles = await fs.readdir(blogsDir);

      for (const file of blogFiles) {
        if (file.endsWith(".json")) {
          const blogData = JSON.parse(
            readFileSync(join(blogsDir, file), "utf-8")
          );

          const slug = file.replace(".json", "");

          await prisma.blogPost.create({
            data: {
              slug,
              title: blogData.title || slug,
              description: blogData.description || "",
              content: blogData.content || "",
              coverImage: blogData.coverImage,
              author: blogData.author,
              published: blogData.published || false,
              featured: blogData.featured || false,
              publishedAt: blogData.publishedAt
                ? new Date(blogData.publishedAt)
                : null,
            },
          });
        }
      }

      console.log(
        `✅ Migrated ${
          blogFiles.filter((f) => f.endsWith(".json")).length
        } blog posts`
      );
    } catch (error) {
      console.error("❌ Error migrating blog posts:", error);
    }
  }
}

async function migrateJobPostings() {
  const jobsDir = join(process.cwd(), "data", "jobs");

  if (existsSync(jobsDir)) {
    try {
      const fs = await import("fs/promises");
      const jobFiles = await fs.readdir(jobsDir);

      for (const file of jobFiles) {
        if (file.endsWith(".json")) {
          const jobData = JSON.parse(
            readFileSync(join(jobsDir, file), "utf-8")
          );

          const slug = file.replace(".json", "");

          await prisma.jobPosting.create({
            data: {
              slug,
              title: jobData.title || slug,
              department: jobData.department || "Technology",
              location: jobData.location || "Remote",
              type: jobData.type || "full-time",
              description: jobData.description || "",
              requirements: jobData.requirements || "",
              benefits: jobData.benefits,
              salaryRange: jobData.salaryRange,
              isActive: jobData.isActive !== false,
              featured: jobData.featured || false,
              applicationUrl: jobData.applicationUrl,
            },
          });
        }
      }

      console.log(
        `✅ Migrated ${
          jobFiles.filter((f) => f.endsWith(".json")).length
        } job postings`
      );
    } catch (error) {
      console.error("❌ Error migrating job postings:", error);
    }
  }
}

async function migrateCarouselSlides() {
  const slidesDir = join(process.cwd(), "data", "slides");

  if (existsSync(slidesDir)) {
    try {
      const fs = await import("fs/promises");
      const slideFiles = await fs.readdir(slidesDir);

      for (const file of slideFiles) {
        if (file.endsWith(".json")) {
          const slideData = JSON.parse(
            readFileSync(join(slidesDir, file), "utf-8")
          );

          await prisma.carouselSlide.create({
            data: {
              title: slideData.title || "",
              description: slideData.description,
              backgroundImage: slideData.backgroundImage || "",
              buttonText: slideData.buttonText,
              buttonUrl: slideData.buttonUrl,
              order: slideData.order || 0,
              isActive: slideData.isActive !== false,
            },
          });
        }
      }

      console.log(
        `✅ Migrated ${
          slideFiles.filter((f) => f.endsWith(".json")).length
        } carousel slides`
      );
    } catch (error) {
      console.error("❌ Error migrating carousel slides:", error);
    }
  }
}

async function main() {
  console.log("🚀 Starting data migration from JSON to PostgreSQL...");

  try {
    await migrateContactSubmissions();
    await migrateGames();
    await migrateBlogPosts();
    await migrateJobPostings();
    await migrateCarouselSlides();

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
