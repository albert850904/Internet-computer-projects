import React from "react";
import PropTypes from "prop-types";

function PriceInput(props) {
  const { priceValue, onPriceChange } = props;
  return (
    <input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={priceValue}
      onChange={(e) => onPriceChange(e.target.value)}
    />
  );
}

PriceInput.propTypes = {};

export default PriceInput;
