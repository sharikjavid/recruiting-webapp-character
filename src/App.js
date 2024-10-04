import React, { useState, useEffect } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, SKILL_LIST } from "./consts";
import CharacterSheet from "./pages/CharacterSheet";

function App() {
  // State variables
  const [characters, setCharacters] = useState([]);
  const [skillCheckResult, setSkillCheckResult] = useState(null);
  const [classRequirements, setClassRequirements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = "sharikjavid";

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://recruiting.verylongdomaintotestwith.ca/api/{${username}}/character`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Handle different data structures from API response
      const fetchedCharacters = data.body?.characters || data.body || [];
      if (Array.isArray(fetchedCharacters) && fetchedCharacters.length > 0) {
        setCharacters(fetchedCharacters);
      } else {
        initializeDefaultCharacter();
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      setError("Failed to fetch characters. Please try again later.");
      initializeDefaultCharacter();
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultCharacter = () => {
    setCharacters([
      {
        id: 1,
        attributes: ATTRIBUTE_LIST.reduce(
          (acc, attr) => ({ ...acc, [attr]: 10 }),
          {}
        ),
        skills: SKILL_LIST.map((skill) => ({ ...skill, points: 0 })),
      },
    ]);
  };

  const saveCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://recruiting.verylongdomaintotestwith.ca/api/{${username}}/character`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ characters }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("Characters successfully stored");
    } catch (error) {
      console.error("Error saving characters:", error);
      setError("Failed to save characters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addNewCharacter = () => {
    setCharacters((prevCharacters) => [
      ...prevCharacters,
      {
        id: prevCharacters.length + 1,
        attributes: ATTRIBUTE_LIST.reduce(
          (acc, attr) => ({ ...acc, [attr]: 10 }),
          {}
        ),
        skills: SKILL_LIST.map((skill) => ({ ...skill, points: 0 })),
      },
    ]);
  };

  const resetAllCharacters = () => {
    initializeDefaultCharacter();
    setSkillCheckResult(null);
    setClassRequirements(null);
  };

  const handleAttributeChange = (id, attribute, value) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === id
          ? {
              ...character,
              attributes: {
                ...character.attributes,
                [attribute]: Math.max(
                  0,
                  character.attributes[attribute] + value
                ),
              },
            }
          : character
      )
    );
  };

  const handleSkillChange = (id, skillName, value) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) => {
        if (character.id !== id) return character;

        const totalSkillPoints =
          10 + Math.floor((character.attributes.Intelligence - 10) / 2) * 4;
        const currentSkillPoints = character.skills.reduce(
          (total, skill) => total + skill.points,
          0
        );

        if (currentSkillPoints + value > totalSkillPoints) {
          alert("Not enough skill points available");
          return character;
        }

        return {
          ...character,
          skills: character.skills.map((skill) =>
            skill.name === skillName
              ? { ...skill, points: Math.max(0, skill.points + value) }
              : skill
          ),
        };
      })
    );
  };

  const handleSkillCheck = (id, skillName, dc) => {
    const character = characters.find((char) => char.id === id);
    if (!character) return;

    const skillObj = character.skills.find((s) => s.name === skillName);
    if (!skillObj) return;

    const attributeValue = character.attributes[skillObj.attributeModifier];
    const attributeModifier = Math.floor((attributeValue - 10) / 2);
    const totalSkill = skillObj.points + attributeModifier;
    const roll = Math.floor(Math.random() * 20) + 1;
    const result = roll + totalSkill >= dc ? "Success" : "Failure";

    setSkillCheckResult({
      characterId: id,
      skill: skillName,
      roll,
      dc,
      result,
      totalSkill,
    });
  };

  // Function to handle class selection
  const handleClassClick = (className) => {
    setClassRequirements((prevClass) =>
      prevClass === className ? null : className
    );
  };

  return (
    <div className="App">
      <header className="App-header">React Coding Exercise</header>

      <section className="App-section">
        <div className="buttons">
          <button onClick={addNewCharacter}>Add New Character</button>
          <button onClick={resetAllCharacters}>Reset All Characters</button>
          <button onClick={saveCharacters}>Save All Characters</button>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : characters.length > 0 ? (
          characters.map((character, index) => (
            <CharacterSheet
              key={character.id}
              character={character}
              onAttributeChange={handleAttributeChange}
              onSkillChange={handleSkillChange}
              onSkillCheck={handleSkillCheck}
              skillCheckResult={skillCheckResult}
              classRequirements={classRequirements}
              handleClassClick={handleClassClick}
              index={index}
              setCharacters={setCharacters}
              characters={characters}
            />
          ))
        ) : (
          <p>No characters available</p>
        )}
      </section>
    </div>
  );
}

export default App;
