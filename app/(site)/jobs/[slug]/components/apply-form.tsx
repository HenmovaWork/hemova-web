"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "@/components/site/phone-input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.object({
    countryCode: z.string().min(2, "Country code is required"),
    number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  }),
  portfolio: z
    .string()
    .url({ message: "Invalid URL." })
    .optional()
    .or(z.literal("")),
  coverLetter: z
    .string()
    .min(50, {
      message: "Cover letter must be at least 50 characters.",
    })
    .optional()
    .or(z.literal("")),
  file: z
    .any()
    .refine((files) => files?.length > 0, {
      message: "Please upload your resume.",
    })
    .refine((files) => files?.[0]?.size <= 10000000, {
      message: "Resume size must be less than 10MB.",
    })
    .refine(
      (files) => {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return allowedTypes.includes(files?.[0]?.type);
      },
      {
        message: "Only PDF, DOC, and DOCX files are allowed.",
      }
    ),
});

interface ApplyFormProps {
  jobSlug: string;
}

export default function ApplyForm({ jobSlug }: ApplyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: {
        countryCode: "+91",
        number: "",
      },
      portfolio: "",
      coverLetter: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobile", values.phone.countryCode + values.phone.number);
      formData.append("portfolio", values.portfolio || "");
      formData.append("coverLetter", values.coverLetter || "");
      formData.append("file", file);
      formData.append("jobSlug", jobSlug);

      const response = await fetch("/api/job-applications", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitMessage({
        type: "success",
        message:
          "Thank you for applying! We'll review your application and get back to you soon.",
      });

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to jobs page after a delay
      setTimeout(() => {
        router.push("/jobs");
      }, 3000);
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {submitMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitMessage.message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Phone Number *</FormLabel>
            <PhoneInput form={form} />
          </div>

          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio/LinkedIn URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-portfolio.com or https://linkedin.com/in/yourname"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Resume/CV *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      onChange(e.target.files);
                    }}
                    {...field}
                    ref={fileInputRef}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (max 10MB)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
