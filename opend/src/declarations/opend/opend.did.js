export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'checkIsNFTListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'getListedNFTPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getListedNFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getOpendCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getOriginalOwner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getOwnedNFTs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'handleCompletePurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'listItemForSell' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
