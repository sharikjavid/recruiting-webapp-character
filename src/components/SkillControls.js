import React from "react";
import PropTypes from "prop-types";
import { SKILL_LIST } from "../consts";

const getModifier = (value) => Math.floor((value - 10) / 2);

const SkillItem = ({ skill, attributes, remainingPoints, onSkillChange }) => {
  const skillData = SKILL_LIST.find((s) => s.name === skill.name);

  if (!skillData) {
    console.error(`Skill data not found for skill: ${skill.name}`);
    return null;
  }

  const attributeModifierName = skillData.attributeModifier;
  const attributeValue = Number(attributes[attributeModifierName]) || 0;
  const modifierValue = getModifier(attributeValue);
  const totalValue = skill.points + modifierValue;

  return (
    <div className="skill-item">
      <span>
        {`${skill.name}: ${skill.points} (Modifier: ${attributeModifierName}): ${modifierValue} Total: ${totalValue}`}
      </span>
      <div>
        <button
          onClick={() => onSkillChange(skill.name, skill.points - 1)}
          disabled={skill.points <= 0}
        >
          -
        </button>
        <button
          onClick={() => onSkillChange(skill.name, skill.points + 1)}
          disabled={remainingPoints <= 0}
        >
          +
        </button>
      </div>
    </div>
  );
};

SkillItem.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  remainingPoints: PropTypes.number.isRequired,
  onSkillChange: PropTypes.func.isRequired,
};

const SkillControls = ({ attributes = {}, skills = [], handleSkillChange }) => {
  if (typeof handleSkillChange !== "function") {
    console.error("handleSkillChange is required and must be a function");
    return null;
  }

  const intelligenceValue = Number(attributes.Intelligence) || 0;
  const intelligenceModifier = getModifier(intelligenceValue);
  const totalSkillPoints = 10 + intelligenceModifier * 4;

  const spentPoints = skills.reduce((total, skill) => total + skill.points, 0);
  const remainingPoints = totalSkillPoints - spentPoints;

  return (
    <div className="skill-controls">
      <h3>Skills (Total skill points available: {remainingPoints})</h3>
      {skills.map((skill) => (
        <SkillItem
          key={skill.name}
          skill={skill}
          attributes={attributes}
          remainingPoints={remainingPoints}
          onSkillChange={handleSkillChange}
        />
      ))}
    </div>
  );
};

SkillControls.propTypes = {
  attributes: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      points: PropTypes.number.isRequired,
    })
  ),
  handleSkillChange: PropTypes.func.isRequired,
};

export default SkillControls;
