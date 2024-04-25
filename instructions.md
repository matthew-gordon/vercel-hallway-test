# Vercel Integration Test

Initial test for verifying implementation assumptions and collecting feedback

## Prerequisites

- clone the starter repo

```
git clone https://github.com/matthew-gordon/vercel-hallway-test.git
```

- Make sure you have access to a Vercel account (not required)
- Project is connected in Vercel account (not required)

## Instructions

### _Part One_

- Ensure `Protection Bypass for Automation` is enabled in your connected vercel project dashboard:
  - [Vercel Bypass Automatin DOCS](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation#)
- Install the `Vercel App` using the provided deep link (space TBD):
  - [Vercel App deep link]()

### _Part Two_

- Follow the instructions provided on the `Vercel App` configuration screen using the provided token, be sure to save:
  - token: `V5eINLnC5hLNy1W2PqQnvPR3`
- Create an endpoint under the `api` directory for enabling draft mode in your nextjs project
  - example: `/app/api/enable-draft/route.ts`
- Add the provided code snippet below to the newly created `route.ts` file:

```typescript
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
```

### _Part Three_

- Save and commit changes to the starter repo to deploy the connected project
- Navigate to any content entry and ensure the correct preview platform is selected
- Click on the `Open Live Preview` button and ensure the content preview renders side by side
