const CONTACT_TABLE = process.env.SUPABASE_CONTACT_TABLE || "contacts";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function clean(value) {
  return String(value || "").trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return json(res, 500, { error: "Supabase is not configured" });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return json(res, 400, { error: "Invalid JSON" });
  }
  const name = clean(body.name);
  const email = clean(body.email);
  const subject = clean(body.subject);
  const message = clean(body.message);
  const source = clean(body.source) || "portfolio";

  if (!name || !email || !message || !email.includes("@")) {
    return json(res, 400, { error: "Name, email, and message are required" });
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${CONTACT_TABLE}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      email,
      subject,
      message,
      source,
      created_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return json(res, 500, { error: "Could not save message", detail });
  }

  return json(res, 200, { ok: true });
};
