/* eslint-disable */
export enum SortDirection {
    /** SORT_DIRECTION_DESC - Sort results in descending order. */
    SORT_DIRECTION_DESC = 'SORT_DIRECTION_DESC',
    /** SORT_DIRECTION_ASC - Sort results in ascending order. */
    SORT_DIRECTION_ASC = 'SORT_DIRECTION_ASC',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

/** Represents a Bitcoin transaction outpoint. */
export interface OutPoint {
    /**
     * Raw bytes representing the transaction id. Must be in
     * internal byte order (little-endian), i.e. reversed
     * compared to the human-readable (RPC/block explorer)
     * hex encoding.
     */
    txid: Uint8Array | string;
    /** The index of the output on the transaction. */
    outputIndex: number;
}

/**
 * A transaction outpoint annotated with TAP-level asset metadata. It uniquely
 * identifies an asset anchored at a specific outpoint.
 */
export interface AssetOutPoint {
    /**
     * The outpoint of the asset anchor, represented as a string in the
     * format "<txid>:<vout>". The <txid> is the transaction ID of the UTXO,
     * hex-encoded and byte-reversed (i.e., the internal little-endian
     * 32-byte value is reversed to big-endian hex format) to match standard
     * Bitcoin RPC and UI conventions.
     */
    anchorOutPoint: string;
    /** The asset ID of the asset anchored at the outpoint. */
    assetId: Uint8Array | string;
    /**
     * The script key of the asset. This is the taproot output key that the
     * asset is locked to.
     */
    scriptKey: Uint8Array | string;
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
