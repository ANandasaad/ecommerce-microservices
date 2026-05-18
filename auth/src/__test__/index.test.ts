/**
 * Tests for auth/src/index.ts
 *
 * Covers the `console.log("Starting app...")` addition and the startup
 * sequence of the start() function.
 */

describe("start() bootstrap function", () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.resetModules();
  });

  it('logs "Starting app..." as the first action before env-var checks', async () => {
    jest.isolateModules(() => {
      // Remove JWT_KEY to force an early throw after the console.log
      const originalJwtKey = process.env.JWT_KEY;
      delete process.env.JWT_KEY;

      try {
        require("../index");
      } catch {
        // The module calls start() synchronously at the bottom, but start() is async.
        // The promise rejection will be handled separately.
      }

      // Restore so other tests are not affected
      process.env.JWT_KEY = originalJwtKey;
    });

    // Allow the async start() to begin executing
    await new Promise((resolve) => setImmediate(resolve));

    expect(consoleSpy).toHaveBeenCalledWith("Starting app...");
  });

  it('logs "Starting app..." before throwing when JWT_KEY is missing', async () => {
    let startError: Error | undefined;

    await jest.isolateModulesAsync(async () => {
      const originalJwtKey = process.env.JWT_KEY;
      const originalMongoUri = process.env.MONGO_URI;
      delete process.env.JWT_KEY;
      delete process.env.MONGO_URI;

      // Mock mongoose so connect does not hang
      jest.mock("mongoose", () => ({
        connect: jest.fn().mockResolvedValue(undefined),
      }));

      // Mock app so listen does not open a real port
      jest.mock("../app", () => ({
        app: { listen: jest.fn() },
      }));

      try {
        require("../index");
        // Give the async start() function a chance to run
        await new Promise((resolve) => setImmediate(resolve));
        await new Promise((resolve) => setTimeout(resolve, 20));
      } catch (err: any) {
        startError = err;
      } finally {
        process.env.JWT_KEY = originalJwtKey;
        if (originalMongoUri) process.env.MONGO_URI = originalMongoUri;
      }
    });

    // "Starting app..." must appear in the log regardless of the missing key
    const calls = consoleSpy.mock.calls.map((c) => c[0]);
    expect(calls).toContain("Starting app...");
  });

  it('logs "Starting app..." before any other console output', async () => {
    await jest.isolateModulesAsync(async () => {
      const originalJwtKey = process.env.JWT_KEY;
      delete process.env.JWT_KEY;

      jest.mock("mongoose", () => ({
        connect: jest.fn().mockResolvedValue(undefined),
      }));
      jest.mock("../app", () => ({
        app: { listen: jest.fn() },
      }));

      try {
        require("../index");
        await new Promise((resolve) => setImmediate(resolve));
        await new Promise((resolve) => setTimeout(resolve, 20));
      } catch {
        // expected
      } finally {
        process.env.JWT_KEY = originalJwtKey;
      }
    });

    const allCalls = consoleSpy.mock.calls;
    if (allCalls.length > 0) {
      expect(allCalls[0][0]).toBe("Starting app...");
    }
  });
});