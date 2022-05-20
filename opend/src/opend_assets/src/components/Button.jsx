import React from "react";
import PropTypes from "prop-types";

function Button(props) {
  return (
    <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
      <span onClick={props.handleClick} className="form-Chip-label">
        {props.buttonText}
      </span>
    </div>
  );
}

Button.propTypes = {};

export default Button;
