SET
	statement_timeout = 0;

SET
	lock_timeout = 0;

SET
	idle_in_transaction_session_timeout = 0;

SET
	client_encoding = 'UTF8';

SET
	standard_conforming_strings = ON;

SELECT
	pg_catalog.set_config ('search_path', '', FALSE);

SET
	check_function_bodies = FALSE;

SET
	xmloption = content;

SET
	client_min_messages = warning;

SET
	row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium"
WITH
	SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql"
WITH
	SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt"
WITH
	SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault"
WITH
	SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
WITH
	SCHEMA "extensions";

CREATE TYPE "public"."announcement_platform" AS ENUM('website', 'discord', 'email');

ALTER TYPE "public"."announcement_platform" OWNER TO "postgres";

CREATE TYPE "public"."announcement_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH');

ALTER TYPE "public"."announcement_priority" OWNER TO "postgres";

CREATE TYPE "public"."event_tag" AS ENUM('cle', 'food', 'snacks');

ALTER TYPE "public"."event_tag" OWNER TO "postgres";

CREATE TYPE "public"."event_type" AS ENUM(
	'social',
	'audience_event',
	'workshop',
	'major_event'
);

ALTER TYPE "public"."event_type" OWNER TO "postgres";

CREATE TYPE "public"."member_track" AS ENUM('technical', 'beginner');

ALTER TYPE "public"."member_track" OWNER TO "postgres";

CREATE TYPE "public"."post_category" AS ENUM('event', 'project');

ALTER TYPE "public"."post_category" OWNER TO "postgres";

SET
	default_tablespace = '';

SET
	default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."announcements" (
	"id" "uuid" NOT NULL,
	"created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
	"created_by" "uuid" NOT NULL,
	"content" "text" NOT NULL,
	"priority" "public"."announcement_priority" NOT NULL,
	"platforms" "public"."announcement_platform" [] NOT NULL,
	"discord_message_id" bigint,
	"active_until" TIMESTAMP WITH TIME ZONE
);

ALTER TABLE "public"."announcements" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."attendance" (
	"event_id" "text" NOT NULL,
	"member_id" "uuid" NOT NULL,
	"officer" "text" NOT NULL
);

ALTER TABLE "public"."attendance" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."events_data" (
	"id" character(26) NOT NULL,
	"type" "public"."event_type",
	"is_public" boolean DEFAULT FALSE NOT NULL,
	"tags" "public"."event_tag" [] NOT NULL,
	"main_post" character(16)
);

ALTER TABLE "public"."events_data" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."members" (
	"id" "uuid" DEFAULT "gen_random_uuid" () NOT NULL,
	"first_name" character varying(30) NOT NULL,
	"last_name" character varying(30) NOT NULL,
	"email" character varying(85) NOT NULL,
	"subscribed" boolean DEFAULT TRUE NOT NULL,
	"membership_year" character(7) NOT NULL,
	"signup_date" "date" DEFAULT CURRENT_DATE NOT NULL,
	"track" "public"."member_track" DEFAULT 'technical'::"public"."member_track" NOT NULL,
	"dues_paid_at" "date",
	"met_attendance_requirements" boolean DEFAULT FALSE NOT NULL
);

ALTER TABLE "public"."members" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."officers" (
	"name" "text" NOT NULL,
	"position" "text" NOT NULL,
	"year" character(7) NOT NULL
);

ALTER TABLE "public"."officers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts" (
	"id" character(16) DEFAULT "extensions"."nanoid" (
		16,
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'::"text"
	) NOT NULL,
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" () NOT NULL,
	"published_at" TIMESTAMP WITH TIME ZONE,
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" () NOT NULL,
	"author" character varying(250) NOT NULL,
	"title" character varying(100) NOT NULL,
	"content" "text" NOT NULL,
	"category" "public"."post_category",
	"keywords" "text" [] DEFAULT ARRAY[]::"text" []
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."projects" (
	"id" character(12) DEFAULT "extensions"."nanoid" (
		12,
		'abcdefghijklmnopqrstuvwxyz1234567890'::"text"
	) NOT NULL,
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now" () NOT NULL,
	"title" character varying(30) NOT NULL,
	"subtitle" character varying(90),
	"start" character(6) NOT NULL,
	"stop" character(6),
	"icon_svg_code" "text",
	"color" character(7) NOT NULL,
	"details" "text",
	"members" "jsonb" [] NOT NULL
);

ALTER TABLE "public"."projects" OWNER TO "postgres";

ALTER TABLE ONLY "public"."announcements"
ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."attendance"
ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("event_id", "member_id");

ALTER TABLE ONLY "public"."events_data"
ADD CONSTRAINT "events_to_event_type_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."members"
ADD CONSTRAINT "members_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."members"
ADD CONSTRAINT "members_pkey" PRIMARY KEY ("email", "membership_year");

ALTER TABLE ONLY "public"."posts"
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."projects"
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."announcements"
ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");

CREATE POLICY "Enable all access for authenticated users only" ON "public"."announcements" TO "authenticated"
WITH
	CHECK (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."attendance" FOR INSERT TO "authenticated"
WITH
	CHECK (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."members" FOR INSERT TO "authenticated"
WITH
	CHECK (TRUE);

CREATE POLICY "Enable read access for all" ON "public"."announcements" FOR
SELECT
	USING (TRUE);

CREATE POLICY "Enable select access for all" ON "public"."attendance" FOR
SELECT
	USING (TRUE);

CREATE POLICY "Enable select for authenticated users only" ON "public"."members" FOR
SELECT
	TO "authenticated" USING (TRUE);

CREATE POLICY "Enable update for authenticated users only" ON "public"."members"
FOR UPDATE
	TO "authenticated" USING (TRUE);

ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."attendance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events_data" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."officers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."announcements" TO "anon";

GRANT ALL ON TABLE "public"."announcements" TO "authenticated";

GRANT ALL ON TABLE "public"."announcements" TO "service_role";

GRANT ALL ON TABLE "public"."attendance" TO "anon";

GRANT ALL ON TABLE "public"."attendance" TO "authenticated";

GRANT ALL ON TABLE "public"."attendance" TO "service_role";

GRANT ALL ON TABLE "public"."events_data" TO "anon";

GRANT ALL ON TABLE "public"."events_data" TO "authenticated";

GRANT ALL ON TABLE "public"."events_data" TO "service_role";

GRANT ALL ON TABLE "public"."members" TO "anon";

GRANT ALL ON TABLE "public"."members" TO "authenticated";

GRANT ALL ON TABLE "public"."members" TO "service_role";

GRANT ALL ON TABLE "public"."officers" TO "anon";

GRANT ALL ON TABLE "public"."officers" TO "authenticated";

GRANT ALL ON TABLE "public"."officers" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";

GRANT ALL ON TABLE "public"."posts" TO "authenticated";

GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";

GRANT ALL ON TABLE "public"."projects" TO "authenticated";

GRANT ALL ON TABLE "public"."projects" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--
