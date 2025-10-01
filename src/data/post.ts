import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft courses based on the environment */
export async function getAllPosts(): Promise<CollectionEntry<"courses">[]> {
	return await getCollection("courses", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** groups courses by topic (alphabetically), with courses sorted by order within each topic */
export function groupPostsByTopic(posts: CollectionEntry<"courses">[]) {
	const grouped = posts.reduce<Record<string, CollectionEntry<"courses">[]>>((acc, post) => {
		const topic = post.data.topic || "(No Topic)";
		if (!acc[topic]) {
			acc[topic] = [];
		}
		acc[topic]?.push(post);
		return acc;
	}, {});
	// Sort courses within each topic by order field (ascending)
	for (const topic in grouped) {
		grouped[topic]?.sort((a, b) => {
			const orderA = parseInt(a.data.order) || 999;
			const orderB = parseInt(b.data.order) || 999;
			return orderA - orderB;
		});
	}
	return Object.fromEntries(
		Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
	);
}
