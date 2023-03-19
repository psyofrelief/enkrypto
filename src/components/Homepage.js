import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/homepage.scss";

const Homepage = (props) => {
  const {
    handleInputChange,
    urlFeatured,
    handleChange,
    featured,
    values,
    cryptoReq,
    resetInput,
  } = props;

  useEffect(() => {
    cryptoReq(urlFeatured, handleChange);
  }, []);

  return (
    <div className="Homepage">
      <Navbar
        handleInputChange={handleInputChange}
        value={values.search}
        options={featured[0]}
        cryptoReq={cryptoReq}
        resetInput={resetInput}
      />
      <h1>Top 100 Featured Cryptocurrencies</h1>
      <table className="table">
        <thead className="cont-table-headings">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change %</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {featured.length ? (
            featured[0].map((item) => (
              <tr className="item-id" key={item.id}>
                <th className="item-rank">{item.rank}</th>
                <td className="item-name">
                  <Link
                    onClick={() => resetInput("search")}
                    to={`asset/${item.symbol}`}
                  >
                    {item.name}
                  </Link>{" "}
                  <span className="item-symbol">{item.symbol}</span>
                </td>
                <td className="item-price">
                  $
                  {Number(item.priceUsd).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="change">
                  {Number(item.changePercent24Hr).toFixed(4)}
                </td>
                <td className="market-cap">
                  $
                  {Number(item.marketCapUsd).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default Homepage;
