import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request): Promise<Response | void> {
  const { origin: base, path, bypassToken } = parseRequestUrl(request.url);

  if (!bypassToken) {
    return new Response(
      'Missing required value for query parameter `x-vercel-protection-bypass`',
      { status: 401 },
    );
  }

  if (bypassToken !== process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    return new Response(
      'The provided `x-vercel-protection-bypass` does match the bypass secret for this deployment.',
      { status: 403 },
    );
  }

  if (!path) {
    return new Response('Missing required value for query parameter `path`', {
      status: 400,
    });
  }

  draftMode().enable();

  const redirectUrl = buildRedirectUrl({ path, base, bypassToken });

  redirect(redirectUrl);
}

const parseRequestUrl = (
  requestUrl: string,
): {
  origin: string;
  path: string;
  bypassToken: string;
} => {
  const { searchParams, origin } = new URL(requestUrl);

  const rawPath = searchParams.get('path') || '';
  const bypassToken = searchParams.get('x-vercel-protection-bypass') || '';

  const path = decodeURIComponent(rawPath);

  return {
    origin,
    path,
    bypassToken,
  };
};

const buildRedirectUrl = ({
  path,
  base,
  bypassToken,
}: {
  path: string;
  base: string;
  bypassToken: string;
}): string => {
  const redirectUrl = new URL(path, base);

  redirectUrl.searchParams.set('x-vercel-protection-bypass', bypassToken);
  redirectUrl.searchParams.set('x-vercel-set-bypass-cookie', 'samesitenone');

  return redirectUrl.toString();
};
