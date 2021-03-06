import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const CatItem = ({ img }) => {
  return (
    <li>
      <img src={img} style={{ width: "150px" }} />
    </li>
  );
}

const MainCard = ({ mainCard, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "π" : "π€";

  return (
    <div className="main-card">
      <img src={mainCard} alt="κ³ μμ΄" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
}

const Favorites = ({ favorites }) => {
  if (favorites.length === 0) {
    return (
      <div>ννΈλ₯Ό λλ¬ μ¬μ§μ μ μ₯ν΄λ³΄μΈμ!!</div>
    );
  }

  return (
    <ul className="favorites">
      {
        favorites.map((cat) => (
          <CatItem img={cat} key={cat} />
        ))
      }
    </ul>
  );
}

const Form = ({ updateMainCat }) => {

  const includesHangul = (text) => /[γ±-γ|γ-γ£|κ°-ν£]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("νκΈμ μλ ₯ν  μ μμ΅λλ€");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {
      setErrorMessage("λΉ κ°μΌλ‘ λ§λ€ μ μμ΅λλ€");
      return;
    }

    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="μμ΄ λμ¬λ₯Ό μλ ₯ν΄μ£ΌμΈμ" onChange={handleInputChange} value={value} />
      <p style={{ color: "red" }}>{errorMessage}</p>
      <button type="submit">μμ±</button>
    </form>
  );
}

const App = () => {
  const cat1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const cat2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const cat3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";
  const cats = [cat1, cat2, cat3];
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCard, setMainCard] = React.useState(cat1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(mainCard);

  async function setInitialCat() {
    const newCat = await fetchCat("Fist Cat!");
    setMainCard(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCard(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCard];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const title = counter === null ? "κ³ μμ΄ κ°λΌμ¬λ" : counter + "λ²μ§Έ κ³ μμ΄ κ°λΌμ¬λ";

  return (
    <div>
      <Title title={title}></Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard mainCard={mainCard} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}></MainCard>
      <Favorites favorites={favorites} />
    </div>
  );
}

export default App;
