import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import Item from "./Item";
import Minter from "./Minter";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <Minter /> */}
      {/* <Item id={nftId} /> */}

      <Footer />
    </div>
  );
}

export default App;
