import { ref } from "vue";

const DEVICE_ID_KEY = "canglish-device-id";

interface Profile {
  id: string;
  email: string | null;
  device_id: string;
}

export const useUser = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  const profile = ref<Profile | null>(null);
  const isLoading = ref(false);
  const isSyncing = ref(false);

  const getOrCreateDeviceId = (): string => {
    if (process.client) {
      let deviceId = localStorage.getItem(DEVICE_ID_KEY);
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
      }
      return deviceId;
    }
    return "";
  };

  const getOrCreateProfile = async (): Promise<Profile | null> => {
    const deviceId = getOrCreateDeviceId();

    const { data: existingProfile } = await client
      .from("profiles")
      .select("*")
      .eq("device_id", deviceId)
      .single();

    if (existingProfile) {
      return existingProfile as Profile;
    }

    const { data: newProfile, error } = await client
      .from("profiles")
      .insert({
        device_id: deviceId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create profile:", error);
      return null;
    }

    return newProfile as Profile;
  };

  const initialize = async (): Promise<Profile | null> => {
    if (!process.client) return null;

    isLoading.value = true;
    try {
      profile.value = await getOrCreateProfile();
      return profile.value;
    } catch (e) {
      console.error("Failed to initialize user:", e);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const linkEmail = async (email: string, password: string): Promise<boolean> => {
    if (!process.client) return false;

    try {
      const deviceId = getOrCreateDeviceId();

      const { error: signUpError } = await client.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("Failed to sign up:", signUpError);
        
        if (signUpError.message.includes("already been registered") || signUpError.message.includes("already")) {
          const { error: signInError } = await client.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            console.error("Failed to sign in:", signInError);
            return false;
          }
        } else {
          return false;
        }
      }

      await client
        .from("profiles")
        .update({ email })
        .eq("device_id", deviceId);

      if (profile.value) {
        profile.value.email = email;
      }

      return true;
    } catch (e) {
      console.error("Failed to link email:", e);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    if (!process.client) return;

    await client.auth.signOut();
    profile.value = null;
  };

  const setSyncing = (value: boolean): void => {
    isSyncing.value = value;
  };

  return {
    user,
    profile: readonly(profile),
    isLoading: readonly(isLoading),
    isSyncing: readonly(isSyncing),
    initialize,
    linkEmail,
    signOut,
    setSyncing,
    getOrCreateDeviceId,
  };
};
