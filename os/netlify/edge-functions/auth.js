// HTTP Basic Auth gate for WSE Labs OS (Netlify free-tier password protection).
// Credentials come from environment variables set in the Netlify dashboard —
// never hardcode them here.
//   OS_USER     (optional, defaults to "wse")
//   OS_PASSWORD (required)
export default async (request, context) => {
  const user = Deno.env.get("OS_USER") || "wse";
  const pass = Deno.env.get("OS_PASSWORD");

  // Fail closed: if no password is configured, do not serve the app.
  if (!pass) {
    return new Response("Access control not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization") || "";
  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (header !== expected) {
    return new Response("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="WSE Labs OS", charset="UTF-8"',
      },
    });
  }

  return context.next();
};

export const config = { path: "/*" };
