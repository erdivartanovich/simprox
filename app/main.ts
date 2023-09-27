const port = 8000;

function handler(req: Request): Response {
  console.log(req);

  return Response.json({
    message: "Request origin:",
    request: JSON.stringify(req),
  });
}

console.log(`HTTP server running. Access it at: http://localhost:${port}/`);
Deno.serve({ port }, handler);
