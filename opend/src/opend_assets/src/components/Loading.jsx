import React from "react";
import PropTypes from "prop-types";

function Loading(props) {
  return (
    <div hidden={props.isHide} className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

Loading.propTypes = {};

export default Loading;
