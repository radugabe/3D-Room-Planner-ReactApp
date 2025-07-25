import { useState, createContext } from 'react';
import StartMenu from './pages/StartMenu';
import Planner from './pages/Planner';
import CustomPlanner from './pages/CustomPlanner';
import AIGenerator from './ai/AIGenerator';

export const AppContext = createContext(null);

function App() {
  const [selectedMode, setSelectedMode] = useState(null);
  const [importedProject, setImportedProject] = useState(null);

  return (
    <div className="relative flex flex-col w-screen h-screen overflow-hidden">
      <AppContext.Provider value={{ selectedMode, setSelectedMode, importedProject, setImportedProject }}>  
        {selectedMode === null ? (
          <StartMenu onSelectMode={setSelectedMode} />
        ) : selectedMode === 'rectangular' ? (
          <Planner />
        ) : selectedMode === 'custom' ? (
          <CustomPlanner />
        ) : selectedMode === 'ai-generator' ? (
          <AIGenerator />
        ) : null}
      </AppContext.Provider>
    </div>
  );
}

export default App;
