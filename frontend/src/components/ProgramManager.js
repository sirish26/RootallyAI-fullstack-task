import React, { useState } from 'react';

const ProgramManager = ({
  onSaveCombo,
  onAddEntry,
  programName,
  exercises,
  frequency,
  setFrequency,
  breakInterval,
  setBreakInterval,
  selectedDays,
  setSelectedDays,
}) => {
  const [notes, setNotes] = useState("");

  const handleSaveCombo = () => {
    onSaveCombo({
      programName,
      exercises,
      frequency,
      breakInterval,
      selectedDays,
      notes,
    });
  };

  const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="program-manager-container">
      <div className="break-interval-section">
        <h4>Break Interval</h4>
        <div className="interval-controls">
          <button onClick={() => setBreakInterval(prev => Math.max(0, prev - 10))}>-</button>
          <input type="number" value={breakInterval} readOnly />
          <button onClick={() => setBreakInterval(prev => prev + 10)}>+</button> seconds
        </div>
      </div>

      <div className="day-frequency-section">
        <h4>Day of Week</h4>
        <div className="day-of-week">
          <button onClick={() => setSelectedDays(daysOfWeek)} className="select-all-button">Select All</button>
          {daysOfWeek.map(day => (
            <button key={day} onClick={() => toggleDay(day)} className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}>
              {day}
            </button>
          ))}
        </div>
        <h4>Daily Frequency</h4>
        <div className="frequency-controls">
          <button onClick={() => setFrequency(prev => Math.max(1, prev - 1))}>-</button>
          <input type="number" value={frequency} readOnly />
          <button onClick={() => setFrequency(prev => prev + 1)}>+</button> sessions/day
        </div>
      </div>

      <div className="notes-section">
        <h4>Therapist Notes</h4>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes" rows={4} />
      </div>

      <div className="action-buttons">
        <button onClick={handleSaveCombo}>Save as Combo</button>
        <button onClick={onAddEntry}>Add Entry</button>
      </div>
    </div>
  );
};

export default ProgramManager;
