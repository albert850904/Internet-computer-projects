import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import logo from "../../assets/logo.png";
import Gallery from "./Gallery";
import Minter from "./Minter";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState();
  const [listedGallery, setListedGallery] = useState();

  const fetchNFTs = async () => {
    const userNftIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    setUserOwnedGallery(userNftIds);

    const listedNFTs = await opend.getListedNFTs();
    setListedGallery(listedNFTs);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collections">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Switch>
        <Route exact path="/">
          <img className="bottom-space" src={homeImage} />
        </Route>
        <Route path="/discover">
          <Gallery title="Discover" role="discover" ids={listedGallery} />
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collections">
          <Gallery title="My NFTs" role="collection" ids={userOwnedGallery} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
