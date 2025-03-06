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
        throw new Error("No cocktails found!");
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
    // Only fetch if searchTerm is not empty
    if (searchTerm.trim()) {
      const correctURL = `${URL}${searchTerm}`;
      fetchDrink(correctURL);
    } else {
      setDrinksData([]); // Clear data if no search term
      setIsError({ status: false, msg: "" }); // Ensure no error on initial load
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
              const { idDrink, strDrink, strDrinkThumb } = eachDrink;
              return (
                <div key={idDrink} className="cocktail-card">
                  <div className="card-image">
                    <img src={strDrinkThumb} alt={strDrink} />
                  </div>
                  <div className="card-text">
                    <h3>{strDrink}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="no-results">
              Ready to find a cocktail? Search above! 🍷
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
