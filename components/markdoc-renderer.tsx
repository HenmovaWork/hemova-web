"use client";

import React, { JSX } from "react";
import Markdoc from "@markdoc/markdoc";
import { MarkdocContent } from "../lib/types";

interface MarkdocRendererProps {
  content: MarkdocContent | string | any;
  className?: string;
}

// Simple renderer for Keystatic Markdoc content
function renderKeysticContent(content: any): React.ReactNode {
  if (!content) return null;

  // Handle text nodes
  if (content.$mdtype === "Text") {
    return content.value;
  }

  // Handle tag nodes
  if (content.$mdtype === "Tag") {
    const { name, children = [] } = content;

    switch (name) {
      case "document":
        return (
          <>
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </>
        );
      case "paragraph":
        return (
          <p className="mb-4">
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </p>
        );
      case "heading":
        const level = content.attributes?.level || 1;
        const HeadingTag = `h${level}` as
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        const headingClasses = {
          1: "text-4xl font-bold mb-4 mt-6",
          2: "text-3xl font-semibold mb-3 mt-5",
          3: "text-2xl font-semibold mb-2 mt-4",
          4: "text-xl font-semibold mb-2 mt-3",
          5: "text-lg font-semibold mb-2 mt-3",
          6: "text-base font-semibold mb-2 mt-3",
        };
        return (
          <HeadingTag
            className={headingClasses[level as keyof typeof headingClasses]}
          >
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </HeadingTag>
        );
      case "list":
        const isOrdered = content.attributes?.ordered;
        const ListTag = isOrdered ? "ol" : "ul";
        const listClass = isOrdered
          ? "list-decimal pl-5 mb-4"
          : "list-disc pl-5 mb-4";
        return (
          <ListTag className={listClass}>
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </ListTag>
        );
      case "listItem":
        return (
          <li className="mb-1">
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </li>
        );
      case "strong":
        return (
          <strong className="font-bold">
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </strong>
        );
      case "em":
        return (
          <em className="italic">
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </em>
        );
      case "code":
        return (
          <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </code>
        );
      case "link":
        return (
          <a
            href={content.attributes?.href}
            className="text-blue-600 hover:underline"
          >
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </a>
        );
      default:
        return (
          <div>
            {children.map((child: any, i: number) => (
              <React.Fragment key={i}>
                {renderKeysticContent(child)}
              </React.Fragment>
            ))}
          </div>
        );
    }
  }

  // Handle arrays
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((child: any, i: number) => (
          <React.Fragment key={i}>{renderKeysticContent(child)}</React.Fragment>
        ))}
      </>
    );
  }

  return null;
}

export function MarkdocRenderer({
  content,
  className = "",
}: MarkdocRendererProps) {
  // Handle null or undefined content
  if (!content) {
    return null;
  }

  // If content is a string, we need to parse and transform it
  if (typeof content === "string") {
    try {
      const ast = Markdoc.parse(content);
      const transformedContent = Markdoc.transform(ast);

      return (
        <div className={`prose prose-gray max-w-none ${className}`}>
          {Markdoc.renderers.react(transformedContent, React)}
        </div>
      );
    } catch (error) {
      console.error("Error rendering Markdoc content:", error);
      return (
        <div className={`text-red-600 ${className}`}>
          Error rendering content
        </div>
      );
    }
  }

  // Use the simple Keystatic content renderer
  try {
    return (
      <div className={`prose prose-gray max-w-none ${className}`}>
        {renderKeysticContent(content)}
      </div>
    );
  } catch (error) {
    console.error("Error rendering Keystatic content:", error);
    return (
      <div className={`text-red-600 ${className}`}>Error rendering content</div>
    );
  }
}

export default MarkdocRenderer;
