import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const topic = formData.get("topic") as string;
    const requirements = formData.get("requirements") as string;
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (!name || !email || !mobile || !topic || !requirements) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    let fileName = null;
    let fileUrl = null;

    // Handle file upload if provided
    if (file && file.size > 0) {
      // Validate file size (1MB limit as per form validation)
      if (file.size > 1024 * 1024) {
        return NextResponse.json(
          {
            error: "File too large",
            message: "File size must be less than 1MB",
          },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type", message: "Only PDF files are allowed" },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      fileName = `contact_${name.replace(
        /\s+/g,
        "_"
      )}_${timestamp}.${fileExtension}`;
      const blobFileName = `contact-forms/${fileName}`;

      // Upload file to Vercel Blob Storage
      const blob = await put(blobFileName, file, {
        access: "public",
      });

      fileUrl = blob.url;
    }

    // Create contact record in database using Prisma
    const contactData = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        mobile,
        topic,
        requirements,
        fileName,
        filePath: fileUrl,
        status: "pending",
      },
    });

    // Log the contact submission
    console.log(
      `New contact form submission from ${name} (${email}) - Topic: ${topic}`
    );

    // In a real application, you would also:
    // 1. Send email notification to the team
    // 2. Send confirmation email to the user
    // 3. Add proper logging and monitoring
    // 4. Integrate with CRM or project management tools

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      contactId: contactData.id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
