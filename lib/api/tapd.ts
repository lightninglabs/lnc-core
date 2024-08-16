import { serviceNames as sn } from '../types/proto/schema';
import { AssetWallet } from '../types/proto/tapd/assetwalletrpc/assetwallet';
import { Mint } from '../types/proto/tapd/mintrpc/mint';
import { PriceOracle } from '../types/proto/tapd/priceoraclerpc/price_oracle';
import { Rfq } from '../types/proto/tapd/rfqrpc/rfq';
import { TaprootAssetChannels } from '../types/proto/tapd/tapchannelrpc/tapchannel';
import { TapDev } from '../types/proto/tapd/tapdevrpc/tapdev';
import { TaprootAssets } from '../types/proto/tapd/taprootassets';
import { Universe } from '../types/proto/tapd/universerpc/universe';

/**
 * An API wrapper to communicate with the Taproot Assets node via GRPC
 */
class TaprootAssetsApi {
    taprootAssets: TaprootAssets;
    assetWallet: AssetWallet;
    mint: Mint;
    priceOracle: PriceOracle;
    rfq: Rfq;
    tapChannels: TaprootAssetChannels;
    tapDev: TapDev;
    universe: Universe;

    constructor(createRpc: Function, lnc: any) {
        this.taprootAssets = createRpc(sn.taprpc.TaprootAssets, lnc);
        this.assetWallet = createRpc(sn.assetwalletrpc.AssetWallet, lnc);
        this.mint = createRpc(sn.mintrpc.Mint, lnc);
        this.priceOracle = createRpc(sn.priceoraclerpc.PriceOracle, lnc);
        this.rfq = createRpc(sn.rfqrpc.Rfq, lnc);
        this.tapChannels = createRpc(
            sn.tapchannelrpc.TaprootAssetChannels,
            lnc
        );
        this.tapDev = createRpc(sn.tapdevrpc.TapDev, lnc);
        this.universe = createRpc(sn.universerpc.Universe, lnc);
    }
}

export default TaprootAssetsApi;
