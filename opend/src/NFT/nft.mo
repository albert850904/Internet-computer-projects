import Debug "mo:base/Debug";
import Principal "mo:base/Principal";


// bind class with this, this 現在代表整個class
actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {
  // Nat8: encoding bits and bytes of the iamge
  private let itemName = name;
  private var nftOwner = owner;
  private let imageBytes = content;

  public query func getName() : async Text {
    return itemName;
  };

  public query func getOwner() : async Principal {
    return nftOwner;
  };

  public query func getAsset() : async [Nat8] {
    return imageBytes;
  };

  public query func getCanisterId() : async Principal {
    // 因為是class canister
    return Principal.fromActor(this);
  };

  public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
    if (msg.caller == nftOwner) {
      nftOwner := newOwner;
      return "success";
    } else {
      return "not initiated by the nft owner";
    }
  }

}