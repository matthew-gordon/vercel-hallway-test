"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { ContentfulBlogProps } from "@/app/blogs/[slug]/page";

export const Post = ({ blog }: { blog: ContentfulBlogProps }) => {
  const data = useContentfulLiveUpdates(blog);
  const inspectorProps = useContentfulInspectorMode({ entryId: data.sys.id });

  return (
    <main className="bg-white dark:bg-gray-900">
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px]">
        <Image
          alt="Article Image"
          className="absolute inset-0 w-full h-full object-cover"
          height="900"
          style={{
            aspectRatio: "1600/900",
            objectFit: "cover",
          }}
          src={data?.coverImage?.url ?? "https://placehold.co/650x365"}
          width="1600"
          {...inspectorProps({
            fieldId: "coverImage",
          })}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start">
          <h1
            {...inspectorProps({
              fieldId: "title",
            })}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {data.title}
          </h1>
          <p
            {...inspectorProps({
              fieldId: "excerpt",
            })}
            className="mt-4 text-lg text-gray-300"
          >
            {data.excerpt}
          </p>
          <p
            className="mt-4 text-md text-gray-400"
            {...inspectorProps({
              fieldId: "author",
            })}
          >
            By {data.author.name}
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article
          className="mx-auto"
          {...inspectorProps({
            fieldId: "content",
          })}
        >
          {documentToReactComponents(data.content.json)}
        </article>
      </section>
    </main>
  );
};
