const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export async function generateRoadmap(data) {
  const response = await fetch(
    `${API_URL}/api/roadmap/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result =
    await response
      .json()
      .catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.error ||
        result?.message ||
        result?.detail ||
        "Failed to generate roadmap"
    );
  }

  return result;
}