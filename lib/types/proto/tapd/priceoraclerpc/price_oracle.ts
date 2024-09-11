/* eslint-disable */
/** TransactionType is an enum representing the type of transaction. */
export enum TransactionType {
    /** PURCHASE - PURCHASE indicates a purchase transaction. */
    PURCHASE = 'PURCHASE',
    /** SALE - SALE indicates a sale transaction. */
    SALE = 'SALE',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

/**
 * RateTick is the internal unit used for asset conversions. A tick is 1/10000th
 * of a currency unit. It gives us up to 4 decimal places of precision (0.0001
 * or 0.01% or 1 bps). As an example, if the BTC/USD rate was $61,234.95, then
 * we multiply that by 10,000 to arrive at the usd_rate_tick:
 * $61,234.95 * 10000 = 612,349,500. To convert back to our normal rate, we
 * decide by 10,000 to arrive back at $61,234.95.
 *
 * NOTE: That if the payment asset is BTC, the rate tick will be given as
 * milli-satoshi per asset unit.
 */
export interface RateTick {
    /**
     * rate is the exchange rate between the subject asset and the payment
     * asset.
     */
    rate: string;
    /**
     * expiry_timestamp is the Unix timestamp in seconds after which the rate
     * tick is no longer valid.
     */
    expiryTimestamp: string;
}

/**
 * AssetSpecifier is a union type for specifying an asset by either its asset ID
 * or group key.
 */
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

/** QueryRateTickResponse is the request to a rate tick query. */
export interface QueryRateTickRequest {
    /**
     * transaction_type indicates whether the transaction is a purchase or a
     * sale.
     */
    transactionType: TransactionType;
    /** subject_asset is the asset to be priced for purchase or sale. */
    subjectAsset: AssetSpecifier | undefined;
    /**
     * subject_asset_max_amount is the maximum amount of the subject asset that
     * could be involved in the transaction.
     */
    subjectAssetMaxAmount: string;
    /**
     * payment_asset is the asset used for purchasing or receiving from a sale.
     *
     * NOTE: An asset ID of all zeros indicates that the payment asset is BTC.
     * In this case, the rate tick will be given as milli-satoshi per asset
     * unit
     */
    paymentAsset: AssetSpecifier | undefined;
    /**
     * rate_tick_hint is an optional suggested rate tick for the transaction,
     * used to provide guidance on expected pricing.
     */
    rateTickHint: RateTick | undefined;
}

/** QueryRateTickSuccessResponse is the successful response to a rate tick query. */
export interface QueryRateTickSuccessResponse {
    /** rate_tick is the rate tick for the transaction. */
    rateTick: RateTick | undefined;
}

/** QueryRateTickErrResponse is the error response to a rate tick query. */
export interface QueryRateTickErrResponse {
    /** error is the error message. */
    message: string;
    /** code is the error code. */
    code: number;
}

/** QueryRateTickResponse is the response to a rate tick query. */
export interface QueryRateTickResponse {
    /** success is the successful response to the rate tick query. */
    success: QueryRateTickSuccessResponse | undefined;
    /** error is the error response to the rate tick query. */
    error: QueryRateTickErrResponse | undefined;
}

export interface PriceOracle {
    /**
     * QueryRateTick queries the rate tick for a given transaction type, subject
     * asset, and payment asset. The rate tick is the exchange rate between the
     * subject asset and the payment asset.
     */
    queryRateTick(
        request?: DeepPartial<QueryRateTickRequest>
    ): Promise<QueryRateTickResponse>;
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
