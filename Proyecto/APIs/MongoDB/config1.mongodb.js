// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("db_reservation");

db.runCommand({
  collMod: "reservations",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

db.runCommand({
  collMod: "ticket_types",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

db.runCommand({
  collMod: "payments_logs",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});

db.runCommand({
  collMod: "waiting_queues",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
