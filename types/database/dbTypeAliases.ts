import { Tables } from "@/types/database/supabase.types";

export type DbSession = Tables<"sessions">;
export type DbLocation = Tables<"locations">;
export type DbTicket = Tables<"tickets">;
export type DbProfile = Tables<"profiles">;