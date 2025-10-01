import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
});

const courses = defineCollection({
	loader: glob({ base: "./src/content/courses", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			topic: z.string().optional().default("") ,
			order: z.string().optional().default("999"),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			thumbnail: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		order: z.string().optional().default("999"),
	}),
});

export const collections = { courses, note };
