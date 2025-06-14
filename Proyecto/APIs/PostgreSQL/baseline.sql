-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "event_management";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user_management";

-- CreateTable
CREATE TABLE "event_management"."event_schedules" (
    "schedule_id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "schedule_date" TIMESTAMPTZ(6) NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "description" VARCHAR(255),
    "is_main_event" BOOLEAN DEFAULT false,

    CONSTRAINT "event_schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "event_management"."event_types" (
    "event_type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("event_type_id")
);

-- CreateTable
CREATE TABLE "event_management"."events" (
    "event_id" SERIAL NOT NULL,
    "event_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "short_description" VARCHAR(500),
    "event_type_id" INTEGER,
    "start_datetime" TIMESTAMPTZ(6) NOT NULL,
    "end_datetime" TIMESTAMPTZ(6) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "base_price" DECIMAL(10,2) DEFAULT 0.00,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" VARCHAR(255),

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "event_management"."ticket_reservations" (
    "reservation_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "event_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "reserved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guest_email" VARCHAR(255),
    "guest_name" VARCHAR(100),
    "guest_phone" VARCHAR(20),

    CONSTRAINT "ticket_reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "user_management"."users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "user_management"."users"("email");

-- AddForeignKey
ALTER TABLE "event_management"."event_schedules" ADD CONSTRAINT "event_schedules_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_management"."events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_management"."events" ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_management"."event_types"("event_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_management"."ticket_reservations" ADD CONSTRAINT "ticket_reservations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_management"."events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_management"."ticket_reservations" ADD CONSTRAINT "ticket_reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_management"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

