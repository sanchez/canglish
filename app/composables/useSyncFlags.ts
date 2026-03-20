import type { FlagEntry } from "~/types";

interface FlagsState {
  items: Record<string, FlagEntry>;
}

interface CloudFlagEntry {
  item_id: string;
  item_type: "word" | "phrase";
  reason: string;
  created_at: string;
}

export const useSyncFlags = () => {
  const client = useSupabaseClient();
  const { profile, user, setSyncing } = useUser();

  const getUserId = (): string | null => {
    if (!process.client) return null;
    return user.value?.id || profile.value?.id || null;
  };

  const syncToCloud = async (state: FlagsState): Promise<boolean> => {
    if (!process.client) return false;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncFlags] No authenticated user, skipping cloud sync");
      return false;
    }

    try {
      const entries = Object.values(state.items).map((entry) => ({
        user_id: userId,
        item_id: entry.id,
        item_type: entry.type,
        reason: entry.reason,
        created_at: entry.flaggedAt,
      }));

      if (entries.length === 0) {
        return true;
      }

      const { error } = await client
        .from("flags")
        .upsert(entries, {
          onConflict: "user_id,item_id",
        });

      if (error) {
        console.error("[SyncFlags] Failed to sync to cloud:", error);
        return false;
      }

      console.log("[SyncFlags] Synced to cloud:", entries.length, "flags");
      return true;
    } catch (e) {
      console.error("[SyncFlags] Sync error:", e);
      return false;
    }
  };

  const syncFromCloud = async (): Promise<FlagsState["items"] | null> => {
    if (!process.client) return null;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncFlags] No authenticated user, skipping cloud fetch");
      return null;
    }

    try {
      const { data, error } = await client
        .from("flags")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("[SyncFlags] Failed to fetch from cloud:", error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log("[SyncFlags] No cloud data found");
        return {};
      }

      const items: Record<string, FlagEntry> = {};
      for (const entry of data as CloudFlagEntry[]) {
        const key = `${entry.item_type}:${entry.item_id}`;
        items[key] = {
          id: entry.item_id,
          type: entry.item_type,
          reason: entry.reason,
          flaggedAt: entry.created_at,
        };
      }

      console.log("[SyncFlags] Fetched from cloud:", items.length, "flags");
      return items;
    } catch (e) {
      console.error("[SyncFlags] Fetch error:", e);
      return null;
    }
  };

  const sync = async (localState: FlagsState): Promise<FlagsState["items"]> => {
    if (!process.client) return localState.items;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncFlags] No authenticated user, using local data only");
      return localState.items;
    }

    const cloudItems = await syncFromCloud();

    if (!cloudItems) {
      console.log("[SyncFlags] Cloud fetch failed, using local data");
      await syncToCloud(localState);
      return localState.items;
    }

    const merged: Record<string, FlagEntry> = { ...localState.items };

    for (const [key, cloudEntry] of Object.entries(cloudItems)) {
      if (!merged[key]) {
        merged[key] = cloudEntry;
      }
    }

    console.log("[SyncFlags] Merged flags:", Object.keys(merged).length, "flags");
    await syncToCloud({ items: merged });

    return merged;
  };

  return {
    syncToCloud,
    syncFromCloud,
    sync,
  };
};
