import { useQuery } from "@tanstack/react-query";
import { ProfileSchema } from "@alitaptap/shared";
import { supabase } from "../lib/supabase";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, karma, created_at")
        .eq("id", userId!)
        .single();
      if (error) throw new Error(error.message);
      return ProfileSchema.parse(data);
    },
  });
}
