import { describe, expect, it } from "vitest";
import { admin } from "../../src/models/login.model.js";

describe("admin model", () => {
  it("normalizes email and applies account defaults", () => {
    const account = new admin({
      email: "ADMIN@example.com",
      password: "test-password",
    });

    expect(account.email).toBe("admin@example.com");
    expect(account.is_active).toBe(true);
    expect(account.refresh_token).toBeNull();
  });

  it("requires email and password", async () => {
    const account = new admin({});
    const error = await account.validate().catch((validationError) => validationError);

    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it("does not select password or refresh token by default", () => {
    expect(admin.schema.path("password").options.select).toBe(false);
    expect(admin.schema.path("refresh_token").options.select).toBe(false);
  });
});
