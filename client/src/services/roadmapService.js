const API_URL = "http://127.0.0.1:8000";

export async function generateRoadmap(data) {
  const response = await fetch(`${API_URL}/api/roadmap/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ||
        result.message ||
        "Failed to generate roadmap"
    );
  }

  return result;
}