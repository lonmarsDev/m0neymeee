DROP TABLE IF EXISTS "loans";
DROP SEQUENCE IF EXISTS loans_id_seq;
CREATE SEQUENCE loans_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."loans" (
    "id" integer DEFAULT nextval('loans_id_seq') NOT NULL,
    "amount_required" double precision,
    "term" smallint,
    "title" character varying,
    "first_name" character varying NOT NULL,
    "last_name" character varying NOT NULL,
    "date_of_birth" date,
    "mobile" character varying,
    "email" character varying,
    "token" character varying,
    "repayment_from" double precision,
    "created_at" timestamp,
    "updated_at" timestamp,
    "deleted_at" timestamp,
    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
) WITH (oids = false);
