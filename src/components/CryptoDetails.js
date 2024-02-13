import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../styles/cryptodetails.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const CryptoDetails = (props) => {
  const {
    cryptoReq,
    addedCryptos,
    resetInput,
    item,
    featured,
    handleInputChange,
    values,
    starCrypto,
  } = props;

  // Get the cryptocurrency ID from the URL
  const { cryptoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [crypto, setCrypto] = useState(null);
  const [starred, setStarred] = useState(false);

  const apiKey = "326199e7-2e79-49c1-bf17-83428e2f745e";

  // Effect to filter the cryptocurrency based on the ID
  useEffect(() => {
    let c = item ? item.filter((i) => i.symbol === cryptoId) : null;
    setCrypto(c);
  }, [item, cryptoId]);

  // Effect to fetch historical data for the cryptocurrency
  useEffect(() => {
    if (crypto && loading) {
      const cryptoCopy = crypto[0];
      const fetchy = async () => {
        await fetch(
          `https://api.coincap.io/v2/assets/${crypto[0].id}/history?interval=h1&start=1677927994294&end=1678014394294`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          },
        )
          .then((resp) => resp.json())
          .then((data) => {
            cryptoCopy.intervals = data.data.map((i) => i.priceUsd);
            setCrypto([cryptoCopy]);
            setTimeout(() => {
              setLoading(false);
            }, 0);
          });
      };
      fetchy();
    }
  }, [crypto, cryptoId, loading, item]);

  // Function to create dataset for the Line chart
  const dataset = (asset) => {
    return {
      labels,
      datasets: [
        {
          label: "Hourly Price",
          data: asset.intervals,
          borderColor: "#5bcc52",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  };

  // Effect hook to check if the cryptocurrency is already in favourites
  useEffect(() => {
    if (crypto) {
      let filteredOption = addedCryptos.filter((i) => i.id === crypto[0].id);
      // Set the star's status
      if (filteredOption.length) {
        setStarred(true);
      } else {
        setStarred(false);
      }
    }
  }, [crypto]);

  // Configuration options for the line chart
  const options = {
    responsive: true,
    plugins: {
      legend: false,
      title: {
        display: true,
        text: "Day Chart",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#ffffff",
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          color: "#262627", // Set the color of the x-axis grid lines
        },
      },
      y: {
        grid: {
          color: "#262627", // Set the color of the x-axis grid lines
        },
      },
    },
  };

  // Generate labels for the Line chart
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

  return (
    <>
      {!loading ? (
        <div className="CryptoDetails">
          <Navbar
            handleInputChange={handleInputChange}
            value={values.search}
            options={featured[0]}
            cryptoReq={cryptoReq}
            resetInput={resetInput}
          />
          <div className="cont-crypto-details">
            <div className="cont-item-name">
              <p className="item-name">
                {crypto[0].name}
                <span>{crypto[0].symbol}</span>
              </p>
              <FontAwesomeIcon
                className={
                  starred ? "btn-addtoportfolio starred" : "btn-addtoportfolio"
                }
                icon={faStar}
                onClick={() => {
                  if (starCrypto(crypto[0])) {
                    setStarred(true);
                  } else {
                    setStarred(false);
                  }
                }}
              />
            </div>
            <p className="item-price">
              <span>Crypto Price: </span>$
              {Number(crypto[0].priceUsd).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <Line
            key={crypto[0].symbol}
            data={dataset(crypto[0])}
            options={options}
            className="chart"
          />{" "}
          <div className="cont-overview">
            <h2>Overview</h2>
            <p className="overview-details">
              <span>Market Cap:</span> $
              {Number(crypto[0].marketCapUsd).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="overview-details">
              <span>Volume (24hr):</span>{" "}
              {Number(crypto[0].volumeUsd24Hr).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="overview-details">
              <span>Market Supply:</span>{" "}
              {Number(crypto[0].supply).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </>
  );
};

export default CryptoDetails;
