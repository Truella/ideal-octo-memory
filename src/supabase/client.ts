import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const supabaseClient = {
	init(url: string, key: string) {
		client = createClient(url, key, {
			auth: { persistSession: false },
		});
	},
	get() {
		if (!client) throw new Error("Supabase client not initialized");
		return client;
	},
};
