/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — HTTP Basic Auth gate (Vercel Edge Middleware)

   Free-tier password protection: gates every path via HTTP Basic Auth.
   Port of the former Netlify edge function (os/netlify/edge-functions/auth.js).

   Credentials come from Vercel environment variables — never hardcode them:
     OS_USER     (optional, defaults to "wse")
     OS_PASSWORD (required — fail-closed 503 if unset)
   ═══════════════════════════════════════════════════════════ */

export const config = {
  // Gate everything except Vercel internals and common static asset requests.
  matcher: ["/((?!_next/|favicon.ico).*)"],
};

const YEAR = new Date().getFullYear();

function gatePage({ title, message }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>WSE Labs OS — ${title}</title>
<style>
  :root {
    --bg: #0a0e14;
    --panel: #111826;
    --border: rgba(255,255,255,.08);
    --text: #e7ecf3;
    --muted: #8a97a8;
    --accent: #4f8cff;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    display: grid;
    place-items: center;
    min-height: 100%;
    padding: 2rem;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--text);
    background:
      radial-gradient(1200px 600px at 50% -10%, rgba(79,140,255,.15), transparent 60%),
      var(--bg);
  }
  .card {
    width: 100%;
    max-width: 420px;
    text-align: center;
    padding: 2.5rem 2rem;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,.45);
  }
  .badge {
    display: inline-grid;
    place-items: center;
    width: 56px; height: 56px;
    margin-bottom: 1.25rem;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: .04em;
    color: #fff;
    background: linear-gradient(135deg, var(--accent), #7a5cff);
  }
  h1 { margin: 0 0 .5rem; font-size: 1.25rem; letter-spacing: -.01em; }
  p  { margin: 0 auto; max-width: 32ch; color: var(--muted); line-height: 1.5; font-size: .95rem; }
  .lock { margin-top: 1.5rem; font-size: .8rem; color: var(--muted); }
  footer { margin-top: 2rem; font-size: .75rem; color: var(--muted); }
</style>
</head>
<body>
  <main class="card">
    <div class="badge">WSE</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="lock">🔒 Internal system — WSE AI Lab</div>
    <footer>Product created by WSE AI Lab © ${YEAR}</footer>
  </main>
</body>
</html>`;
}

export default function middleware(request) {
  const user = process.env.OS_USER || "wse";
  const pass = process.env.OS_PASSWORD;

  // Fail closed: if no password is configured, do not serve the app.
  if (!pass) {
    return new Response(
      gatePage({
        title: "Not configured",
        message:
          "Access control is not configured for this system. Set the OS_PASSWORD environment variable in Vercel, then redeploy.",
      }),
      { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const header = request.headers.get("authorization") || "";
  const expected = "Basic " + btoa(`${user}:${pass}`);

  if (header !== expected) {
    return new Response(
      gatePage({
        title: "Authentication required",
        message:
          "This is a private WSE AI Lab system. Sign in with your credentials to continue.",
      }),
      {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "WWW-Authenticate": 'Basic realm="WSE Labs OS", charset="UTF-8"',
        },
      },
    );
  }

  // Authenticated — let the request continue to the static app / functions.
  return undefined;
}
