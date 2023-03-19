import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.scss";

const Navbar = (props) => {
  const { resetInput, cryptoReq, value, handleInputChange, options } = props;

  const [filteredOptions, setFilteredOptions] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleChange = (data) => {
    setFilteredOptions(data.data);
  };

  const handleFilter = () => {
    const filteredProducts = options.filter((item) =>
      item.symbol.includes(value)
    );
    setFilteredOptions(filteredProducts);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredOptions[selectedIndex]) {
      // enter key and option selected
      const selectedOption = filteredOptions[selectedIndex];
      handleSearch("search");
      window.location.href = `#/asset/${selectedOption.symbol}`;
    }
  };

  const handleSearch = (item) => {
    setHidden(true);
    resetInput(item);
  };

  const handleArrowKey = (e) => {
    if (e.keyCode === 38 && selectedIndex > 0) {
      // up arrow
      setSelectedIndex(selectedIndex - 1);
    } else if (e.keyCode === 40 && selectedIndex < filteredOptions.length - 1) {
      // down arrow
      setSelectedIndex(selectedIndex + 1);
    }
  };

  useEffect(() => {
    if (!options) {
      cryptoReq(
        "https://api.coincap.io/v2/assets?rank=descending",
        handleChange
      );
    } else {
      handleFilter();
      if (value) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    }
  }, [value]);

  return (
    <nav className="navbar">
      <FontAwesomeIcon
        icon={faBars}
        className="menu-icon"
        onClick={() => {
          setMenuOpen(true);
        }}
      />
      <div
        className={menuOpen ? "modal" : "modal hide"}
        onClick={() => {
          setMenuOpen(false);
        }}
      ></div>
      <div className={menuOpen ? "menu" : "menu hide"}>
        <FontAwesomeIcon
          icon={faXmark}
          className="menu-close"
          onClick={() => {
            setMenuOpen(false);
          }}
        />
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/portfolio">
          Portfolio
        </Link>
        <div className="cont-search">
          {" "}
          <input
            name="search"
            type="search"
            onChange={(e) => {
              handleInputChange(e);
              setSelectedIndex(0);
            }}
            value={value}
            maxLength={4}
            onKeyDown={(e) => {
              handleArrowKey(e);
              handleKeyPress(e);
            }}
          />
          <div className={hidden ? "dropdown hide" : "dropdown"}>
            {filteredOptions
              ? filteredOptions.map((item, index) => (
                  <Link
                    key={item.id}
                    className={
                      index === selectedIndex
                        ? "dropdown-option selected"
                        : "dropdown-option"
                    }
                    to={`/asset/${item.symbol}`}
                    onClick={() => {
                      handleSearch("search");
                    }}
                    onMouseEnter={() => {
                      setSelectedIndex(index);
                    }}
                  >
                    {item.symbol}
                  </Link>
                ))
              : "loading"}
          </div>
        </div>
      </div>
      <p className="title">
        <Link to="/">Enkrypto</Link>
      </p>
      <div className="links">
        <Link
          to="/"
          onClick={() => {
            resetInput("search");
            resetInput("addcrypto");
          }}
          className="nav-link"
        >
          Home
        </Link>
        <Link
          to="/portfolio"
          onClick={() => {
            resetInput("search");
            resetInput("addcrypto");
          }}
          className="nav-link"
        >
          Portfolio
        </Link>
      </div>
      <div className="cont-search">
        {" "}
        <input
          name="search"
          type="search"
          onChange={(e) => {
            handleInputChange(e);
            setSelectedIndex(0);
          }}
          value={value}
          maxLength={4}
          onKeyDown={(e) => {
            handleArrowKey(e);
            handleKeyPress(e);
          }}
        />
        <div className={hidden ? "dropdown hide" : "dropdown"}>
          {filteredOptions
            ? filteredOptions.map((item, index) => (
                <Link
                  key={item.id}
                  className={
                    index === selectedIndex
                      ? "dropdown-option selected"
                      : "dropdown-option"
                  }
                  to={`/asset/${item.symbol}`}
                  onClick={() => {
                    handleSearch("search");
                  }}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                  }}
                >
                  {item.symbol}
                </Link>
              ))
            : "loading"}
        </div>
      </div>{" "}
    </nav>
  );
};

export default Navbar;
