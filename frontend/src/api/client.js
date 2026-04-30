const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function getIssues() {
  const response = await fetch(`${API_BASE_URL}/issues/`);
  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }
  return response.json();
}