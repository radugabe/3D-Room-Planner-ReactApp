import { useContext } from "react";
import { AppContext } from "../App";
import { importProject } from "../utils/ProjectImporter";
import { RectangularIcon, CustomIcon, ImportIcon, AIGeneratorIcon } from "../components/icons/Icons";
import AIGenerator from "../ai/AIGenerator";

const StartMenu = ({ onSelectMode }) => {
  const { setSelectedMode, setImportedProject } = useContext(AppContext);

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const { plannerType, state } = importProject(jsonData);
        setImportedProject(state);
        setSelectedMode(plannerType);
      } catch (error) {
        alert("Eroare la import: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-light to-primary">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-dark">3D Room Planner</h1>
        <p className="text-lg text-accent">Select room type to begin</p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 max-w-[2000px]">

        {/* Rectangular Card */}
        <div
          className="bg-white rounded-xl shadow-card hover:shadow-hover w-[300px] h-[350px] p-6 flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-2"
          onClick={() => onSelectMode("rectangular")}
        >
          <RectangularIcon />
          <h2 className="mb-3 text-xl font-semibold text-dark">Rectangular</h2>
          <p className="text-sm leading-relaxed text-center text-accent">
            Design a standard rectangular room with customizable dimensions
          </p>
        </div>

        {/* Custom Card */}
        <div
          className="bg-white rounded-xl shadow-card hover:shadow-hover w-[300px] h-[350px] p-6 flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-2"
          onClick={() => onSelectMode("custom")}
        >
          <CustomIcon />
          <h2 className="mb-3 text-xl font-semibold text-dark">Custom</h2>
          <p className="text-sm leading-relaxed text-center text-accent">
            Create a room with custom layout and advanced features
          </p>
        </div>

        {/* Import Project Card */}
        <div
          className="bg-white rounded-xl shadow-card hover:shadow-hover w-[300px] h-[350px] p-6 flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-2"
          onClick={() => document.getElementById("import-input").click()}
        >
          <ImportIcon />
          <h2 className="mb-3 text-xl font-semibold text-dark">Import Project</h2>
          <p className="text-sm leading-relaxed text-center text-accent">
            Load a previously saved project
          </p>
          <input
            id="import-input"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* AI Generator Card */}
        <div
          className="bg-white rounded-xl shadow-card hover:shadow-hover w-[300px] h-[350px] p- flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-2"
          onClick={() => onSelectMode("ai-generator")}
        >
          <AIGeneratorIcon />
          <h2 className="mb-3 text-xl font-semibold text-dark">AI Generator</h2>
          <p className="text-sm leading-relaxed text-center text-accent">
            Describe a room and generate it with AI
          </p>
        </div>

      </div>



      <div className="mt-16 text-sm text-center text-accent">
        © Radu Dinu - 3D Room Planner - All rights reserved.
      </div>
    </div>

  );
};

export default StartMenu;
