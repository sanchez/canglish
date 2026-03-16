export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) return;

  console.log("[SyncPlugin] Initializing user and syncing data...");

  const { initialize } = useUser();
  const userProfile = await initialize();

  if (!userProfile) {
    console.warn("[SyncPlugin] Failed to initialize user, using local data only");
    return;
  }

  const { getEntry, unlock, increment, demote } = useProgress();
  const { isFlagged, flagItem, unflagItem } = useFlags();

  const { sync: syncProgress } = useSyncProgress();
  const { sync: syncFlags } = useSyncFlags();

  const localProgressState = {
    items: {} as Record<string, unknown>,
  };

  const localFlagsState = {
    items: {} as Record<string, unknown>,
  };

  const mergedProgress = await syncProgress(localProgressState);
  const mergedFlags = await syncFlags(localFlagsState);

  console.log("[SyncPlugin] Sync complete");

  let syncInterval: ReturnType<typeof setInterval> | null = null;

  const startPeriodicSync = () => {
    if (syncInterval) return;

    syncInterval = setInterval(async () => {
      const { getEntry: pGetEntry } = useProgress();
      const { isFlagged: fIsFlagged } = useFlags();
      console.log("[SyncPlugin] Periodic sync...");
    }, 5 * 60 * 1000);
  };

  startPeriodicSync();

  nuxtApp.hook("app:mounted", () => {
    startPeriodicSync();
  });
});
