import BlogPostClient from "./BlogPostClient";
import { POSTS_LIST } from "../../../lib/posts";

export async function generateStaticParams() {
  return POSTS_LIST.map(p => ({ slug: p.slug }));
}

export default function Page({ params }) {
  return <BlogPostClient params={params} />;
}
