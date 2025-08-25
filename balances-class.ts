import { CustomerId } from "./types";
import fs from "node:fs";

export class Balances {
  private balancesMemory: Record<CustomerId, number> = {};
  private isInitialized = false;
  private readonly balancesFilePath = "balances.json";
  private readonly mockData: Record<CustomerId, number> = {
    customer1: 100,
    customer2: 200,
    customer3: 300,
  } as const;

  constructor() {
    this.initializeBalances();
  }

  private initializeBalances(): void {
    if (this.isInitialized) return;

    const balancesFromFile = this.readBalancesFromFile();
    if (balancesFromFile) {
      this.balancesMemory = { ...balancesFromFile };
    } else {
      this.balancesMemory = { ...this.mockData };
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

    this.setBalance(customerId, newBalance);
    return newBalance;
  }

  setBalance(customerId: CustomerId, newBalance: number): void {
    this.balancesMemory[customerId] = newBalance;
    this.saveBalancesToFile();
  }

  getSummary(): {
    totalCustomers: number;
    totalBalance: number;
    averageBalance: number;
  } {
    const customers = Object.keys(this.balancesMemory);
    const totalBalance = Object.values(this.balancesMemory).reduce(
      (sum, balance) => sum + balance,
      0
    );

    return {
      totalCustomers: customers.length,
      totalBalance,
      averageBalance:
        customers.length > 0 ? totalBalance / customers.length : 0,
    };
  }
}

// Singleton instance for global use
export const balances = new Balances();
