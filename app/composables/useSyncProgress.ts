import type { ProgressEntry } from "~/types";

interface ProgressState {
  items: Record<string, ProgressEntry>;
}

interface CloudProgressEntry {
  item_id: string;
  item_type: "word" | "phrase";
  score: number;
  unlocked: boolean;
  mastered: boolean;
  updated_at: string;
}

export const useSyncProgress = () => {
  const client = useSupabaseClient();
  const { profile, user, setSyncing, isSyncing } = useUser();

  const getUserId = (): string | null => {
    if (!process.client) return null;
    return user.value?.id || profile.value?.id || null;
  };

  const syncToCloud = async (state: ProgressState): Promise<boolean> => {
    if (!process.client) return false;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncProgress] No authenticated user, skipping cloud sync");
      return false;
    }

    setSyncing(true);
    try {
      const entries = Object.values(state.items).map((entry) => ({
        user_id: userId,
        item_id: entry.id,
        item_type: entry.type,
        score: entry.score,
        unlocked: entry.unlocked,
        mastered: entry.mastered,
        updated_at: new Date().toISOString(),
      }));

      if (entries.length === 0) {
        return true;
      }

      const { error } = await client
        .from("progress_entries")
        .upsert(entries, {
          onConflict: "user_id,item_id",
        });

      if (error) {
        console.error("[SyncProgress] Failed to sync to cloud:", error);
        return false;
      }

      console.log("[SyncProgress] Synced to cloud:", entries.length, "entries");
      return true;
    } catch (e) {
      console.error("[SyncProgress] Sync error:", e);
      return false;
    } finally {
      setSyncing(false);
    }
  };

  const syncFromCloud = async (): Promise<ProgressState["items"] | null> => {
    if (!process.client) return null;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncProgress] No authenticated user, skipping cloud fetch");
      return null;
    }

    setSyncing(true);
    try {
      const { data, error } = await client
        .from("progress_entries")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("[SyncProgress] Failed to fetch from cloud:", error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log("[SyncProgress] No cloud data found");
        return {};
      }

      const items: Record<string, ProgressEntry> = {};
      for (const entry of data as CloudProgressEntry[]) {
        const key = `${entry.item_type}:${entry.item_id}`;
        items[key] = {
          id: entry.item_id,
          type: entry.item_type,
          score: entry.score,
          unlocked: entry.unlocked,
          mastered: entry.mastered,
        };
      }

      console.log("[SyncProgress] Fetched from cloud:", items.length, "entries");
      return items;
    } catch (e) {
      console.error("[SyncProgress] Fetch error:", e);
      return null;
    } finally {
      setSyncing(false);
    }
  };

  const sync = async (localState: ProgressState): Promise<ProgressState["items"]> => {
    if (!process.client) return localState.items;
    const userId = getUserId();
    if (!userId) {
      console.warn("[SyncProgress] No authenticated user, using local data only");
      return localState.items;
    }

    const cloudItems = await syncFromCloud();

    if (!cloudItems) {
      console.log("[SyncProgress] Cloud fetch failed, using local data");
      await syncToCloud(localState);
      return localState.items;
    }

    const merged: Record<string, ProgressEntry> = { ...localState.items };

    for (const [key, cloudEntry] of Object.entries(cloudItems)) {
      const localEntry = merged[key];

      if (!localEntry) {
        merged[key] = cloudEntry;
      } else {
        const maxScore = Math.max(localEntry.score, cloudEntry.score);
        if (maxScore > localEntry.score) {
          merged[key] = {
            ...localEntry,
            score: maxScore,
            mastered: maxScore >= 6,
          };
        }
      }
    }

    console.log("[SyncProgress] Merged progress:", Object.keys(merged).length, "entries");
    await syncToCloud({ items: merged });

    return merged;
  };

  return {
    syncToCloud,
    syncFromCloud,
    sync,
    isSyncing: readonly(isSyncing),
  };
};
