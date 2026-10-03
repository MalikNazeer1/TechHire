const base = "http://localhost:3002";
const controller = new AbortController();
const start = Date.now();
const timer = setTimeout(() => controller.abort(), 10000);

try {
  const res = await fetch(`${base}/api/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "javascript",
      code: 'console.log("hello")',
    }),
    signal: controller.signal,
  });
  clearTimeout(timer);
  const body = await res.text();
  console.log("IT-09 status", res.status);
  console.log("IT-09 elapsedMs", Date.now() - start);
  console.log("IT-09 body", body);
} catch (error) {
  clearTimeout(timer);
  console.log("IT-09 error", error.name, error.message);
  console.log("IT-09 elapsedMs", Date.now() - start);
}
