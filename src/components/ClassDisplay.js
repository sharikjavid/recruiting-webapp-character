import React, { useState } from "react";
import PropTypes from "prop-types";
import { CLASS_LIST } from "../consts";

const ClassItem = ({ className, isHighlighted, onSelect }) => (
  <div
    className={`class-item ${isHighlighted ? "highlight" : ""}`}
    onClick={() => onSelect(className)}
  >
    {className}
  </div>
);

ClassItem.propTypes = {
  className: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const ClassRequirements = ({ className, requirements, onClose }) => (
  <div className="class-requirements">
    <h4>{`${className} Minimum Requirements`}</h4>
    {Object.entries(requirements).map(([key, value]) => (
      <div key={key}>{`${key}: ${value}`}</div>
    ))}
    <button onClick={onClose}>Close Requirement View</button>
  </div>
);

ClassRequirements.propTypes = {
  className: PropTypes.string.isRequired,
  requirements: PropTypes.objectOf(PropTypes.number).isRequired,
  onClose: PropTypes.func.isRequired,
};

const ClassDisplay = ({ attributes = {}, handleClassClick }) => {
  const [selectedClass, setSelectedClass] = useState({
    name: null,
    data: null,
  });

  if (typeof handleClassClick !== "function") {
    console.error("handleClassClick is required and must be a function");
    return null;
  }

  const classMeetsRequirements = (className) => {
    const classReqs = CLASS_LIST[className];
    return Object.entries(classReqs).every(
      ([attr, value]) => (Number(attributes[attr]) || 0) >= value
    );
  };

  const handleClassSelection = (className) => {
    setSelectedClass({ name: className, data: CLASS_LIST[className] });
    handleClassClick(className);
  };

  const closeRequirementView = () => {
    setSelectedClass({ name: null, data: null });
  };

  return (
    <div className="class-display">
      <h3>Classes</h3>
      {Object.keys(CLASS_LIST).map((className) => (
        <ClassItem
          key={className}
          className={className}
          isHighlighted={classMeetsRequirements(className)}
          onSelect={handleClassSelection}
        />
      ))}
      {selectedClass.name && (
        <ClassRequirements
          className={selectedClass.name}
          requirements={selectedClass.data}
          onClose={closeRequirementView}
        />
      )}
    </div>
  );
};

ClassDisplay.propTypes = {
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  handleClassClick: PropTypes.func.isRequired,
};

export default ClassDisplay;
