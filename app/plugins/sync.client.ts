export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) return;

  console.log("[SyncPlugin] Initializing user and syncing data...");

  const { initialize } = useUser();
  const userProfile = await initialize();

  if (!userProfile) {
    console.warn("[SyncPlugin] Failed to initialize user, using local data only");
    return;
  }

  const { setProgress } = useProgress();
  const { setFlags } = useFlags();

  const { syncFromCloud: fetchCloudProgress } = useSyncProgress();
  const { syncFromCloud: fetchCloudFlags } = useSyncFlags();

  const cloudProgress = await fetchCloudProgress();
  if (cloudProgress) {
    setProgress(cloudProgress);
    console.log("[SyncPlugin] Merged cloud progress");
  }

  const cloudFlags = await fetchCloudFlags();
  if (cloudFlags) {
    setFlags(cloudFlags);
    console.log("[SyncPlugin] Merged cloud flags");
  }

  console.log("[SyncPlugin] Sync complete");

  let syncInterval: ReturnType<typeof setInterval> | null = null;

  const startPeriodicSync = () => {
    if (syncInterval) return;

    syncInterval = setInterval(async () => {
      console.log("[SyncPlugin] Periodic sync...");
    }, 5 * 60 * 1000);
  };

  startPeriodicSync();

  nuxtApp.hook("app:mounted", () => {
    startPeriodicSync();
  });
});
