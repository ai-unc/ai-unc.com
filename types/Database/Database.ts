import type { Database as SupabaseDatabase } from "./supabase";

declare global {
	namespace Database {
		export type Database = SupabaseDatabase;

		export type Officer = Database["public"]["Tables"]["officers"]["Row"];

		export type Member = Database["public"]["Tables"]["members"]["Row"];
		export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];

		export type EventData = Database["public"]["Tables"]["events_data"]["Row"];

		export type Project = Database["public"]["Tables"]["projects"]["Row"];
		export type ProjectMember = {
			name: string;
			role: string;
			former?: true;
		};

		export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

		namespace Enums {
			export type Platform = Database["public"]["Enums"]["announcement_platform"];
			export type Priority = Database["public"]["Enums"]["announcement_priority"];
			export type EventType = Database["public"]["Enums"]["event_type"];
			export type EventTag = Database["public"]["Enums"]["event_tag"];
		}
	}
}
