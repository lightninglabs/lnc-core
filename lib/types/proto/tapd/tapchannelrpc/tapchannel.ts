/* eslint-disable */
import type { SendPaymentRequest as SendPaymentRequest1 } from '../routerrpc/router';
import type {
    PeerAcceptedSellQuote,
    PeerAcceptedBuyQuote
} from '../rfqrpc/rfq';
import type {
    Payment,
    Invoice,
    AddInvoiceResponse as AddInvoiceResponse2
} from '../lightning';

export interface FundChannelRequest {
    /**
     * The asset amount to fund the channel with. The BTC amount is fixed and
     * cannot be customized (for now).
     */
    assetAmount: string;
    /** The asset ID to use for the channel funding. */
    assetId: Uint8Array | string;
    /**
     * The public key of the peer to open the channel with. Must already be
     * connected to this peer.
     */
    peerPubkey: Uint8Array | string;
    /** The channel funding fee rate in sat/vByte. */
    feeRateSatPerVbyte: number;
    /**
     * The number of satoshis to give the remote side as part of the initial
     * commitment state. This is equivalent to first opening a channel and then
     * sending the remote party funds, but all done in one step. Therefore, this
     * is equivalent to a donation to the remote party, unless they reimburse
     * the funds in another way (outside the protocol).
     */
    pushSat: string;
}

export interface FundChannelResponse {
    /** The channel funding transaction ID. */
    txid: string;
    /** The index of the channel funding output in the funding transaction. */
    outputIndex: number;
}

export interface RouterSendPaymentData {
    /**
     * The string encoded asset ID to amount mapping. Instructs the router to
     * use these assets in the given amounts for the payment. Can be empty for
     * a payment of an invoice, if the RFQ ID is set instead.
     */
    assetAmounts: { [key: string]: string };
    /**
     * The RFQ ID to use for the payment. Can be empty for a direct keysend
     * payment that doesn't involve any conversion (and thus no RFQ).
     */
    rfqId: Uint8Array | string;
}

export interface RouterSendPaymentData_AssetAmountsEntry {
    key: string;
    value: string;
}

export interface EncodeCustomRecordsRequest {
    routerSendPayment: RouterSendPaymentData | undefined;
}

export interface EncodeCustomRecordsResponse {
    /** The encoded custom records in TLV format. */
    customRecords: { [key: string]: Uint8Array | string };
}

export interface EncodeCustomRecordsResponse_CustomRecordsEntry {
    key: string;
    value: Uint8Array | string;
}

export interface SendPaymentRequest {
    /**
     * The asset ID to use for the payment. This must be set for both invoice
     * and keysend payments, unless RFQ negotiation was already done beforehand
     * and payment_request.first_hop_custom_records already contains valid RFQ
     * data.
     */
    assetId: Uint8Array | string;
    /**
     * The asset amount to send in a keysend payment. This amount is ignored for
     * invoice payments as the asset amount is negotiated through RFQ with the
     * peer, depending on the invoice amount. This can also be left unset if RFQ
     * negotiation was already done beforehand and
     * payment_request.first_hop_custom_records already contains valid RFQ data.
     */
    assetAmount: string;
    /**
     * The node identity public key of the peer to ask for a quote for sending
     * out the assets and converting them to satoshis. This must be specified if
     * there are multiple channels with the given asset ID.
     */
    peerPubkey: Uint8Array | string;
    /**
     * The full lnd payment request to send. All fields behave the same way as
     * they do for lnd's routerrpc.SendPaymentV2 RPC method (see the API docs
     * at https://lightning.engineering/api-docs/api/lnd/router/send-payment-v2
     * for more details).
     * To send a keysend payment, the payment_request.dest_custom_records must
     * contain a valid keysend record (key 5482373484 and a 32-byte preimage
     * that corresponds to the payment hash).
     */
    paymentRequest: SendPaymentRequest1 | undefined;
}

export interface SendPaymentResponse {
    /**
     * In case channel assets need to be swapped to another asset, an asset
     * sell order is negotiated with the channel peer. The result will be
     * the first message in the response stream. If no swap is needed, the
     * payment results will be streamed directly.
     */
    acceptedSellOrder: PeerAcceptedSellQuote | undefined;
    /**
     * The payment result of a single payment attempt. Multiple attempts may
     * be returned per payment request until either the payment succeeds or
     * the payment times out.
     */
    paymentResult: Payment | undefined;
}

export interface AddInvoiceRequest {
    /** The asset ID to use for the invoice. */
    assetId: Uint8Array | string;
    /** The asset amount to receive. */
    assetAmount: string;
    /**
     * The node identity public key of the peer to ask for a quote for receiving
     * assets and converting them from satoshis. This must be specified if
     * there are multiple channels with the given asset ID.
     */
    peerPubkey: Uint8Array | string;
    /**
     * The full lnd invoice request to send. All fields (except for the value
     * and the route hints) behave the same way as they do for lnd's
     * lnrpc.AddInvoice RPC method (see the API docs at
     * https://lightning.engineering/api-docs/api/lnd/lightning/add-invoice
     * for more details). The value/value_msat fields will be overwritten by the
     * satoshi (or milli-satoshi) equivalent of the asset amount, after
     * negotiating a quote with a peer that supports the given asset ID.
     */
    invoiceRequest: Invoice | undefined;
}

export interface AddInvoiceResponse {
    /** The quote for the purchase of assets that was accepted by the peer. */
    acceptedBuyQuote: PeerAcceptedBuyQuote | undefined;
    /** The result of the invoice creation. */
    invoiceResult: AddInvoiceResponse2 | undefined;
}

export interface TaprootAssetChannels {
    /**
     * FundChannel initiates the channel funding negotiation with a peer for the
     * creation of a channel that contains a specified amount of a given asset.
     */
    fundChannel(
        request?: DeepPartial<FundChannelRequest>
    ): Promise<FundChannelResponse>;
    /**
     * EncodeCustomRecords allows RPC users to encode Taproot Asset channel related
     * data into the TLV format that is used in the custom records of the lnd
     * payment or other channel related RPCs. This RPC is completely stateless and
     * does not perform any checks on the data provided, other than pure format
     * validation.
     */
    encodeCustomRecords(
        request?: DeepPartial<EncodeCustomRecordsRequest>
    ): Promise<EncodeCustomRecordsResponse>;
    /**
     * SendPayment is a wrapper around lnd's routerrpc.SendPaymentV2 RPC method
     * with asset specific parameters. It allows RPC users to send asset keysend
     * payments (direct payments) or payments to an invoice with a specified asset
     * amount.
     */
    sendPayment(
        request?: DeepPartial<SendPaymentRequest>,
        onMessage?: (msg: SendPaymentResponse) => void,
        onError?: (err: Error) => void
    ): void;
    /**
     * AddInvoice is a wrapper around lnd's lnrpc.AddInvoice method with asset
     * specific parameters. It allows RPC users to create invoices that correspond
     * to the specified asset amount.
     */
    addInvoice(
        request?: DeepPartial<AddInvoiceRequest>
    ): Promise<AddInvoiceResponse>;
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