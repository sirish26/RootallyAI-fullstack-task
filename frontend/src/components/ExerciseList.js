import React from 'react';
import { useDrop } from 'react-dnd';
import ExerciseItem from './ExerciseItem';

const ExerciseList = ({ exercises, onReorder, onDuplicate, onDelete }) => {
  const [, drop] = useDrop(() => ({ accept: 'exercise' }));

  return (
    <>
      <h3 className="exercise-list-title">Exercise Program</h3>
      <div ref={drop} className="exercise-list-container">
        {exercises.map((exercise, index) => (
          <ExerciseItem
            key={index}
            exercise={exercise}
            onDuplicate={() => onDuplicate(index)}
            onDelete={() => onDelete(index)} 
          />
        ))}
      </div>
    </>
  );
};

export default ExerciseList;
