import { useState, useContext } from "react";
import { AppContext } from "../App";
import { importProject } from "../utils/ProjectImporter";
import { useAIGenerator } from "./useAIGenerator";

const AIGenerator = () => {
  const { setImportedProject, setSelectedMode } = useContext(AppContext);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle");
  const generateRoom = useAIGenerator();

  const handleGenerate = async () => {
    setStatus("loading");
    try {
      const json = await generateRoom(prompt);
      const { plannerType, state } = importProject(json);
      setImportedProject(state);
      setSelectedMode(plannerType);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-light to-primary">
      <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-card">
        <h2 className="mb-4 text-2xl font-bold text-dark">AI Room Generator</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full p-3 mb-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe the desired room: e.g. A room for a 15-year-old child, passionate about gaming, with a bed, desk, wardrobe. Put a monitor on the desk and a plant near wardrobe. I also want a TV on the wall."
        />
        <button
          onClick={handleGenerate}
          className="px-6 py-2 text-white transition rounded bg-primary hover:bg-primaryDark"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Generating..." : "Generate room"}
        </button>
        {status === "error" && (
          <p className="mt-4 text-sm text-red-500">Eroare la generare. Încearcă din nou.</p>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
