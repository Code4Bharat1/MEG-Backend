import { describe, expect, it } from "vitest";
import { Member } from "../../src/models/member.model.js";

describe("member model", () => {
  it("normalizes member details and applies account defaults", () => {
    const account = new Member({
      name: "  Ada Member  ",
      email: "ADA@example.com",
      phone: "  1234567890  ",
      password: "test-password",
      bni_id: "BNI-123",
      bni_certificate: "certificate.pdf",
    });

    expect(account.name).toBe("Ada Member");
    expect(account.email).toBe("ada@example.com");
    expect(account.phone).toBe("1234567890");
    expect(account.is_active).toBe(true);
    expect(account.refresh_token).toBeNull();
  });

  it("requires all member registration fields", async () => {
    const account = new Member({});
    const error = await account.validate().catch((validationError) => validationError);

    for (const field of ["name", "email", "phone", "password", "bni_id", "bni_certificate"]) {
      expect(error.errors[field]).toBeDefined();
    }
  });

  it("enforces the member name length limits", async () => {
    const tooShort = new Member({
      name: "A",
      email: "ada@example.com",
      phone: "1234567890",
      password: "test-password",
      bni_id: "BNI-123",
      bni_certificate: "certificate.pdf",
    });
    const tooLong = new Member({
      name: "A".repeat(31),
      email: "ada@example.com",
      phone: "1234567890",
      password: "test-password",
      bni_id: "BNI-123",
      bni_certificate: "certificate.pdf",
    });

    const shortNameError = await tooShort.validate().catch((validationError) => validationError);
    const longNameError = await tooLong.validate().catch((validationError) => validationError);

    expect(shortNameError.errors.name).toBeDefined();
    expect(longNameError.errors.name).toBeDefined();
  });

  it("does not select password or refresh token by default", () => {
    expect(Member.schema.path("password").options.select).toBe(false);
    expect(Member.schema.path("refresh_token").options.select).toBe(false);
  });
});
