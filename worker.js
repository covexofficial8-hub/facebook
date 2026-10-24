
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({
        success: true,
        service: "Facebook Poll API"
      });
    }

    if (request.method !== "POST" || url.pathname !== "/api/survey") {
      return json({
        success: false,
        error: "Endpoint not found"
      }, 404);
    }

    if (!env.DB) {
      return json({
        success: false,
        error: "Database binding DB is not configured"
      }, 500);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({
        success: false,
        error: "Invalid JSON request"
      }, 400);
    }

    const age = String(body.age ?? "").trim();
    const gender = String(body.gender ?? "").trim();

    if (!age || !gender) {
      return json({
        success: false,
        error: "Both age/year and gender are required"
      }, 400);
    }

    try {
      await env.DB.prepare(
        "INSERT INTO poll_responses (gender_code, age) VALUES (?, ?)"
      ).bind(gender, age).run();

      return json({
        success: true,
        message: "Survey submitted successfully"
      }, 201);

    } catch (error) {
      console.error("Database insert error:", error);

      return json({
        success: false,
        error: "Database insert failed: " +
          String(error?.message || error)
      }, 500);
    }
  }
};
