/* eslint-disable */

/** ExecutionPolicy specifies how a quote request should be filled. */
export enum ExecutionPolicy {
    /**
     * EXECUTION_POLICY_IOC - EXECUTION_POLICY_IOC is Immediate-Or-Cancel: accept any partial
     * fill at or above the minimum threshold. This is the default.
     */
    EXECUTION_POLICY_IOC = 'EXECUTION_POLICY_IOC',
    /**
     * EXECUTION_POLICY_FOK - EXECUTION_POLICY_FOK is Fill-Or-Kill: the accepted rate must
     * support the full maximum amount or the quote is rejected.
     */
    EXECUTION_POLICY_FOK = 'EXECUTION_POLICY_FOK',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

/** QuoteRespStatus is an enum that represents the status of a quote response. */
export enum QuoteRespStatus {
    /**
     * INVALID_ASSET_RATES - INVALID_ASSET_RATES indicates that at least one asset rate in the
     * quote response is invalid.
     */
    INVALID_ASSET_RATES = 'INVALID_ASSET_RATES',
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
    /**
     * PORTFOLIO_PILOT_ERR - PORTFOLIO_PILOT_ERR indicates that an unexpected error occurred in the
     * portfolio pilot while evaluating the quote response.
     */
    PORTFOLIO_PILOT_ERR = 'PORTFOLIO_PILOT_ERR',
    /**
     * VALID_ACCEPT_QUOTE - VALID_ACCEPT_QUOTE indicates that the accepted quote passed all
     * validation checks successfully.
     */
    VALID_ACCEPT_QUOTE = 'VALID_ACCEPT_QUOTE',
    /**
     * MIN_FILL_NOT_MET - MIN_FILL_NOT_MET indicates that the minimum fill constraint
     * was not satisfiable at the accepted rate.
     */
    MIN_FILL_NOT_MET = 'MIN_FILL_NOT_MET',
    /**
     * RATE_BOUND_MISS - RATE_BOUND_MISS indicates that the accepted rate violated the
     * requester's rate limit constraint.
     */
    RATE_BOUND_MISS = 'RATE_BOUND_MISS',
    /**
     * FOK_NOT_VIABLE - FOK_NOT_VIABLE indicates that the FOK execution policy could
     * not be satisfied at the accepted rate.
     */
    FOK_NOT_VIABLE = 'FOK_NOT_VIABLE',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

/** RfqPolicyType indicates the type of policy of an RFQ session. */
export enum RfqPolicyType {
    /** RFQ_POLICY_TYPE_SALE - RFQ_POLICY_TYPE_SALE indicates that the RFQ session was a sale. */
    RFQ_POLICY_TYPE_SALE = 'RFQ_POLICY_TYPE_SALE',
    /** RFQ_POLICY_TYPE_PURCHASE - RFQ_POLICY_TYPE_PURCHASE indicates that the RFQ session was a purchase. */
    RFQ_POLICY_TYPE_PURCHASE = 'RFQ_POLICY_TYPE_PURCHASE',
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

/**
 * FixedPoint is a scaled integer representation of a fractional number.
 *
 * This type consists of two integer fields: a coefficient and a scale.
 * Using this format enables precise and consistent representation of fractional
 * numbers while avoiding floating-point data types, which are prone to
 * precision errors.
 *
 * The relationship between the fractional representation and its fixed-point
 * representation is expressed as:
 * ```
 * V = F_c / (10^F_s)
 * ```
 * where:
 *
 * * `V` is the fractional value.
 *
 * * `F_c` is the coefficient component of the fixed-point representation. It is
 *    the scaled-up fractional value represented as an integer.
 *
 * * `F_s` is the scale component. It is an integer specifying how
 *   many decimal places `F_c` should be divided by to obtain the fractional
 *   representation.
 */
export interface FixedPoint {
    /**
     * The coefficient is the fractional value scaled-up as an integer. This
     * integer is represented as a string as it may be too large to fit in a
     * uint64.
     */
    coefficient: string;
    /**
     * The scale is the component that determines how many decimal places
     * the coefficient should be divided by to obtain the fractional value.
     */
    scale: number;
}

export interface AddAssetBuyOrderRequest {
    /** asset_specifier is the subject asset. */
    assetSpecifier: AssetSpecifier | undefined;
    /**
     * The maximum amount of the asset that the provider must be willing to
     * offer.
     */
    assetMaxAmt: string;
    /** The unix timestamp in seconds after which the order is no longer valid. */
    expiry: string;
    /** The public key of the intended recipient peer for the order. */
    peerPubKey: Uint8Array | string;
    /**
     * timeout_seconds is the number of seconds to wait for the peer to respond
     * with an accepted quote (or a rejection).
     */
    timeoutSeconds: number;
    /**
     * If set, the check if a channel with the given asset exists with the peer
     * will be skipped. An active channel with the peer is still required for
     * the RFQ negotiation to work. This flag shouldn't be set outside of test
     * scenarios.
     */
    skipAssetChannelCheck: boolean;
    /**
     * An optional text field that can be used to provide additional metadata
     * about the buy order to the price oracle. This can include information
     * about the wallet end user that initiated the transaction, or any
     * authentication information that the price oracle can use to give out a
     * more accurate (or discount) asset rate. Though not verified or enforced
     * by tapd, the suggested format for this field is a JSON string.
     * This field is optional and can be left empty if no metadata is available.
     * The maximum length of this field is 32'768 bytes.
     */
    priceOracleMetadata: string;
    /**
     * The optional minimum amount of the asset that the provider
     * must be willing to offer. If set, must be less than or equal
     * to asset_max_amt. When omitted, defaults to asset_max_amt
     * (full-fill expected). Set explicitly to 0 to accept any
     * partial fill.
     */
    assetMinAmt?: string | undefined;
    /**
     * An optional rate limit constraint expressed as a fixed-point number.
     * For buy orders this is the minimum acceptable rate (asset units per
     * BTC). If unset, no rate floor is enforced.
     */
    assetRateLimit: FixedPoint | undefined;
    /**
     * The execution policy for this order. IOC (default) accepts any
     * partial fill >= min threshold. FOK requires the rate to support
     * the full max amount.
     */
    executionPolicy: ExecutionPolicy;
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
    /**
     * The maximum msat amount that the responding peer must agree to pay
     * (units: millisats).
     */
    paymentMaxAmt: string;
    /** The unix timestamp in seconds after which the order is no longer valid. */
    expiry: string;
    /** The public key of the intended recipient peer for the order. */
    peerPubKey: Uint8Array | string;
    /**
     * timeout_seconds is the number of seconds to wait for the peer to respond
     * with an accepted quote (or a rejection).
     */
    timeoutSeconds: number;
    /**
     * If set, the check if a channel with the given asset exists with the peer
     * will be skipped. An active channel with the peer is still required for
     * the RFQ negotiation to work. This flag shouldn't be set outside of test
     * scenarios.
     */
    skipAssetChannelCheck: boolean;
    /**
     * An optional text field that can be used to provide additional metadata
     * about the sell order to the price oracle. This can include information
     * about the wallet end user that initiated the transaction, or any
     * authentication information that the price oracle can use to give out a
     * more accurate (or discount) asset rate. Though not verified or enforced
     * by tapd, the suggested format for this field is a JSON string.
     * This field is optional and can be left empty if no metadata is available.
     * The maximum length of this field is 32'768 bytes.
     */
    priceOracleMetadata: string;
    /**
     * The optional minimum msat amount that the responding peer
     * must agree to pay. If set, must be less than or equal to
     * payment_max_amt. When omitted, defaults to payment_max_amt
     * (full-fill expected). Set explicitly to 0 to accept any
     * partial fill (units: millisats).
     */
    paymentMinAmt?: string | undefined;
    /**
     * An optional rate limit constraint expressed as a fixed-point number.
     * For sell orders this is the maximum acceptable rate (asset units per
     * BTC). If unset, no rate ceiling is enforced.
     */
    assetRateLimit: FixedPoint | undefined;
    /**
     * The execution policy for this order. IOC (default) accepts any
     * partial fill >= min threshold. FOK requires the rate to support
     * the full max amount.
     */
    executionPolicy: ExecutionPolicy;
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

export interface AssetSpec {
    /** The 32-byte asset ID specified as raw bytes. */
    id: Uint8Array | string;
    /**
     * The 32-byte asset group public key, serialized in BIP340 format.
     * BIP340 defines a canonical encoding for Schnorr public keys.
     * This field is serialized using schnorr.SerializePubKey.
     */
    groupPubKey: Uint8Array | string;
}

export interface PeerAcceptedBuyQuote {
    /** Quote counterparty peer. */
    peer: string;
    /** The unique identifier of the quote request. */
    id: Uint8Array | string;
    /**
     * The short channel ID of the channel over which the payment for the quote
     * should be made.
     */
    scid: string;
    /**
     * The maximum exchange amount denoted in the subject asset. This includes
     * the user-configured maximum routing fees, so the actual payment amount
     * will be less than this. This just defines the maximum volume that the
     * edge node has accepted to divest with the given rate.
     */
    assetMaxAmount: string;
    /**
     * ask_asset_rate is the asset to BTC conversion rate represented as a
     * fixed-point number.
     */
    askAssetRate: FixedPoint | undefined;
    /** The unix timestamp in seconds after which the quote is no longer valid. */
    expiry: string;
    /**
     * The smallest amount of asset units that can be transported within a
     * single HTLC over the Lightning Network with the given rate. This is the
     * asset unit equivalent of 354 satoshis, which is the minimum amount for an
     * HTLC to be above the dust limit.
     */
    minTransportableUnits: string;
    /**
     * An optional user-provided text field used to provide additional metadata
     * about the buy order to the price oracle. This can include information
     * about the wallet end user that initiated the transaction, or any
     * authentication information that the price oracle can use to give out a
     * more accurate (or discount) asset rate.
     */
    priceOracleMetadata: string;
    /** The subject asset specifier. */
    assetSpec: AssetSpec | undefined;
    /**
     * accepted_max_amount is an optional negotiated fill quantity. When
     * non-zero the responder accepted up to this many asset units instead
     * of the full request max.
     */
    acceptedMaxAmount: string;
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
    /**
     * bid_asset_rate is the asset to BTC conversion rate represented as a
     * fixed-point number.
     */
    bidAssetRate: FixedPoint | undefined;
    /** The unix timestamp in seconds after which the quote is no longer valid. */
    expiry: string;
    /**
     * The minimum amount of milli-satoshis that need to be sent out in order to
     * transport a single asset unit over the Lightning Network with the given
     * rate. This is the base amount of 354,000 milli-satoshi (the minimum
     * amount for a non-dust HTLC) plus the equivalent of one asset unit in
     * milli-satoshis.
     */
    minTransportableMsat: string;
    /**
     * An optional user-provided text field used to provide additional metadata
     * about the sell order to the price oracle. This can include information
     * about the wallet end user that initiated the transaction, or any
     * authentication information that the price oracle can use to give out a
     * more accurate (or discount) asset rate.
     */
    priceOracleMetadata: string;
    /** The subject asset specifier. */
    assetSpec: AssetSpec | undefined;
    /**
     * accepted_max_amount is an optional negotiated fill quantity. When
     * non-zero the responder accepted up to this many msat instead of the
     * full request max.
     */
    acceptedMaxAmount: string;
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

export interface ForwardingHistoryRequest {
    /**
     * min_timestamp is the minimum Unix timestamp in seconds. Only forwarding
     * events that settled at or after this time are returned. If not set, there
     * is no lower bound.
     */
    minTimestamp: string;
    /**
     * max_timestamp is the maximum Unix timestamp in seconds. Only forwarding
     * events that settled at or before this time are returned. If not set,
     * there is no upper bound.
     */
    maxTimestamp: string;
    /**
     * peer is the optional counterparty peer's public key. If set,
     * only forwarding events involving this peer are returned.
     */
    peer: Uint8Array | string;
    /**
     * asset_specifier optionally filters forwarding events by asset ID or group
     * key.
     */
    assetSpecifier: AssetSpecifier | undefined;
    /** limit is the maximum number of records to return. */
    limit: number;
    /** offset is the number of records to skip for pagination. */
    offset: number;
}

export interface ForwardingHistoryResponse {
    /**
     * forwards is the list of completed asset forwarding events matching the
     * query.
     */
    forwards: ForwardingEvent[];
    /**
     * total_count is the total number of forwards matching the filter (before
     * pagination is applied). This can be used for pagination.
     */
    totalCount: string;
}

export interface ForwardingEvent {
    /**
     * rfq_id is the unique identifier of the RFQ session that governed this
     * forward.
     */
    rfqId: Uint8Array | string;
    /** chan_id_in is the short channel ID of the incoming channel. */
    chanIdIn: string;
    /** chan_id_out is the short channel ID of the outgoing channel. */
    chanIdOut: string;
    /** htlc_id is the HTLC ID on the incoming channel. */
    htlcId: string;
    /**
     * opened_at is the Unix timestamp in seconds when the forward was
     * initiated.
     */
    openedAt: string;
    /**
     * settled_at is the Unix timestamp in seconds when the forward settled.
     * A value of 0 means the forward has not settled yet.
     */
    settledAt: string;
    /**
     * failed_at is the Unix timestamp in seconds when the forward failed.
     * A value of 0 means the forward has not failed.
     */
    failedAt: string;
    /** asset_amt is the asset amount that was swapped. */
    assetAmt: string;
    /**
     * amt_in_msat is the actual amount received on the incoming channel in
     * millisatoshis.
     */
    amtInMsat: string;
    /**
     * amt_out_msat is the actual amount sent on the outgoing channel in
     * millisatoshis.
     */
    amtOutMsat: string;
    /**
     * policy_type indicates whether this was a sale or purchase of assets
     * from the edge node's perspective.
     */
    policyType: RfqPolicyType;
    /** peer is the counterparty peer's public key as a hex string. */
    peer: string;
    /** asset_specifier identifies the asset that was swapped. */
    assetSpec: AssetSpec | undefined;
    /** rate is the exchange rate that was used for this swap. */
    rate: FixedPoint | undefined;
}

export interface Rfq {
    /**
     * tapcli: `rfq buyorder`
     * AddAssetBuyOrder is used to add a buy order for a specific asset. If a buy
     * order already exists for the asset, it will be updated.
     *
     * A buy order instructs the RFQ (Request For Quote) system to request a quote
     * from a peer for the acquisition of an asset.
     *
     * The normal use of a buy order is as follows:
     * 1. Alice, operating a wallet node, wants to receive a Tap asset as payment
     * by issuing a Lightning invoice.
     * 2. Alice has an asset channel established with Bob's edge node.
     * 3. Before issuing the invoice, Alice needs to agree on an exchange rate with
     * Bob, who will facilitate the asset transfer.
     * 4. To obtain the best exchange rate, Alice creates a buy order specifying
     * the desired asset.
     * 5. Alice's RFQ subsystem processes the buy order and sends buy requests to
     * relevant peers to find the best rate. In this example, Bob is the only
     * available peer.
     * 6. Once Bob provides a satisfactory quote, Alice accepts it.
     * 7. Alice issues the Lightning invoice, which Charlie will pay.
     * 8. Instead of paying Alice directly, Charlie pays Bob.
     * 9. Bob then forwards the agreed amount of the Tap asset to Alice over their
     * asset channel.
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
    /**
     * tapcli: `rfq forwardinghistory`
     * ForwardingHistory is used to query for completed asset forwarding events.
     * These are historical records of HTLCs that were settled successfully.
     */
    forwardingHistory(
        request?: DeepPartial<ForwardingHistoryRequest>
    ): Promise<ForwardingHistoryResponse>;
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
