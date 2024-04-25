import { getAllBlogs, getBlog } from "@/lib/contentful/api";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ContentfulPreviewProvider } from "@/components/contentful-preview-provider";
import { Post } from "@/components/post";

export interface ContentfulBlogProps {
  sys: {
    id: string;
  };
  slug: string;
  title: string;
  author: {
    name: string;
  };
  coverImage?: {
    url: string;
  };
  date: Date;
  excerpt: string;
  content: {
    json: any;
  };
}

export async function generateStaticParams() {
  const allBlogs = await getAllBlogs();

  return allBlogs.map((blog: ContentfulBlogProps) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled } = draftMode();
  const blog = await getBlog(params.slug, isEnabled);

  if (!blog) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <section className="w-full">
        <div className="container space-y-12 px-4 md:px-6">
          <ContentfulPreviewProvider
            locale="en-US"
            enableInspectorMode={isEnabled}
            enableLiveUpdates={isEnabled}
          >
            <Post blog={blog} />
          </ContentfulPreviewProvider>
        </div>
      </section>
    </main>
  );
}
