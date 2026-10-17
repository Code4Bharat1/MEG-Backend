import { describe, expect, it } from "vitest";
import { visitor } from "../../src/models/visiter.model.js";

describe("visitor model", () => {
  it("normalizes visitor details and applies account defaults", () => {
    const account = new visitor({
      name: "  Ada Visitor  ",
      email: "ADA@example.com",
      phone: "  1234567890  ",
      password: "test-password",
    });

    expect(account.name).toBe("Ada Visitor");
    expect(account.email).toBe("ada@example.com");
    expect(account.phone).toBe("1234567890");
    expect(account.is_active).toBe(true);
    expect(account.refresh_token).toBeNull();
  });

  it("requires name, email, phone, and password", async () => {
    const account = new visitor({});
    const error = await account.validate().catch((validationError) => validationError);

    for (const field of ["name", "email", "phone", "password"]) {
      expect(error.errors[field]).toBeDefined();
    }
  });

  it("enforces the visitor name length limits", async () => {
    const tooShort = new visitor({
      name: "A",
      email: "ada@example.com",
      phone: "1234567890",
      password: "test-password",
    });
    const tooLong = new visitor({
      name: "A".repeat(31),
      email: "ada@example.com",
      phone: "1234567890",
      password: "test-password",
    });

    const shortNameError = await tooShort.validate().catch((validationError) => validationError);
    const longNameError = await tooLong.validate().catch((validationError) => validationError);

    expect(shortNameError.errors.name).toBeDefined();
    expect(longNameError.errors.name).toBeDefined();
  });

  it("does not select password or refresh token by default", () => {
    expect(visitor.schema.path("password").options.select).toBe(false);
    expect(visitor.schema.path("refresh_token").options.select).toBe(false);
  });
});
