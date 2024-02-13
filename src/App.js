import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import CryptoDetails from "./components/CryptoDetails";
import Portfolio from "./components/Portfolio";

function App() {
  const [featured, setFeatured] = useState([]);
  const [values, setValues] = useState({
    search: "",
    addcrypto: "",
  });
  const [addedCryptos, setAddedCryptos] = useState([]);
  const [unixTime, setUnixTime] = useState(0);
  const [unixTime24HoursAgo, setUnixTime24HoursAgo] = useState(0);

  const inpAddcrypto = document.querySelector("#inp-addcrypto");

  // Function to filter featured cryptocurrencies based on the input value
  const filtered = () => {
    const filteredProduct = featured[0].filter(
      (crypto) => crypto.symbol === values.addcrypto,
    );

    if (filteredProduct.length) {
      return filteredProduct;
    }

    return false;
  };

  // Function to remove a cryptocurrency from the added list
  const removeCrypto = (item) => {
    setAddedCryptos(addedCryptos.filter((i) => i.symbol !== item.symbol));
  };

  // Function to add a cryptocurrency to your favourites
  const starCrypto = (asset) => {
    const starFiltered = featured[0].filter(
      (ass) => ass.symbol === asset.symbol,
    );
    const p = addedCryptos.filter((i) => i.symbol === starFiltered[0].symbol);

    if (starFiltered && p && !p.length) {
      setAddedCryptos(addedCryptos.concat(asset));
      return true;
    } else {
      removeCrypto(asset);
      return false;
    }
  };

  // Effect to load added cryptocurrencies from localStorage on mount
  useEffect(() => {
    const storedCryptos = localStorage.getItem("addedCryptos");
    if (storedCryptos) {
      setAddedCryptos(JSON.parse(storedCryptos));
    }
  }, []);

  // Effect to save added cryptocurrencies to localStorage when updated
  useEffect(() => {
    localStorage.setItem("addedCryptos", JSON.stringify(addedCryptos));
  }, [addedCryptos]);

  // Effect to set current time and time 24 hours ago on mount
  useEffect(() => {
    const currentTime = new Date().getTime();
    setUnixTime(currentTime);
    const time24HoursAgo = currentTime - 24 * 60 * 60 * 1000;
    setUnixTime24HoursAgo(time24HoursAgo);
  }, []);

  // Function to handle changes in the featured cryptocurrencies
  const handleChange = (data) => {
    setFeatured([data.data]);
  };

  // Function to handle input changes
  const handleInputChange = (input) => {
    const { name, value } = input.target;
    setValues({ ...values, [name]: value.toUpperCase() });
  };

  // Function to reset input values
  const resetInput = (inp) => {
    setValues({ [inp]: "" });
  };

  // Function to fetch cryptocurrency data
  const apiKey = "326199e7-2e79-49c1-bf17-83428e2f745e";
  const urlFeatured = "https://api.coincap.io/v2/assets?rank=descending";
  const cryptoReq = async (url, func) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      func(data);

      data.data.forEach(async (item) => {
        try {
          const resp = await fetch(
            `https://api.coincap.io/v2/assets/${item.id}/history?interval=h1&start=${unixTime24HoursAgo}&end=${unixTime}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            },
          );

          const data = await resp.json();

          item.intervals = data.data.map((i) => i.priceUsd);
        } catch (error) {
          return;
        }
      });
    } catch (error) {
      return;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setTimeout(() => {
        const p = filtered()
          ? addedCryptos.filter((i) => i.symbol === filtered()[0].symbol)
          : false;
        if (filtered() && p && !p.length) {
          setAddedCryptos(addedCryptos.concat(filtered()));
          inpAddcrypto.classList.remove("fail");
          inpAddcrypto.blur();
          resetInput("addcrypto");
        } else {
          inpAddcrypto.className = "fail";
        }
      }, 0);
    }
  };

  // Function to add cryptocurrency to portfolio
  const addToPort = () => {
    setTimeout(() => {
      const p = filtered()
        ? addedCryptos.filter((i) => i.symbol === filtered()[0].symbol)
        : false;
      if (filtered() && p && !p.length) {
        setAddedCryptos(addedCryptos.concat(filtered()));
        inpAddcrypto.classList.remove("fail");
        resetInput("addcrypto");
      } else {
        inpAddcrypto.className = "fail";
      }
    }, 0);
  };

  // Effect to fetch cryptocurrency data on mount
  useEffect(() => {
    cryptoReq(urlFeatured, handleChange);
  }, []);

  return (
    <Routes>
      <Route
        element={
          <Homepage
            handleInputChange={handleInputChange}
            handleChange={handleChange}
            values={values}
            featured={featured}
            cryptoReq={cryptoReq}
            urlFeatured={urlFeatured}
            resetInput={resetInput}
          />
        }
        path="/"
      />
      <Route
        element={
          <CryptoDetails
            cryptoReq={cryptoReq}
            resetInput={resetInput}
            urlFeatured={urlFeatured}
            item={featured[0]}
            handleChange={handleChange}
            featured={featured}
            handleInputChange={handleInputChange}
            values={values}
            starCrypto={starCrypto}
            addedCryptos={addedCryptos}
          />
        }
        path="asset/:cryptoId"
      />
      <Route
        element={
          <Portfolio
            addedCryptos={addedCryptos}
            inpAddcrypto={inpAddcrypto}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
            addToPort={addToPort}
            filtered={filtered}
            removeCrypto={removeCrypto}
            values={values}
            featured={featured}
            cryptoReq={cryptoReq}
            resetInput={resetInput}
          />
        }
        path="/portfolio"
      />
    </Routes>
  );
}

export default App;
