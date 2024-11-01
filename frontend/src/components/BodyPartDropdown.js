import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const BodyPartDropdown = ({ onExerciseSelect }) => {
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('http://localhost:5000/api/categories');
            setCategories(await response.json());
        };
        fetchCategories();
    }, []);

    return (
        <DropdownButton
            title="Add Exercise"
            variant="primary"
            style={{ padding: '10px', minWidth: '150px' }}
            show={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(prev => !prev)}
            className="exe-button" 
        >
            {categories.map(category => (
                <Dropdown key={category.name} drop="end">
                    <Dropdown.Toggle as="div" className="dropdown-category">
                        {category.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu show style={{ padding: '10px', minWidth: '150px' }}>
                        {category.exercises.map(exercise => (
                            <Dropdown.Item key={exercise} onClick={() => onExerciseSelect(exercise)}>
                                {exercise}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            ))}
        </DropdownButton>
    );
};

export default BodyPartDropdown;