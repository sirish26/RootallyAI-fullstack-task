import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { FaTrash } from 'react-icons/fa';

const ExerciseItem = ({ exercise, onDuplicate, onDelete }) => {
    const [sets, setSets] = useState(10);
    const [reps, setReps] = useState(10);
    const [holdTime, setHoldTime] = useState(30);
    const [weight, setWeight] = useState(0);
    const [side, setSide] = useState('Left');

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "exercise",
        item: { exercise },
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }));

    const adjustValue = (setter, delta) => setter(prev => Math.max(0, prev + delta));

    const renderInputGroup = (label, value, setValue) => (
        <div className="input-group">
            <p>{label}</p>
            <button onClick={() => adjustValue(setValue, -10)}>-</button>
            <input type="number" value={value} readOnly />
            <button onClick={() => adjustValue(setValue, 10)}>+</button>
        </div>
    );

    return (
        <div ref={drag} className={`exercise-item ${isDragging ? 'dragging' : ''}`}>
            <div className="exercise-item-row">
                <div className="exercise-name">{exercise}</div>
                <div className="exercise-side-toggle" onClick={() => setSide(prev => (prev === 'Left' ? 'Right' : 'Left'))}>
                    {side}
                </div>
                <button onClick={onDuplicate}>Duplicate</button>
            </div>
            <div className="exercise-item-row">
                {[["Sets", sets, setSets], ["Reps", reps, setReps], ["Hold Time", holdTime, setHoldTime], ["Weights", weight, setWeight]].map(([label, value, setValue]) => renderInputGroup(label, value, setValue))}
                <FaTrash onClick={onDelete} className="delete-icon" />
            </div>
        </div>
    );
};

export default ExerciseItem;