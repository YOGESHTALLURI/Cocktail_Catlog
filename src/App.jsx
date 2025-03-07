import React, { useState, useEffect } from "react";
import "./App.css"; // Import the new CSS file

const URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

const App = () => {
  const [drinksData, setDrinksData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  const fetchDrink = async (apiURL) => {
    setLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      if (Array.isArray(data.drinks)) {
        setDrinksData(data.drinks);
      } else {
        setDrinksData([]);
        throw new Error("No drinks match your search—try something else! 🍹");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsError({
        status: true,
        msg: error.message || "Oops, something went wrong!",
      });
      setDrinksData([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const correctURL = `${URL}${searchTerm}`;
      fetchDrink(correctURL);
    } else {
      setDrinksData([]);
      setIsError({ status: false, msg: "" });
    }
  }, [searchTerm]);

  return (
    <div className="cocktail-container">
      <form className="search-form">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for a cocktail... 🍹"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </form>

      <hr className="fancy-hr" />
      {loading && !isError?.status && (
        <h3 className="loading">Mixing it up... 🍸</h3>
      )}
      {isError?.status && <h3 className="error">{isError.msg}</h3>}
      {!loading && !isError?.status && (
        <div className="cocktail-grid">
          {drinksData.length > 0 ? (
            drinksData.map((eachDrink) => {
              const {
                idDrink,
                strDrink,
                strDrinkThumb,
                strInstructions,
                ...ingredients
              } = eachDrink;
              const ingredientList = Object.keys(ingredients)
                .filter(
                  (key) => key.startsWith("strIngredient") && ingredients[key]
                )
                .map((key) => ingredients[key]);

              return (
                <div key={idDrink} className="cocktail-card">
                  <div className="card-image">
                    <img src={strDrinkThumb} alt={strDrink} />
                  </div>
                  <div className="card-text">
                    <h3>{strDrink}</h3>
                    <h4>Ingredients:</h4>
                    <ul className="ingredient-list">
                      {ingredientList.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>{strInstructions || "No instructions available."}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="no-results">Start mixing—search for a drink! 🍸</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
