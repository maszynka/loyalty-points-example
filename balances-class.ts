import { CustomerId } from "./types";
import fs from "node:fs";

const LOW_BALANCE_THRESHOLD = 10;
export class Balances {
  // allow for custom balances file to be passed to the class
  private balancesMemory: Record<CustomerId, number> = {};
  private shouldUseFS = false;
  private isInitialized = false;
  private readonly balancesFilePath: string;
  private readonly mockData: Record<CustomerId, number> = {
    customer1: 100,
    customer2: 200,
    customer3: 300,
  } as const;

  constructor(customFilePath?: string) {
    this.balancesFilePath = customFilePath || "balances.json";
    this.initializeBalances();
  }

  private initializeBalances(): void {
    if (this.isInitialized) return;

    if (this.shouldUseFS) {
      const balancesFromFile = this.readBalancesFromFile();
      if (balancesFromFile) {
        this.balancesMemory = { ...balancesFromFile };
      } else {
        this.balancesMemory = { ...this.mockData };
      }
    }

    this.isInitialized = true;
  }

  private readBalancesFromFile(): Record<CustomerId, number> | null {
    try {
      if (fs.existsSync(this.balancesFilePath)) {
        const fileData = fs.readFileSync(this.balancesFilePath, "utf-8");
        return JSON.parse(fileData);
      }
    } catch (error) {
      console.error("Error reading balances from file:", error);
    }
    return null;
  }

  private saveBalancesToFile(): void {
    try {
      fs.writeFileSync(
        this.balancesFilePath,
        JSON.stringify(this.balancesMemory, null, 2)
      );
    } catch (error) {
      console.error("Error saving balances to file:", error);
    }
  }

  getBalance(customerId: CustomerId): number {
    return this.balancesMemory[customerId] || 0;
  }

  customerExists(customerId: CustomerId): boolean {
    return customerId in this.balancesMemory;
  }

  earnPoints(customerId: CustomerId, amount: number): number {
    const currentBalance = this.getBalance(customerId);
    const newBalance = currentBalance + amount;

    if (!Number.isSafeInteger(newBalance)) {
      throw new Error("Unsafe balance operation: result exceeds safe integer");
    }

    this.setBalance(customerId, newBalance);
    return newBalance;
  }

  redeemPoints(customerId: CustomerId, amount: number): number {
    const currentBalance = this.getBalance(customerId);
    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      throw new Error("Insufficient funds");
    }

    if (newBalance < LOW_BALANCE_THRESHOLD) {
      console.log(
        `Warning: Customer ${customerId} has low balance: ${newBalance} points.`
      );
    }

    this.setBalance(customerId, newBalance);
    return newBalance;
  }

  setBalance(customerId: CustomerId, newBalance: number): void {
    this.balancesMemory[customerId] = newBalance;
    if (this.shouldUseFS) {
      this.saveBalancesToFile();
    }
  }
}
