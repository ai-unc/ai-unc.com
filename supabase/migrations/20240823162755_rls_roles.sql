CREATE TYPE "public"."user_permission" AS enum('announcements', 'events_data');

-- USER ROLES
CREATE TABLE public.user_permissions (
	user_id UUID REFERENCES "auth"."users" ON DELETE cascade NOT NULL PRIMARY KEY,
	permissions "public"."user_permission" [] NOT NULL
);

ALTER TABLE public.user_permissions enable ROW level security;

CREATE POLICY "Allow individual read access" ON public.user_permissions FOR
SELECT
	USING (auth.uid () = user_id);

-- Create the auth hook function
CREATE
OR REPLACE function public.custom_access_token_hook (event jsonb) returns jsonb language plpgsql stable AS $$
  declare
    claims jsonb;
    user_permissions public.user_permission [];
  begin
    select permissions into user_permissions from public.user_permissions where user_id = (event->>'user_id')::uuid;
    claims := event->'claims';
    claims := jsonb_set(claims, '{user_permissions}', to_jsonb(user_permissions));
    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;
$$;

GRANT usage ON schema public TO supabase_auth_admin;

GRANT
EXECUTE ON function public.custom_access_token_hook TO supabase_auth_admin;

REVOKE
EXECUTE ON function public.custom_access_token_hook
FROM
	authenticated,
	anon,
	public;

GRANT ALL ON TABLE public.user_permissions TO supabase_auth_admin;

REVOKE ALL ON TABLE public.user_permissions
FROM
	authenticated,
	anon,
	public;

CREATE POLICY "Allow auth admin to read user roles" ON public.user_permissions AS permissive FOR
SELECT
	TO supabase_auth_admin USING (TRUE);

CREATE
OR REPLACE function public.authorize (requested_permission public.user_permission) returns boolean AS $$
    declare
    has_permission boolean;
    begin
    select requested_permission = any(replace(replace(replace((auth.jwt() ->> 'user_permissions'), '[', '{'), ']', '}'), '"', '')::public.user_permission[]) into has_permission;
    return has_permission;
    end;
    $$ language plpgsql stable security definer
SET
	search_path = '';

DROP POLICY "Enable read access for all" ON "public"."announcements";

DROP POLICY "Enable all access for authenticated users only" ON "public"."announcements";

CREATE POLICY "Enable all access for authorized users only" ON "public"."announcements" TO "authenticated" USING (
	(
		SELECT
			authorize ('announcements')
	)
);

DROP POLICY "Enable insert for authenticated users only" ON "public"."members";

DROP POLICY "Enable update for authenticated users only" ON "public"."members";

CREATE POLICY "Enable select for authenticated users only" ON "public"."officers" FOR
SELECT
	TO "authenticated" USING (TRUE);

ALTER TABLE "public"."attendance"
DROP COLUMN "officer",
ADD COLUMN "checked_in_by" "uuid" NOT NULL,
ADD CONSTRAINT "attendance_checked_in_by_fkey" FOREIGN KEY ("checked_in_by") REFERENCES "auth"."users" ("id");

CREATE POLICY "Enable all access for authorized users only" ON "public"."events_data" TO "authenticated" USING (
	(
		SELECT
			authorize ('announcements')
	)
);
