use('db_reservation')

db.createCollection("reservations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["event_id", "user_id", "guest_email", "tickets", "status", "total_amount", "currency"],
      properties: {
        event_id: { bsonType: "string" },
        user_id: { bsonType: "string" },
        guest_email: { bsonType: "string" },
        tickets: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["ticket_type_id", "quantity", "unit_price", "subtotal"],
            properties: {
              ticket_type_id: { bsonType: "string" },
              quantity: { bsonType: "int" },
              unit_price: { bsonType: "decimal" },
              subtotal: { bsonType: "decimal" }
            }
          }
        },
        status: { enum: ["pending", "confirmed", "cancelled", "expired"] },
        payment_method: { bsonType: "string" },
        payment_reference: { bsonType: "string" },
        total_amount: { bsonType: "decimal" },
        currency: { bsonType: "string" },
        taxes: { bsonType: "array" },
        discount_code: { bsonType: "string" },
        queue_position: { bsonType: "int" },
        expires_at: { bsonType: "date" },
        cancellation_reason: { bsonType: "string" },
        is_deleted: { bsonType: "bool", default: false },
        created_at: { bsonType: "timestamp" },
        updated_at: { bsonType: "timestamp" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.reservations.createIndex({ event_id: 1, user_id: 1 });
db.reservations.createIndex({ expires_at: 1 });


db.createCollection("ticket_types", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["event_id", "name", "price", "max_quantity"],
      properties: {
        event_id: { bsonType: "string" },
        name: { bsonType: "string" },
        price: { bsonType: "decimal" },
        max_quantity: { bsonType: "int" },
        current_stock: { bsonType: "int" },
        is_active: { bsonType: "bool" },
        sales_start_at: { bsonType: "date" },
        sales_end_at: { bsonType: "date" },
        metadata: { bsonType: "object" },
        is_deleted: { bsonType: "bool"},
        created_at: { bsonType: "timestamp" },
        updated_at: { bsonType: "timestamp" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.ticket_types.createIndex({ event_id: 1, is_active: 1 });

db.createCollection("payments_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["reservation_id", "status", "amount"],
      properties: {
        reservation_id: { bsonType: "string" },
        status: { enum: ["pending", "approved", "failed", "refunded"] },
        amount: { bsonType: "decimal" },
        gateway_response: { bsonType: "object" },
        registered_at: { bsonType: "timestamp" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "timestamp" },
        updated_at: { bsonType: "timestamp" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.payments_logs.createIndex({ reservation_id: 1, status: 1 });


db.createCollection("waiting_queues", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["event_id", "user_id", "position"],
      properties: {
        event_id: { bsonType: "string" },
        user_id: { bsonType: "string" },
        position: { bsonType: "int" },
        joined_at: { bsonType: "date" },
        notified: { bsonType: "bool" },
        is_deleted: { bsonType: "bool" },
        created_at: { bsonType: "timestamp" },
        updated_at: { bsonType: "timestamp" },
        updated_by: { bsonType: "string" }
      }
    }
  }
});
db.waiting_queues.createIndex({ event_id: 1, position: 1 });