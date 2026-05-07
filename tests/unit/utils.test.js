/**
 * UNIT TESTS — src/utils/
 * These test individual utility classes in complete isolation.
 */

import { ApiError } from "../../src/utils/ApiError.js";
import { ApiResponse } from "../../src/utils/ApiResponse.js";
import { asyncHandler } from "../../src/utils/asyncHandler.js";

// ─────────────────────────────────────────────
// ApiError Tests
// ─────────────────────────────────────────────
describe("ApiError", () => {
  test("should create error with statusCode and message", () => {
    const err = new ApiError(404, "Not found");

    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
    expect(err.success).toBe(false);
    expect(err.data).toBeNull();
  });

  test("should default message to 'Something went wrong!'", () => {
    const err = new ApiError(500);
    expect(err.message).toBe("Something went wrong!");
  });

  test("should store errors array", () => {
    const errs = [{ field: "email", msg: "Invalid email" }];
    const err = new ApiError(400, "Validation failed", errs);
    expect(err.errors).toEqual(errs);
  });

  test("should be an instance of Error", () => {
    const err = new ApiError(400, "Bad Request");
    expect(err).toBeInstanceOf(Error);
  });

  test("should capture stack trace", () => {
    const err = new ApiError(500, "Server error");
    expect(err.stack).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// ApiResponse Tests
// ─────────────────────────────────────────────
describe("✅ ApiResponse", () => {
  test("should create response with statusCode, data, message", () => {
    const res = new ApiResponse(200, { id: "123" }, "Success");

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ id: "123" });
    expect(res.message).toBe("Success");
  });

  test("should default message to 'Success'", () => {
    const res = new ApiResponse(200, {});
    expect(res.message).toBe("Success");
  });

  test("should handle null data", () => {
    const res = new ApiResponse(204, null, "No content");
    expect(res.data).toBeNull();
  });
});

// ─────────────────────────────────────────────
// asyncHandler Tests
// ─────────────────────────────────────────────
describe("⚙️ asyncHandler", () => {
  test("should call the handler function", async () => {
    const mockHandler = jest.fn().mockResolvedValue("ok");
    const wrapped = asyncHandler(mockHandler);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);
    expect(mockHandler).toHaveBeenCalledWith(req, res, next);
  });

  test("should call next() with error when handler throws", async () => {
    const error = new ApiError(500, "Async error");
    const mockHandler = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(mockHandler);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});