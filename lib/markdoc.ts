import Markdoc from "@markdoc/markdoc";
import { MarkdocContent } from "./types";

// Simple Markdoc configuration without complex transforms
const config = {
  nodes: {},
  tags: {},
};

// Content transformation utilities
export class MarkdocRenderer {
  /**
   * Parse Markdoc content from string
   */
  static parse(content: string): any {
    try {
      return Markdoc.parse(content);
    } catch (error) {
      console.error("Failed to parse Markdoc content:", error);
      return null;
    }
  }

  /**
   * Transform parsed Markdoc AST to renderable content
   */
  static transform(ast: any): any {
    try {
      const result = Markdoc.transform(ast, config);
      return (
        result || {
          $$mdtype: "Tag",
          name: "div",
          attributes: {},
          children: [],
        }
      );
    } catch (error) {
      console.error("Failed to transform Markdoc content:", error);
      return {
        $$mdtype: "Tag",
        name: "div",
        attributes: {},
        children: [],
      };
    }
  }

  /**
   * Complete pipeline: parse, transform, and prepare for rendering
   */
  static processContent(content: string): any {
    const ast = this.parse(content);
    if (!ast) {
      return {
        $$mdtype: "Tag",
        name: "div",
        attributes: {},
        children: [],
      };
    }
    return this.transform(ast);
  }

  /**
   * Extract plain text from Markdoc content (useful for excerpts)
   */
  static extractText(content: string, maxLength?: number): string {
    try {
      const ast = this.parse(content);
      if (!ast) return "";

      const extractTextFromNode = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
        if (node.children) return extractTextFromNode(node.children);
        return "";
      };

      const text = extractTextFromNode(ast).replace(/\s+/g, " ").trim();

      if (maxLength && text.length > maxLength) {
        return text.substring(0, maxLength).trim() + "...";
      }

      return text;
    } catch (error) {
      console.error("Failed to extract text from Markdoc content:", error);
      return "";
    }
  }

  /**
   * Generate reading time estimate
   */
  static estimateReadingTime(content: string): number {
    const text = this.extractText(content);
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
