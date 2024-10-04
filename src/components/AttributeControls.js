import React from "react";
import PropTypes from "prop-types";
import { ATTRIBUTE_LIST } from "../consts";

const AttributeItem = ({ attr, value, handleChange }) => {
  const modifier = Math.floor((value - 10) / 2);

  return (
    <div className="attribute-item">
      <span>{`${attr}: ${value} (Modifier: ${modifier})`}</span>
      <div>
        <button
          onClick={() => handleChange(attr, Math.max(value - 1, 0))}
          disabled={value <= 0}
        >
          -
        </button>
        <button onClick={() => handleChange(attr, value + 1)}>+</button>
      </div>
    </div>
  );
};

AttributeItem.propTypes = {
  attr: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

const AttributeControls = ({ attributes = {}, handleAttributeChange }) => {
  if (!handleAttributeChange || typeof handleAttributeChange !== "function") {
    console.error("handleAttributeChange is required and must be a function");
    return null;
  }

  return (
    <div className="attribute-controls">
      <h3>Attributes</h3>
      {ATTRIBUTE_LIST.map((attr) => (
        <AttributeItem
          key={attr}
          attr={attr}
          value={Number(attributes[attr]) || 0}
          handleChange={handleAttributeChange}
        />
      ))}
    </div>
  );
};

AttributeControls.propTypes = {
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  handleAttributeChange: PropTypes.func.isRequired,
};

export default AttributeControls;
