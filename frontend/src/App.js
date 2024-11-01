import React, { useState, useEffect } from 'react';
import BodyPartDropdown from './components/BodyPartDropdown';
import ExerciseList from './components/ExerciseList';
import ProgramManager from './components/ProgramManager';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const App = () => {
  const [exercises, setExercises] = useState([]), [programName, setProgramName] = useState(''), [frequency, setFrequency] = useState(1), [breakInterval, setBreakInterval] = useState(10), [selectedDays, setSelectedDays] = useState([]), [savedPrograms, setSavedPrograms] = useState([]), [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    const fetchSavedPrograms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/programs');
        if (!response.ok) throw new Error('Failed to fetch programs');
        setSavedPrograms(await response.json());
      } catch (error) {
        console.error('Error fetching saved programs:', error);
      }
    };
    fetchSavedPrograms();
  }, []);

  const handleExerciseSelect = exercise => setExercises([...exercises, exercise]);
  const handleDuplicate = index => setExercises([...exercises, exercises[index]]);
  const handleClear = () => {
    setExercises([]);
    setProgramName('');
    setSelectedDays([]);
    setFrequency(1);
    setBreakInterval(10);
  };

  const handleSaveCombo = async comboData => {
    try {
      const response = await fetch('http://localhost:5000/api/saveCombo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: comboData.programName,
          exercises: comboData.exercises.map(({ name, sets, reps, holdTime, weight, side }) => ({ exerciseName: name, sets, reps, holdTime, weight, side })),
          frequency: comboData.frequency,
          breakInterval: comboData.breakInterval,
          selectedDays: comboData.selectedDays,
        }),
      });
      if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
      console.log(await response.json());
    } catch (error) {
      console.error("Error saving combo:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <div className="input-container">
          <input type="text" value={programName} onChange={e => setProgramName(e.target.value)} placeholder="Enter Program Name" className="input-style" />
          <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} className="input-style">
            <option value="">Select a saved program</option>
            {savedPrograms.map(program => <option key={program._id} value={program.name}>{program.name}</option>)}
          </select>
          <button onClick={handleClear} className="input-style">Clear All</button>
        </div>
        <ExerciseList exercises={exercises} onDuplicate={handleDuplicate} onDelete={index => setExercises(exercises.filter((_, i) => i !== index))} />
        <BodyPartDropdown onExerciseSelect={handleExerciseSelect} />
        <ProgramManager 
          onSaveCombo={handleSaveCombo} 
          onAddEntry={handleClear}
          programName={programName}
          exercises={exercises}
          frequency={frequency}
          breakInterval={breakInterval}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          setFrequency={setFrequency}
          setBreakInterval={setBreakInterval}
        />
      </div>
    </DndProvider>
  );
};

export default App;