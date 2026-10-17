import {describe , expect , it } from "vitest";
import { admin } from "../../src/models/login.model.js";

describe("admin model",  () => {
  it("documents an admin" , () => {

    const doc = new admin({
      email : "zaidachhwa8486@gmail.com",
      password : "zaid@13424",
    })

    expect(doc.email).toBe("zaidachhwa8486@gmail.com");
    expect(doc.password).toBe("zaid@13424")
  });

  it("requires the email and password from the admin",  () => {

    const doc = new admin({})

    const error =  doc.validateSync();

    expect(error?.errors?.email).toBeDefined();
    expect(error?.errors?.password).toBeDefined();

  })
})
