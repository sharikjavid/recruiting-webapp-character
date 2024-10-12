import React, { useState } from "react";
import { ATTRIBUTE_LIST, SKILL_LIST } from "../consts";
import ClassDisplay from "../components/ClassDisplay";
import SkillControls from "../components/SkillControls";
import SkillCheck from "../components/SkillCheck";
import AttributeControls from "../components/AttributeControls"; 
const CharacterSheet = ({ character, index, setCharacters }) => {
  const [skillCheckResult, setSkillCheckResult] = useState(null);

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

  const handleSkillCheck = (selectedSkill, dc) => {
    if (dc <= 0) {
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

  return (
    <div className="character-container">
      <div className="character-header">{`Character ${index + 1}`}</div>

      <SkillCheck handleSkillCheck={handleSkillCheck} />

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
        {/* Use AttributeControls component */}
        <AttributeControls
          attributes={character.attributes}
          handleAttributeChange={updateAttribute}
        />

        <ClassDisplay
          attributes={character.attributes}
          handleClassClick={(className) =>
            console.log("Class selected:", className)
          }
        />

        <SkillControls
          attributes={character.attributes}
          skills={character.skills}
          handleSkillChange={updateSkillPoints}
        />
      </div>
    </div>
  );
};

export default CharacterSheet;
