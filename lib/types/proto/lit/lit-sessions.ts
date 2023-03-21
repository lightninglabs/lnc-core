/* eslint-disable */
export enum SessionType {
    TYPE_MACAROON_READONLY = 'TYPE_MACAROON_READONLY',
    TYPE_MACAROON_ADMIN = 'TYPE_MACAROON_ADMIN',
    TYPE_MACAROON_CUSTOM = 'TYPE_MACAROON_CUSTOM',
    TYPE_UI_PASSWORD = 'TYPE_UI_PASSWORD',
    TYPE_AUTOPILOT = 'TYPE_AUTOPILOT',
    TYPE_MACAROON_ACCOUNT = 'TYPE_MACAROON_ACCOUNT',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

export enum SessionState {
    STATE_CREATED = 'STATE_CREATED',
    STATE_IN_USE = 'STATE_IN_USE',
    STATE_REVOKED = 'STATE_REVOKED',
    STATE_EXPIRED = 'STATE_EXPIRED',
    UNRECOGNIZED = 'UNRECOGNIZED'
}

export interface AddSessionRequest {
    label: string;
    sessionType: SessionType;
    expiryTimestampSeconds: string;
    mailboxServerAddr: string;
    devServer: boolean;
    macaroonCustomPermissions: MacaroonPermission[];
    accountId: string;
}

export interface MacaroonPermission {
    /**
     * The entity a permission grants access to. If a entity is set to the
     * "uri" keyword then the action entry should be one of the special cases
     * described in the comment for action.
     */
    entity: string;
    /**
     * The action that is granted. If entity is set to "uri", then action must
     * be set to either:
     *  - a particular URI to which access should be granted.
     *  - a URI regex, in which case access will be granted to each URI that
     *    matches the regex.
     *  - the "***readonly***" keyword. This will result in the access being
     *    granted to all read-only endpoints.
     */
    action: string;
}

export interface AddSessionResponse {
    session: Session | undefined;
}

export interface Session {
    id: Uint8Array | string;
    label: string;
    sessionState: SessionState;
    sessionType: SessionType;
    expiryTimestampSeconds: string;
    mailboxServerAddr: string;
    devServer: boolean;
    pairingSecret: Uint8Array | string;
    pairingSecretMnemonic: string;
    localPublicKey: Uint8Array | string;
    remotePublicKey: Uint8Array | string;
    createdAt: string;
    macaroonRecipe: MacaroonRecipe | undefined;
    accountId: string;
    autopilotFeatureInfo: { [key: string]: RulesMap };
    /**
     * The unix timestamp indicating the time at which the session was revoked.
     * Note that this field has not been around since the beginning and so it
     * could be the case that a session has been revoked but that this field
     * will not have been set for that session. Therefore, it is suggested that
     * readers should not assume that if this field is zero that the session is
     * not revoked. Readers should instead first check the session_state field.
     */
    revokedAt: string;
}

export interface Session_AutopilotFeatureInfoEntry {
    key: string;
    value: RulesMap | undefined;
}

export interface MacaroonRecipe {
    permissions: MacaroonPermission[];
    caveats: string[];
}

export interface ListSessionsRequest {}

export interface ListSessionsResponse {
    sessions: Session[];
}

export interface RevokeSessionRequest {
    localPublicKey: Uint8Array | string;
}

export interface RevokeSessionResponse {}

export interface RulesMap {
    /**
     * A map of rule name to RuleValue. The RuleValue should be parsed based on
     * the name of the rule.
     */
    rules: { [key: string]: RuleValue };
}

export interface RulesMap_RulesEntry {
    key: string;
    value: RuleValue | undefined;
}

export interface RuleValue {
    rateLimit: RateLimit | undefined;
    chanPolicyBounds: ChannelPolicyBounds | undefined;
    historyLimit: HistoryLimit | undefined;
    offChainBudget: OffChainBudget | undefined;
    onChainBudget: OnChainBudget | undefined;
    sendToSelf: SendToSelf | undefined;
    channelRestrict: ChannelRestrict | undefined;
    peerRestrict: PeerRestrict | undefined;
}

export interface RateLimit {
    /** The rate limit for read-only calls. */
    readLimit: Rate | undefined;
    /** The rate limit for write/execution calls. */
    writeLimit: Rate | undefined;
}

export interface Rate {
    /** The number of times a call is allowed in num_hours number of hours. */
    iterations: number;
    /** The number of hours in which the iterations count takes place over. */
    numHours: number;
}

export interface HistoryLimit {
    /**
     * The absolute unix timestamp in seconds before which no information should
     * be shared. This should only be set if duration is not set.
     */
    startTime: string;
    /**
     * The maximum relative duration in seconds that a request is allowed to query
     * for. This should only be set if start_time is not set.
     */
    duration: string;
}

export interface ChannelPolicyBounds {
    /** The minimum base fee in msat that the autopilot can set for a channel. */
    minBaseMsat: string;
    /** The maximum base fee in msat that the autopilot can set for a channel. */
    maxBaseMsat: string;
    /** The minimum ppm fee in msat that the autopilot can set for a channel. */
    minRatePpm: number;
    /** The maximum ppm fee in msat that the autopilot can set for a channel. */
    maxRatePpm: number;
    /** The minimum cltv delta that the autopilot may set for a channel. */
    minCltvDelta: number;
    /** The maximum cltv delta that the autopilot may set for a channel. */
    maxCltvDelta: number;
    /** The minimum htlc msat that the autopilot may set for a channel. */
    minHtlcMsat: string;
    /** The maximum htlc msat that the autopilot may set for a channel. */
    maxHtlcMsat: string;
}

export interface OffChainBudget {
    maxAmtMsat: string;
    maxFeesMsat: string;
}

export interface OnChainBudget {
    absoluteAmtSats: string;
    maxSatPerVByte: string;
}

export interface SendToSelf {}

export interface ChannelRestrict {
    channelIds: string[];
}

export interface PeerRestrict {
    peerIds: string[];
}

/**
 * Sessions is a service that gives access to the core functionalities of the
 * daemon's session system.
 */
export interface Sessions {
    addSession(
        request?: DeepPartial<AddSessionRequest>
    ): Promise<AddSessionResponse>;
    listSessions(
        request?: DeepPartial<ListSessionsRequest>
    ): Promise<ListSessionsResponse>;
    revokeSession(
        request?: DeepPartial<RevokeSessionRequest>
    ): Promise<RevokeSessionResponse>;
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
