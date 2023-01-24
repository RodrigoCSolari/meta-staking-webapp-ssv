import { HOURS } from "../constants";
import { queryChain } from "../lib/near";
import { BlockInfo, EpochInfo } from "./getEpochInfo.types";

export async function getEpochInfo(): Promise<{
  endOfEpochCached: Date;
  epochDurationMs: number;
}> {
  let endOfEpochCached = new Date();
  let epochDurationMs = 12 * HOURS;
  if (new Date() >= endOfEpochCached) {
    try {
      const epochCached = await computeCurrentEpoch();
      endOfEpochCached = new Date(epochCached.ends_dtm);
      epochDurationMs = epochCached.duration_ms;
    } catch (ex) {
      console.error(ex);
      return {
        endOfEpochCached: new Date(new Date().getTime() - 12 * HOURS),
        epochDurationMs,
      };
    }
  }
  return { endOfEpochCached, epochDurationMs };
}

export async function computeCurrentEpoch(): Promise<EpochInfo> {
  const lastBlock = await getLastBlock();
  const firstBlock = await getBlock(lastBlock.header.next_epoch_id); //next_epoch_id looks like "current" epoch_id
  const prevBlock = await getBlock(lastBlock.header.epoch_id); //epoch_id looks like "prev" epoch_id

  const epoch = new EpochInfo(prevBlock, firstBlock, lastBlock);

  return epoch;
}

async function getLastBlock(): Promise<BlockInfo> {
  return queryChain("block", { finality: "optimistic" });
}
async function getBlock(blockId: string): Promise<BlockInfo> {
  return queryChain("block", { block_id: blockId });
}
