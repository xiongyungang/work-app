export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/users" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM users").all();
      return Response.json(results);
    }

    if (url.pathname === "/api/users" && request.method === "POST") {
      const { name, email } = await request.json() as { name: string; email: string };
      await env.DB.prepare("INSERT INTO users (name, email) VALUES (?, ?)")
        .bind(name, email)
        .run();
      return Response.json({ success: true });
    }

    return new Response("Hello from my Worker with D1!");
  },
};
