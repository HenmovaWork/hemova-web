import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const portfolio = formData.get("portfolio") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const jobSlug = formData.get("jobSlug") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (!name || !email || !mobile || !jobSlug || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    // This is no longer needed with Vercel Blob Storage

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `job-applications/${jobSlug}_${name.replace(
      /\s+/g,
      "_"
    )}_${timestamp}.${fileExtension}`;

    // Upload file to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: "public",
    });

    const fileUrl = blob.url;

    // Create application record in database using Prisma
    const applicationData = await prisma.jobApplication.create({
      data: {
        jobId: jobSlug,
        name,
        email,
        phone: mobile,
        coverLetter: coverLetter || null,
        resumePath: fileUrl,
        status: "submitted",
      },
    });

    // In a real application, you would also:
    // 1. Send email notification to HR team
    // 2. Send confirmation email to applicant
    // 3. Store in database instead of JSON file
    // 4. Add proper logging and monitoring

    console.log(
      `New job application received for ${jobSlug} from ${name} (${email})`
    );

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationData.id,
    });
  } catch (error) {
    console.error("Job application submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
