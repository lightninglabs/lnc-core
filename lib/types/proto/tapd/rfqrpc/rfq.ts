/* eslint-disable */

/** QuoteRespStatus is an enum that represents the status of a quote response. */
export enum QuoteRespStatus {
    /**
     * INVALID_RATE_TICK - INVALID_RATE_TICK indicates that the rate tick in the quote response is
     * invalid.
     */
    INVALID_RATE_TICK = 'INVALID_RATE_TICK',
    /**
     * INVALID_EXPIRY - INVALID_EXPIRY indicates that the expiry in the quote response is
     * invalid.
     */
    INVALID_EXPIRY = 'INVALID_EXPIRY',
    /**
     * PRICE_ORACLE_QUERY_ERR - PRICE_ORACLE_QUERY_ERR indicates that an error occurred when querying the
     * price oracle whilst evaluating the quote response.
     */
    PRICE_ORACLE_QUERY_ERR = 'PRICE_ORACLE_QUERY_ERR',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

export interface AssetSpecifier {
    /** The 32-byte asset ID specified as raw bytes (gRPC only). */
    assetId: Uint8Array | string | undefined;
    /** The 32-byte asset ID encoded as a hex string (use this for REST). */
    assetIdStr: string | undefined;
    /** The 32-byte asset group key specified as raw bytes (gRPC only). */
    groupKey: Uint8Array | string | undefined;
    /**
     * The 32-byte asset group key encoded as hex string (use this for
     * REST).
     */
    groupKeyStr: string | undefined;
}

export interface AddAssetBuyOrderRequest {
    /** asset_specifier is the subject asset. */
    assetSpecifier: AssetSpecifier | undefined;
    /** The minimum amount of the asset to buy. */
    minAssetAmount: string;
    /** The maximum amount BTC to spend (units: millisats). */
    maxBid: string;
    /** The unix timestamp in seconds after which the order is no longer valid. */
    expiry: string;
    /**
     * peer_pub_key is an optional field for specifying the public key of the
     * intended recipient peer for the order.
     */
    peerPubKey: Uint8Array | string;
    /**
     * timeout_seconds is the number of seconds to wait for the peer to respond
     * with an accepted quote (or a rejection).
     */
    timeoutSeconds: number;
}

export interface AddAssetBuyOrderResponse {
    /**
     * accepted_quote holds the quote received from the peer as a response
     * to our quote request.
     */
    acceptedQuote: PeerAcceptedBuyQuote | undefined;
    /**
     * invalid_quote is returned if the quote response received from the
     * peer was invalid or insufficient.
     */
    invalidQuote: InvalidQuoteResponse | undefined;
    /**
     * rejected_quote is returned if the quote request was rejected by the
     * peer.
     */
    rejectedQuote: RejectedQuoteResponse | undefined;
}

export interface AddAssetSellOrderRequest {
    /** asset_specifier is the subject asset. */
    assetSpecifier: AssetSpecifier | undefined;
    /** The maximum amount of the asset to sell. */
    maxAssetAmount: string;
    /** The minimum amount of BTC to accept (units: millisats). */
    minAsk: string;
    /** The unix timestamp in seconds after which the order is no longer valid. */
    expiry: string;
    /**
     * peer_pub_key is an optional field for specifying the public key of the
     * intended recipient peer for the order.
     */
    peerPubKey: Uint8Array | string;
    /**
     * timeout_seconds is the number of seconds to wait for the peer to respond
     * with an accepted quote (or a rejection).
     */
    timeoutSeconds: number;
}

export interface AddAssetSellOrderResponse {
    /**
     * accepted_quote holds the quote received from the peer as a response
     * to our quote request.
     */
    acceptedQuote: PeerAcceptedSellQuote | undefined;
    /**
     * invalid_quote is returned if the quote response received from the
     * peer was invalid or insufficient.
     */
    invalidQuote: InvalidQuoteResponse | undefined;
    /**
     * rejected_quote is returned if the quote request was rejected by the
     * peer.
     */
    rejectedQuote: RejectedQuoteResponse | undefined;
}

export interface AddAssetSellOfferRequest {
    /** asset_specifier is the subject asset. */
    assetSpecifier: AssetSpecifier | undefined;
    /** max_units is the maximum amount of the asset to sell. */
    maxUnits: string;
}

export interface AddAssetSellOfferResponse {}

export interface AddAssetBuyOfferRequest {
    /** asset_specifier is the subject asset. */
    assetSpecifier: AssetSpecifier | undefined;
    /** max_units is the maximum amount of the asset to buy. */
    maxUnits: string;
}

export interface AddAssetBuyOfferResponse {}

export interface QueryPeerAcceptedQuotesRequest {}

export interface PeerAcceptedBuyQuote {
    /** Quote counterparty peer. */
    peer: string;
    /** The unique identifier of the quote request. */
    id: Uint8Array | string;
    /**
     * scid is the short channel ID of the channel over which the payment for
     * the quote should be made.
     */
    scid: string;
    /** asset_amount is the amount of the subject asset. */
    assetAmount: string;
    /** ask_price is the price in milli-satoshi per asset unit. */
    askPrice: string;
    /** The unix timestamp in seconds after which the quote is no longer valid. */
    expiry: string;
}

export interface PeerAcceptedSellQuote {
    /** Quote counterparty peer. */
    peer: string;
    /** The unique identifier of the quote request. */
    id: Uint8Array | string;
    /**
     * scid is the short channel ID of the channel over which the payment for
     * the quote should be made.
     */
    scid: string;
    /** asset_amount is the amount of the subject asset. */
    assetAmount: string;
    /** bid_price is the price in milli-satoshi per asset unit. */
    bidPrice: string;
    /** The unix timestamp in seconds after which the quote is no longer valid. */
    expiry: string;
}

/**
 * InvalidQuoteResponse is a message that is returned when a quote response is
 * invalid or insufficient.
 */
export interface InvalidQuoteResponse {
    /** status is the status of the quote response. */
    status: QuoteRespStatus;
    /** peer is the quote counterparty peer. */
    peer: string;
    /** id is the unique identifier of the quote request. */
    id: Uint8Array | string;
}

/**
 * RejectedQuoteResponse is a message that is returned when a quote request is
 * rejected by the peer.
 */
export interface RejectedQuoteResponse {
    /** peer is the quote counterparty peer. */
    peer: string;
    /** id is the unique identifier of the quote request. */
    id: Uint8Array | string;
    /** error_message is a human-readable error message. */
    errorMessage: string;
    /** error_code is a machine-readable error code. */
    errorCode: number;
}

export interface QueryPeerAcceptedQuotesResponse {
    /**
     * buy_quotes is a list of asset buy quotes which were requested by our
     * node and have been accepted by our peers.
     */
    buyQuotes: PeerAcceptedBuyQuote[];
    /**
     * sell_quotes is a list of asset sell quotes which were requested by our
     * node and have been accepted by our peers.
     */
    sellQuotes: PeerAcceptedSellQuote[];
}

export interface SubscribeRfqEventNtfnsRequest {}

export interface PeerAcceptedBuyQuoteEvent {
    /** Unix timestamp in microseconds. */
    timestamp: string;
    /** The asset buy quote that was accepted by out peer. */
    peerAcceptedBuyQuote: PeerAcceptedBuyQuote | undefined;
}

export interface PeerAcceptedSellQuoteEvent {
    /** Unix timestamp in microseconds. */
    timestamp: string;
    /** The asset sell quote that was accepted by out peer. */
    peerAcceptedSellQuote: PeerAcceptedSellQuote | undefined;
}

export interface AcceptHtlcEvent {
    /** Unix timestamp in microseconds. */
    timestamp: string;
    /**
     * scid is the short channel ID of the channel over which the payment for
     * the quote is made.
     */
    scid: string;
}

export interface RfqEvent {
    /**
     * peer_accepted_buy_quote is an event that is emitted when a peer
     * accepted (incoming) asset buy quote message is received.
     */
    peerAcceptedBuyQuote: PeerAcceptedBuyQuoteEvent | undefined;
    /**
     * peer_accepted_sell_offer is an event that is emitted when a peer
     * accepted (incoming) asset sell quote message is received.
     */
    peerAcceptedSellQuote: PeerAcceptedSellQuoteEvent | undefined;
    /**
     * accept_htlc is an event that is sent when a HTLC is accepted by the
     * RFQ service.
     */
    acceptHtlc: AcceptHtlcEvent | undefined;
}

export interface Rfq {
    /**
     * tapcli: `rfq buyorder`
     * AddAssetBuyOrder is used to add a buy order for a specific asset. If a buy
     * order already exists for the asset, it will be updated.
     */
    addAssetBuyOrder(
        request?: DeepPartial<AddAssetBuyOrderRequest>
    ): Promise<AddAssetBuyOrderResponse>;
    /**
     * tapcli: `rfq sellorder`
     * AddAssetSellOrder is used to add a sell order for a specific asset. If a
     * sell order already exists for the asset, it will be updated.
     */
    addAssetSellOrder(
        request?: DeepPartial<AddAssetSellOrderRequest>
    ): Promise<AddAssetSellOrderResponse>;
    /**
     * tapcli: `rfq selloffer`
     * AddAssetSellOffer is used to add a sell offer for a specific asset. If a
     * sell offer already exists for the asset, it will be updated.
     */
    addAssetSellOffer(
        request?: DeepPartial<AddAssetSellOfferRequest>
    ): Promise<AddAssetSellOfferResponse>;
    /**
     * tapcli: `rfq buyoffer`
     * AddAssetBuyOffer is used to add a buy offer for a specific asset. If a
     * buy offer already exists for the asset, it will be updated.
     *
     * A buy offer is used by the node to selectively accept or reject incoming
     * asset sell quote requests before price is considered.
     */
    addAssetBuyOffer(
        request?: DeepPartial<AddAssetBuyOfferRequest>
    ): Promise<AddAssetBuyOfferResponse>;
    /**
     * tapcli: `rfq acceptedquotes`
     * QueryPeerAcceptedQuotes is used to query for quotes that were requested by
     * our node and have been accepted our peers.
     */
    queryPeerAcceptedQuotes(
        request?: DeepPartial<QueryPeerAcceptedQuotesRequest>
    ): Promise<QueryPeerAcceptedQuotesResponse>;
    /** SubscribeRfqEventNtfns is used to subscribe to RFQ events. */
    subscribeRfqEventNtfns(
        request?: DeepPartial<SubscribeRfqEventNtfnsRequest>,
        onMessage?: (msg: RfqEvent) => void,
        onError?: (err: Error) => void
    ): void;
}

type Builtin =
    | Date
    | Function
    | Uint8Array
    | string
    | number
    | boolean
    | undefined;

type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;
