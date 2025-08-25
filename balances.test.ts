import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createBalances, Balances } from "./balances-class";

// Mock console.log to capture notifications
const consoleSpy = vi.spyOn(console, "log");

describe("Balances Class - in-memory mode", () => {
  let balances: Balances;

  beforeEach(() => {
    balances = new Balances(); // Disable file system
    consoleSpy.mockClear();
  });

  it("should initialize with mock data", () => {
    expect(balances.getBalance("customer1")).toBe(100);
    expect(balances.getBalance("customer2")).toBe(200);
    expect(balances.getBalance("customer3")).toBe(300);
  });

  it("should earn points correctly", () => {
    const result = balances.earnPoints("customer1", 50);
    expect(result).toBe(150);
    expect(balances.getBalance("customer1")).toBe(150);
  });

  it("should redeem points correctly", () => {
    const result = balances.redeemPoints("customer1", 25);
    expect(result).toBe(75);
    expect(balances.getBalance("customer1")).toBe(75);
  });

  it("should keep balance after multiple redeem and earn operations correctly", () => {
    // earn
    expect(balances.earnPoints("customer1", 50)).toBe(150);
    expect(balances.getBalance("customer1")).toBe(150);
    // redeed
    expect(balances.redeemPoints("customer1", 25)).toBe(125);
    expect(balances.getBalance("customer1")).toBe(125);
    // earn
    expect(balances.earnPoints("customer1", 1000)).toBe(1125);
    expect(balances.getBalance("customer1")).toBe(1125);
    // redeed
    expect(balances.redeemPoints("customer1", 125)).toBe(1000);
    expect(balances.getBalance("customer1")).toBe(1000);
  });

  it("should show low balance warning when balance drops below 10", () => {
    balances.setBalance("customer1", 15);
    balances.redeemPoints("customer1", 10);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Warning: Customer customer1 has low balance: 5 points."
    );
    expect(balances.getBalance("customer1")).toBe(5);
  });
});
