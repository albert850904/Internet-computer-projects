import React from "react";
import { Principal } from "@dfinity/principal";
import Item from "./Item";

function Gallery(props) {
  const { ids, role } = props;

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {Array.isArray(ids) &&
              ids.map((id) => <Item id={id} key={id.toText()} role={role} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
