import React, { useState, useEffect } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, SKILL_LIST } from "./consts";
import CharacterSheet from "./pages/CharacterSheet";

function App() {
  const [characters, setCharacters] = useState([]);
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
        `https://recruiting.verylongdomaintotestwith.ca/api/${username}/character`
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
        `https://recruiting.verylongdomaintotestwith.ca/api/${username}/character`,
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
              index={index}
              setCharacters={setCharacters}
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
