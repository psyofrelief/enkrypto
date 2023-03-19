import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/portfolio.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const Portfolio = (props) => {
  const {
    resetInput,
    addedCryptos,
    handleKeyPress,
    removeCrypto,
    handleInputChange,
    values,
    addToPort,
    featured,
    cryptoReq,
  } = props;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: false,
    plugins: {
      legend: false,
    },
    scales: {
      x: {
        ticks: {
          color: "black",
        },
      },
      y: {
        ticks: {
          color: "black",
        },
      },
    },
  };

  const labels = [];

  let date = new Date(); // get current date and time

  for (let i = 0; i < 24; i++) {
    // get the hour and pad it with a leading zero if necessary
    let hour = date.getHours().toString().padStart(2, "0");

    // add the hour label to the array
    labels.unshift(hour);

    // subtract one hour from the date
    date.setHours(date.getHours() - 1);
  }

  const dataset = (asset) => {
    return {
      labels,
      datasets: [
        {
          label: "24hr",
          data: asset.intervals,
          borderColor: "#5bcc52",
        },
      ],
    };
  };

  return (
    <div className="Portfolio">
      <Navbar
        handleInputChange={handleInputChange}
        value={values.search}
        options={featured[0]}
        cryptoReq={cryptoReq}
        resetInput={resetInput}
      />
      <h1>Portfolio</h1>
      <div className="search">
        {" "}
        <input
          name="addcrypto"
          type="search"
          value={values.addcrypto}
          maxLength={4}
          onChange={handleInputChange}
          id="inp-addcrypto"
          onKeyDown={handleKeyPress}
        />
        <button
          className="btn-add-portfolio"
          onClick={() => {
            addToPort();
          }}
        >
          +
        </button>
      </div>
      <div className="cont-cryptos">
        {addedCryptos
          ? addedCryptos.map((item) => (
              <div className="added-crypto" key={item.id}>
                {" "}
                <div className="cont-deets">
                  <p className="crypto-rank">#{item.rank}</p>
                  <Link to={`/asset/${item.symbol}`} className="crypto-name">
                    {item.name} <span>{item.symbol}</span>
                  </Link>
                  <p
                    className={
                      +item.changePercent24Hr > 0
                        ? "cont-crypto up"
                        : "cont-crypto down"
                    }
                  >
                    <span className="crypto-change24hr">
                      Change [24hr] {""}
                    </span>
                    {Number(item.changePercent24Hr).toFixed(2)}%
                  </p>
                </div>
                <Line
                  className="chart"
                  data={dataset(item)}
                  options={options}
                />
                <p className="crypto-price">
                  $
                  {Number(item.priceUsd).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <button
                  className="crypto-remove"
                  onClick={() => removeCrypto(item)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            ))
          : ""}
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;
