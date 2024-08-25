ALTER TABLE "public"."announcements"
ADD title VARCHAR(60),
ALTER COLUMN id
SET DEFAULT "gen_random_uuid" (),
ALTER COLUMN created_at
SET DEFAULT "now" (),
ALTER COLUMN active_until
SET NOT NULL;
