import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import logo from "../../assets/logo.png";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import Button from "./Button";
import PriceInput from "./PriceInput";
import { opend } from "../../../declarations/opend";
import Loading from "./Loading";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const { id, role } = props;
  const [nftName, setNftName] = useState();
  const [nftOwner, setNftOwner] = useState();
  const [nftImage, setNftImage] = useState();
  const [nftPrice, setNFTPrice] = useState("");
  const [listedNftPrice, setListedNftPrice] = useState();
  const [isListed, setIsListed] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isOthersNFT, setIsOthersNFT] = useState(false);
  const [actor, setActor] = useState();
  const [isLoaderHidden, setIsLoaderHidden] = useState(true);
  const [shouldDisplay, setShouldDisplay] = useState(true);

  const canisterId = id;
  const localhost = "http://localhost:8081/";
  const agent = new HttpAgent({ host: localhost });
  // TODO: deploy shoudl remove
  // 在local環境，dfinity不會預設talk to internet computer
  agent.fetchRootKey();

  const loadNFTHandler = async () => {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });

    setActor(NFTActor);

    const name = await NFTActor.getName();
    setNftName(name);

    const owner = await NFTActor.getOwner();
    setNftOwner(owner.toText());

    const image = await NFTActor.getAsset();
    // 把Nat8 轉成 UInt8
    const convertedImage = new Uint8Array(image);
    // 先轉成array buffer, 然後轉成blob，最後再轉換成img可以讀的型別
    const imageObject = URL.createObjectURL(
      new Blob([convertedImage.buffer, { type: "image/png" }])
    );
    setNftImage(imageObject);

    // whethe the nft is listed for sell
    const isNftListed = await opend.checkIsNFTListed(id);

    if (isNftListed) {
      setIsListed(isNftListed);
      setNftOwner("OpenD");
    }

    // discover mode should show price
    if (role === "discover") {
      // whether nft is not user's
      const originalOwner = await opend.getOriginalOwner(id);
      setIsOthersNFT(originalOwner.toText() !== CURRENT_USER_ID.toText());
      const nftPrice = await opend.getListedNFTPrice(id);
      setListedNftPrice(Number(nftPrice));
    }
  };

  const sellNFTHandler = async () => {
    if (!isSelling) {
      setIsSelling((prevState) => !prevState);
      return;
    }

    setIsLoaderHidden(false);
    setIsListed(true);

    const result = await opend.listItemForSell(id, Number(nftPrice));

    if (result === "success") {
      const opendID = await opend.getOpendCanisterID();
      const transferResult = await actor.transferOwnership(opendID);

      if (transferResult === "success") {
        setIsLoaderHidden(true);
        setIsSelling(false);
        setNftOwner("OpenD");
      }
    }
  };

  const buyNFTHandler = async () => {
    setIsLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("tqtu6-byaaa-aaaaa-aaana-cai"),
    });

    // transfer money from buyer to seller
    const sellerId = await opend.getOriginalOwner(id);

    const transferResult = await tokenActor.transfer(sellerId, listedNftPrice);
    console.log(transferResult);
    if (transferResult === "Success") {
      // transfer ownership
      const updateResult = await opend.handleCompletePurchase(
        id,
        sellerId,
        CURRENT_USER_ID
      );
      setIsLoaderHidden(true);
      setShouldDisplay(false);
    }
  };

  useEffect(() => {
    loadNFTHandler();
  }, []);

  return (
    <div
      style={{ display: shouldDisplay ? "inline" : "none" }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          style={{
            filter: isListed && role === "collection" ? "blur(4px)" : "",
          }}
          src={nftImage}
        />
        <Loading isHide={isLoaderHidden} />
        <div className="disCardContent-root">
          {role === "discover" && <PriceLabel sellPrice={listedNftPrice} />}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nftName}
            {isListed && <span className="purple-text"> Listed</span>}
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {nftOwner}
          </p>
          {isSelling && (
            <PriceInput onPriceChange={setNFTPrice} priceValue={nftPrice} />
          )}
          {role === "collection"
            ? !isListed && (
                <Button
                  handleClick={sellNFTHandler}
                  buttonText={isSelling ? "Confirm" : "Sell"}
                />
              )
            : isOthersNFT && (
                <Button handleClick={buyNFTHandler} buttonText="Buy" />
              )}
        </div>
      </div>
    </div>
  );
}

export default Item;
