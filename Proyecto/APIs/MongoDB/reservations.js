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