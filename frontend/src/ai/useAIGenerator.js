export function useAIGenerator() {
  return async function generateRoom(prompt) {
    try {
      const response = await fetch("http://localhost:5000/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Eroare în hook AI:", err);
      throw err;
    }
  };
}
