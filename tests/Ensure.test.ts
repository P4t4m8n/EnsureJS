import { Ensure } from "../src";

const schema = Ensure.object({
  name: Ensure.string().min(3).max(20).alphaNumeric(),
  email: Ensure.string().email(),
  age: Ensure.integer().min(18).max(100),
  url: Ensure.string().url(),
  pie: Ensure.double().min(3.14).max(3.1416),
  nicknames: Ensure.array(Ensure.string().min(3).max(20).alphaNumeric()),
});

describe("Ensure Full Coverage Validation Tests", () => {
  // ✅ Valid Input Test
  it("should validate correct data", () => {
    const validData = {
      name: "User123",
      email: "user@example.com",
      age: 25,
      url: "https://example.com",
      pie: 3.14,
      nicknames: ["Nick1", "Nick2"],
    };
    expect(schema.parse(validData)).toEqual(validData);
  });

  // ❌ Invalid Input Test
  it("should fail validation on incorrect data", () => {
    const invalidData = {
      name: "U",
      email: "not-an-email",
      age: 17,
      url: "not-a-url",
      pie: 3.2,
      nicknames: ["N", "ValidNick"],
    };
    expect(() => schema.parse(invalidData)).toThrow();
  });

  // ❌ Missing Fields
  it("should fail when required fields are missing", () => {
    expect(() => schema.parse({})).toThrow();
  });

  // ❌ Extra Fields
  it("should fail when additional fields are present", () => {
    const extraData = {
      ...schema,
      extra: "should not be here",
    };
    expect(() => schema.parse(extraData)).toThrow();
  });

  // ✅ Edge Cases
  it("should correctly handle edge cases", () => {
    expect(() =>
      schema.parse({
        name: "",
        email: "",
        age: 18,
        url: "",
        pie: 3.14,
        nicknames: [""],
      })
    ).toThrow();
    expect(() =>
      schema.parse({
        name: "Valid",
        email: "valid@email.com",
        age: 100,
        url: "https://valid.com",
        pie: 3.1416,
        nicknames: ["Nick"],
      })
    ).not.toThrow();
  });

  // ❌ Null & Undefined
  it("should fail when given null or undefined", () => {
    expect(() => schema.parse(null)).toThrow();
    expect(() => schema.parse(undefined)).toThrow();
  });

  // ❌ Type Errors
  it("should fail on invalid types", () => {
    expect(() =>
      schema.parse({
        name: 123,
        email: true,
        age: "old",
        url: {},
        pie: "3.14",
        nicknames: null,
      })
    ).toThrow();
  });

  // ✅ Nested Objects
  it("should validate nested objects", () => {
    const nestedSchema = Ensure.object({
      user: Ensure.object({
        name: Ensure.string().min(3),
        age: Ensure.integer().min(18),
      }),
    });

    expect(() =>
      nestedSchema.parse({ user: { name: "Al", age: 17 } })
    ).toThrow();
    expect(nestedSchema.parse({ user: { name: "Alice", age: 25 } })).toEqual({
      user: { name: "Alice", age: 25 },
    });
  });

  // ✅ Arrays with Complex Rules
  it("should validate arrays correctly", () => {
    const arrSchema = Ensure.array(Ensure.integer().min(1).max(10));
    expect(() => arrSchema.parse([0, 5, 11])).toThrow();
    expect(arrSchema.parse([1, 5, 10])).toEqual([1, 5, 10]);
  });

  // ✅ Ensure Correct Error Messages
  it("should return correct error messages", () => {
    try {
      schema.parse({
        name: "U",
        email: "bad",
        age: 10,
        url: "invalid",
        pie: 5,
        nicknames: ["bad"],
      });
    } catch (error: any) {
      expect(error.message).toContain(
        'Field "name": String must be at least 3 characters long'
      );
    }

    try {
      schema.parse({
        name: "Valid",
        email: "bad",
        age: 10,
        url: "invalid",
        pie: 5,
        nicknames: ["bad"],
      });
    } catch (error: any) {
      expect(error.message).toContain('Field "email": Invalid email address');
    }
  });
});
