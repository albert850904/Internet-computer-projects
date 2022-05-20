import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor OpenD {

  // custom data type
  private type ListedNFT = {
    nftOwner: Principal;
    nftPrice: Nat;
  };

  // NFTActorClass裡面的NFT data type
  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  // 儲存map of principal id，equal檢查有沒有相等，hash讓新的item可以被hash
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  // 儲存item that list for sell, second argument will be custom type
  var mapOfNftListing = HashMap.HashMap<Principal, ListedNFT>(1, Principal.equal, Principal.hash);

  public shared(msg) func mint(img: [Nat8], name: Text) : async Principal {
    let owner : Principal = msg.caller; // access the identity of the user, 有authorize的都會有

    Debug.print(debug_show(Cycles.balance()));
    Cycles.add(100_500_000_000); // 正式環境需要cycle才能跑，但是目前還沒有定義cycle如何去實作，所以使用experimental cycle. 建立一個canister需要500000000cycle所以這邊給他一堆cycle來建立並運行.
    Debug.print(debug_show(Cycles.balance()));

    // programatically
    let newNFT = await NFTActorClass.NFT(name, owner, img);

    let newNFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal;
  };

  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userOwnedNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userOwnedNFTs);
  };

  public query func getListedNFTs() : async [Principal] {
    let ids = Iter.toArray(mapOfNftListing.keys());
    return ids;
  };

  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
    // 從owner list 拿出owner, 如果是新owner 就回傳空List
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    // 把新的NFT塞進去owner的NFT List
    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  public shared(msg) func listItemForSell(nftId: Principal, price: Nat) : async Text {
    var nftItem : NFTActorClass.NFT = switch (mapOfNFTs.get(nftId)) {
      case null return "NFT does not exist";
      case (?result) result;
    };

    let owner = await nftItem.getOwner();

    // 確保呼叫此function的人確實為owner 
    if (Principal.equal(owner, msg.caller)) {
      let newListedItem : ListedNFT = {
        nftOwner = owner;
        nftPrice = price;
      };

      mapOfNftListing.put(nftId, newListedItem);
      return "success";
    } else {
      return "you do not own this nft"
    };
  };

  public query func getOpendCanisterID() : async Principal {
    return Principal.fromActor(OpenD);
  };

  public query func checkIsNFTListed(nftId: Principal) : async Bool {
    if (mapOfNftListing.get(nftId) == null) return false;
    return true;
  } ;

  public query func getOriginalOwner(nftId: Principal) : async Principal {
    var listedNFT: ListedNFT = switch (mapOfNftListing.get(nftId)) {
      case null return Principal.fromText("");
      case (?result) result;
    };

    return listedNFT.nftOwner;
  };

  public query func getListedNFTPrice(nftId: Principal) : async Nat {
    var listedNFT: ListedNFT = switch (mapOfNftListing.get(nftId)) {
      case null return 0;
      case (?result) result;
    };

    return listedNFT.nftPrice;
  }; 

  public shared(msg) func handleCompletePurchase(nftId: Principal, ownerId: Principal, newOwnerId: Principal) : async Text {
    var purchasedNFT : NFTActorClass.NFT = switch (mapOfNFTs.get(nftId)) {
      case null return "NFT not found";
      case (?result) result;
    };

    // transfer
    let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
    if (transferResult == "success") {
      // 從listing 下架
      mapOfNftListing.delete(nftId);
      var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
        case null  List.nil<Principal>();
        case (?result)  result;
      };

      // 更新原本用戶擁有的nft
      ownedNFTs := List.filter(ownedNFTs, func (listedItemId: Principal) : Bool {
        return listedItemId != nftId;
      });

      // 更新新用戶的nft
      addToOwnershipMap(newOwnerId, nftId);
      return "success";
    } else {
      return "Error occurs";
    };
  };

};
