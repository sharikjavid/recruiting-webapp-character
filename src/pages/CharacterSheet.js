import React, { useState } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "../consts";

const CharacterSheet = ({ character, index, setCharacters }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [skillCheckResult, setSkillCheckResult] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dcInput, setDcInput] = useState("");

  const getModifier = (attributeValue) => Math.floor((attributeValue - 10) / 2);

  const updateAttribute = (attribute, value) => {
    if (value < 0 || value > 70) {
      alert("Attribute value must be between 0 and 70");
      return;
    }

    const totalAttributes = Object.values(character.attributes).reduce(
      (total, attrValue) => total + attrValue,
      0
    );

    if (totalAttributes + (value - character.attributes[attribute]) > 70) {
      alert("Total attribute points cannot exceed 70");
      return;
    }

    setCharacters((prev) => {
      const updatedCharacters = [...prev];
      updatedCharacters[index] = {
        ...updatedCharacters[index],
        attributes: {
          ...updatedCharacters[index].attributes,
          [attribute]: value,
        },
      };
      return updatedCharacters;
    });
  };

  const updateSkillPoints = (skillName, points) => {
    if (points < 0) return;

    const totalSkillPoints =
      10 + getModifier(character.attributes.Intelligence) * 4;
    const currentSkillPoints = character.skills.reduce(
      (total, skill) => total + skill.points,
      0
    );
    const skillToUpdate = character.skills.find((s) => s.name === skillName);

    if (
      currentSkillPoints + (points - skillToUpdate.points) >
      totalSkillPoints
    ) {
      alert("Not enough skill points available");
      return;
    }

    setCharacters((prev) => {
      const updatedCharacters = [...prev];
      const updatedSkills = updatedCharacters[index].skills.map((skill) =>
        skill.name === skillName ? { ...skill, points } : skill
      );
      updatedCharacters[index] = {
        ...updatedCharacters[index],
        skills: updatedSkills,
      };
      return updatedCharacters;
    });
  };

  const handleClassClick = (className) => {
    setSelectedClass(CLASS_LIST[className]);
  };

  const handleSkillCheck = () => {
    const dc = Number(dcInput);
    if (isNaN(dc) || dc <= 0) {
      alert("DC must be a positive number");
      return;
    }

    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const skillObj = character.skills.find((s) => s.name === selectedSkill);
    const attributeModifierName = SKILL_LIST.find(
      (s) => s.name === selectedSkill
    ).attributeModifier;
    const totalSkill =
      skillObj.points +
      getModifier(character.attributes[attributeModifierName]);

    setSkillCheckResult({
      skill: selectedSkill,
      rolled: randomRoll,
      dc,
      success: randomRoll + totalSkill >= dc,
    });
  };

  const totalSkillPoints =
    10 + getModifier(character.attributes.Intelligence) * 4;
  const remainingPoints =
    totalSkillPoints -
    character.skills.reduce((total, skill) => total + skill.points, 0);

  const classMeetsRequirements = (className) => {
    const classReqs = CLASS_LIST[className];
    return Object.entries(classReqs).every(
      ([attr, value]) => character.attributes[attr] >= value
    );
  };

  return (
    <div className="character-container">
      <div className="character-header">{`Character ${index + 1}`}</div>

      <div className="skill-check">
        <h3>Skill Check</h3>
        <label>
          Skill:
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            {SKILL_LIST.map((skill) => (
              <option value={skill.name} key={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          DC:
          <input
            type="number"
            placeholder="DC"
            value={dcInput}
            onChange={(e) => setDcInput(e.target.value)}
          />
        </label>
        <button onClick={handleSkillCheck}>Roll</button>
      </div>

      {skillCheckResult && (
        <div className="skill-check-result">
          <h4>Skill Check Results</h4>
          <p>{`Skill: ${skillCheckResult.skill}`}</p>
          <p>{`You Rolled: ${skillCheckResult.rolled}`}</p>
          <p>{`The DC was: ${skillCheckResult.dc}`}</p>
          <p>{`Result: ${skillCheckResult.success ? "Success" : "Failure"}`}</p>
        </div>
      )}

      <hr />
      <div className="top-section">
        <div className="attribute-list">
          <h3>Attributes</h3>
          {ATTRIBUTE_LIST.map((attr) => (
            <div className="attribute-item" key={attr}>
              <span>{`${attr}: ${
                character.attributes[attr]
              } (Modifier: ${getModifier(character.attributes[attr])})`}</span>
              <div>
                <button
                  onClick={() =>
                    updateAttribute(attr, character.attributes[attr] - 1)
                  }
                  disabled={character.attributes[attr] <= 0}
                >
                  -
                </button>
                <button
                  onClick={() =>
                    updateAttribute(attr, character.attributes[attr] + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="class-list">
          <h3>Classes</h3>
          {Object.keys(CLASS_LIST).map((className) => (
            <div
              key={className}
              className={`class-item ${
                classMeetsRequirements(className) ? "highlight" : ""
              }`}
              onClick={() => handleClassClick(className)}
            >
              {className}
            </div>
          ))}
          {selectedClass && (
            <div className="class-requirements">
              <h4>{`Minimum Requirements for ${Object.keys(CLASS_LIST).find(
                (key) => CLASS_LIST[key] === selectedClass
              )}`}</h4>
              {Object.entries(selectedClass).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
              <button onClick={() => setSelectedClass(null)}>
                Close Requirement View
              </button>
            </div>
          )}
        </div>

        <div className="skill-list">
          <h3>{`Skills (Total skill points available: ${remainingPoints})`}</h3>
          {character.skills.map((skill) => {
            const attributeModifier = SKILL_LIST.find(
              (s) => s.name === skill.name
            ).attributeModifier;
            const modifierValue = getModifier(
              character.attributes[attributeModifier]
            );
            const totalValue = skill.points + modifierValue;
            return (
              <div className="skill-item" key={skill.name}>
                <span>{`${skill.name}: ${skill.points} (Modifier: ${attributeModifier}): ${modifierValue} Total: ${totalValue}`}</span>
                <div>
                  <button
                    onClick={() =>
                      updateSkillPoints(skill.name, skill.points - 1)
                    }
                    disabled={skill.points <= 0}
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      updateSkillPoints(skill.name, skill.points + 1)
                    }
                    disabled={remainingPoints <= 0}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
