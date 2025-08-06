"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import PhoneInput from "@/components/site/phone-input";

export default function WorkTogetherForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.object({
      countryCode: z.string().min(2, "Country code is required"),
      number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    }),
    topic: z.string().min(4, {
      message: "Topic must be at least 4 characters.",
    }),
    requirements: z.string().min(12, {
      message: "Requirements must be at least 12 characters.",
    }),
    file: z
      .any()
      .refine(() => fileInputRef.current?.files?.length, {
        message: "Please upload your document.",
      })
      .refine(() => (fileInputRef.current?.files?.[0]?.size || 0) < 1000000, {
        message: "File size must be less than 1MB.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: {
        countryCode: "+91",
        number: "",
      },
      topic: "",
      requirements: "",
      file: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Sending your message...");
    try {
      const file = fileInputRef.current?.files?.[0];
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobile", values.phone.countryCode + values.phone.number);
      formData.append("topic", values.topic);
      formData.append("requirements", values.requirements);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss();
        toast.error(data.message || "Something went wrong");
        return;
      }

      if (data.errors) {
        toast.dismiss();
        toast.error(data.errors[0].message);
        return;
      }

      toast.dismiss();
      toast.success("Thank you for contacting us! We'll get back to you soon.");
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PhoneInput form={form} />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Project topic or subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your project requirements in detail..."
                  className="min-h-[100px]"
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
              <FormLabel>Document (PDF)</FormLabel>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  onChange={(e) => {
                    onChange(e.target.files?.[0]);
                  }}
                  type="file"
                  accept="application/pdf"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          REQUEST A QUOTE
        </Button>
      </form>
    </Form>
  );
}
