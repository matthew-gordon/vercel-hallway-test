import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogs } from "@/lib/contentful/api";
import { ContentfulBlogProps } from "@/app/blogs/[slug]/page";

export default async function Home() {
  const { isEnabled } = draftMode();
  const blogs = await getAllBlogs(10, isEnabled);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <section className="w-full pt-12">
        <div className="mx-auto container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Welcome to our Knowledge Base
              </h1>
              <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                Discover our latest blogs and stay up to date with the newest
                technologies, features, and trends.
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: ContentfulBlogProps) => (
                <article
                  key={blog.sys.id}
                  className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden"
                >
                  <Image
                    alt="placeholder"
                    className="aspect-[4/3] object-cover w-full"
                    height="263"
                    src={blog?.coverImage?.url ?? ""}
                    width="350"
                  />
                  <div className="flex-1 p-6">
                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-2xl font-bold leading-tight text-slate-800 py-4">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="max-w-none text-zinc-500 mt-4 mb-2 text-sm dark:text-zinc-400">
                      {blog.excerpt}
                    </p>
                    <p className="max-w-none text-zinc-600 mt-2 mb-2 text-sm font-bold dark:text-zinc-400">
                      Written by: {blog.author.name}
                    </p>
                    <div className="flex justify-end">
                      <Link
                        className="inline-flex h-10 items-center justify-center text-sm font-medium"
                        href={`/blogs/${blog.slug}`}
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
