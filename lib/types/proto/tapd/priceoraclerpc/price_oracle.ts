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

/**
 * AssetRates represents the exchange rates for subject and payment assets
 * relative to BTC, expressed as fixed-point numbers. It includes the rates
 * for both assets and an expiration timestamp indicating when the rates
 * are no longer valid.
 */
export interface AssetRates {
    /**
     * subjectAssetRate is the number of subject asset units per BTC represented
     * as a fixed-point number. This field is also commonly referred to as the
     * subject asset to BTC (conversion) rate. When the subject asset is BTC,
     * this field should be set to 100 billion, as one BTC is equivalent to 100
     * billion msats.
     */
    subjectAssetRate: FixedPoint | undefined;
    /**
     * paymentAssetRate is the number of payment asset units per BTC represented
     * as a fixed-point number. This field is also commonly referred to as the
     * payment asset to BTC (conversion) rate. When the payment asset is BTC,
     * this field should be set to 100 billion, as one BTC is equivalent to 100
     * billion msats.
     */
    paymentAssetRate: FixedPoint | undefined;
    /**
     * expiry_timestamp is the Unix timestamp in seconds after which the asset
     * rates are no longer valid.
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

/**
 * QueryAssetRatesRequest specifies the parameters for querying asset exchange
 * rates in a transaction. It includes the transaction type, details about the
 * subject and payment assets, and an optional hint for expected asset rates.
 */
export interface QueryAssetRatesRequest {
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
     * In this case, the asset rate will be given as milli-satoshi per asset
     * unit
     */
    paymentAsset: AssetSpecifier | undefined;
    /**
     * payment_asset_max_amount is the maximum amount of the payment asset that
     * could be involved in the transaction. This field is optional. If set to
     * zero, it is considered unset.
     */
    paymentAssetMaxAmount: string;
    /**
     * asset_rates_hint is an optional suggestion of asset rates for the
     * transaction, intended to provide guidance on expected pricing.
     */
    assetRatesHint: AssetRates | undefined;
}

/**
 * QueryAssetRatesOkResponse is the successful response to a
 * QueryAssetRates call.
 */
export interface QueryAssetRatesOkResponse {
    /** asset_rates is the asset exchange rates for the transaction. */
    assetRates: AssetRates | undefined;
}

/** QueryAssetRatesErrResponse is the error response to a QueryAssetRates call. */
export interface QueryAssetRatesErrResponse {
    /** error is the error message. */
    message: string;
    /** code is the error code. */
    code: number;
}

/** QueryAssetRatesResponse is the response from a QueryAssetRates RPC call. */
export interface QueryAssetRatesResponse {
    /** ok is the successful response to the query. */
    ok: QueryAssetRatesOkResponse | undefined;
    /** error is the error response to the query. */
    error: QueryAssetRatesErrResponse | undefined;
}

export interface PriceOracle {
    /**
     * QueryAssetRates retrieves the exchange rate between a tap asset and BTC for
     * a specified transaction type, subject asset, and payment asset. The asset
     * rate represents the number of tap asset units per BTC.
     */
    queryAssetRates(
        request?: DeepPartial<QueryAssetRatesRequest>
    ): Promise<QueryAssetRatesResponse>;
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
