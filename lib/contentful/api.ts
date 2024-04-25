"use server";

import { ContentfulBlogProps } from "@/app/blogs/[slug]/page";

const POST_FIELDS_FRAGMENT = `#graphql
  fragment PostFields on Post {
    __typename
    sys {
      id
    }
    title
    slug
    author {
      name
    }
    coverImage {
      url
    }
    excerpt
    content {
      json
      links {
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  } 
`;

const GET_SINGLE_BLOG_QUERY = `#graphql
  query GetPostQuery($where: PostFilter, $limit: Int, $preview: Boolean) {
    postCollection(where: $where, limit: $limit, preview: $preview) {
      items {
        ...PostFields
      }
    }
  }
  ${POST_FIELDS_FRAGMENT}
`;

const GET_ALL_BLOGS_QUERY = `#graphql
  query GetPostQuery($where: PostFilter, $limit: Int, $preview: Boolean) {
    postCollection(where: $where, limit: $limit, preview: $preview) {
      items {
        ...PostFields
      }
    }
  }
  ${POST_FIELDS_FRAGMENT}
`;

async function fetchGraphQL(query: string, variables = {}, preview = false) {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: preview ? "no-store" : "force-cache",
    }
  );

  const data = await res.json();

  return data;
}

export async function getAllBlogs(limit = 10, isDraftMode = false) {
  const blogs = await fetchGraphQL(
    GET_ALL_BLOGS_QUERY,
    {
      where: { slug_exists: true },
      limit,
      order: "slug_DESC",
      preview: isDraftMode,
    },
    isDraftMode
  );

  return extractResponse(blogs);
}

export async function getBlog(slug: string, isDraftMode = false) {
  const blog = await fetchGraphQL(
    GET_SINGLE_BLOG_QUERY,
    {
      where: { slug },
      limit: 1,
      preview: isDraftMode,
    },
    isDraftMode
  );

  return extractResponse(blog)[0];
}

function extractResponse(fetchResponse: {
  data: { postCollection: { items: ContentfulBlogProps[] } };
}) {
  return fetchResponse?.data?.postCollection?.items;
}
