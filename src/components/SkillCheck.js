import React, { useState } from "react";
import PropTypes from "prop-types";
import { SKILL_LIST } from "../consts";

const SkillCheck = ({ handleSkillCheck }) => {
  if (typeof handleSkillCheck !== "function") {
    console.error("handleSkillCheck is required and must be a function");
    return null;
  }

  if (!Array.isArray(SKILL_LIST) || SKILL_LIST.length === 0) {
    console.error("SKILL_LIST must be a non-empty array");
    return null;
  }

  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState("");

  const handleRoll = () => {
    const dcValue = parseInt(dc, 10);
    if (isNaN(dcValue)) {
      console.error("DC must be a valid number");
      return;
    }
    handleSkillCheck(selectedSkill, dcValue);
  };

  return (
    <div className="skill-check">
      <h3>Skill Check</h3>
      <label htmlFor="skill-select">
        Skill:
        <select
          id="skill-select"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          {SKILL_LIST.map((skill) => (
            <option key={skill.name} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="dc-input">
        DC:
        <input
          id="dc-input"
          type="number"
          value={dc}
          onChange={(e) => setDc(e.target.value)}
          placeholder="DC"
        />
      </label>
      <button onClick={handleRoll}>Roll</button>
    </div>
  );
};

SkillCheck.propTypes = {
  handleSkillCheck: PropTypes.func.isRequired,
};

export default SkillCheck;
