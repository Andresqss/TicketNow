// ================================
// Inicialización de base de datos de notificaciones en MongoDB
// ================================

// ------------------
// 1. notification_templates
// ------------------
use('db_notification')
db.createCollection("notification_templates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "channels", "subject", "content", "variables"],
      properties: {
        name: { bsonType: "string" },
        type: { enum: ["reservation", "promotion", "system", "custom"] },
        channels: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        subject: { bsonType: "string" },
        content: { bsonType: "string" },
        variables: { bsonType: "string" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.notification_templates.createIndex({ type: 1 });
db.notification_templates.insertOne({
  name: "Reserva Confirmada",
  type: "reservation",
  channels: ["email"],
  subject: "Confirmación de tu reserva",
  content: "Hola {{name}}, tu reserva ha sido confirmada.",
  variables: "{{name}}, {{event}}, {{date}}",
  is_deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
  updated_by: "system"
});

// ------------------
// 2. notifications
// ------------------
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["event_id", "user_id", "guest_email", "reservation_id", "channel", "subject", "content", "status"],
      properties: {
        event_id: { bsonType: "string" },
        user_id: { bsonType: "string" },
        guest_email: { bsonType: "string" },
        reservation_id: { bsonType: "string" },
        channel: { bsonType: "string" },
        subject: { bsonType: "string" },
        content: { bsonType: "string" },
        status: { enum: ["pending", "sent", "failed"] },
        metadata: { bsonType: "object" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        sent_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.notifications.createIndex({ user_id: 1, event_id: 1 });
db.notifications.createIndex({ status: 1 });
db.notifications.insertOne({
  event_id: "EVT001",
  user_id: "USR001",
  guest_email: "usuario@example.com",
  reservation_id: "RES001",
  channel: "email",
  subject: "Confirmación de tu reserva",
  content: "Hola Juan, tu reserva ha sido confirmada.",
  status: "sent",
  metadata: {},
  is_deleted: false,
  created_at: new Date(),
  sent_at: new Date(),
  updated_at: new Date(),
  updated_by: "system"
});

// ------------------
// 3. notification_logs
// ------------------
db.createCollection("notification_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["notification_id", "action", "provider", "timestamp"],
      properties: {
        notification_id: { bsonType: "string" },
        action: { bsonType: "string" },
        provider: { bsonType: "string" },
        error_message: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.notification_logs.createIndex({ notification_id: 1 });
db.notification_logs.insertOne({
  notification_id: "NOTF001",
  action: "send",
  provider: "SendGrid",
  error_message: "",
  timestamp: new Date(),
  is_deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
  updated_by: "system"
});

// ------------------
// 4. user_notification_preferences
// ------------------
db.createCollection("user_notification_preferences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id"],
      properties: {
        user_id: { bsonType: "string" },
        email_enabled: { bsonType: "bool" },
        sms_enabled: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        push_enabled: { bsonType: "bool" },
        categories: { bsonType: "string" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.user_notification_preferences.createIndex({ user_id: 1 });
db.user_notification_preferences.insertOne({
  user_id: "USR001",
  email_enabled: true,
  sms_enabled: ["promotions", "reminders"],
  push_enabled: false,
  categories: "reservation",
  is_deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
  updated_by: "admin"
});