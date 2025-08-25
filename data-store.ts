import { CustomerId } from "./types";
import fs from "node:fs";

let balanceDataReceivedFromFileSystem = false;

const mockData: Record<CustomerId, number> = {
  customer1: 100,
  customer2: 200,
  customer3: 300,
} as const;

const balancesMemory: Record<CustomerId, number> = {} as const;

type BalancesMemory = typeof balancesMemory;

const readBalancesFromFile = (): BalancesMemory | null => {
  if (fs.existsSync("balances.json")) {
    const fileData = fs.readFileSync("balances.json", "utf-8");
    const parsedData: BalancesMemory = JSON.parse(fileData);
    return parsedData;
  }
  return null;
};

export const updateCustomerBalance = (
  customerId: CustomerId,
  newBalance: number,
  balancesData: BalancesMemory
) => {
  balancesData[customerId] = newBalance;
  // update json file as well with balance
  fs.writeFileSync("balances.json", JSON.stringify(balancesData, null, 2));
};

const updateInitialMemoryBalances = () => {
  if (balanceDataReceivedFromFileSystem) return;
  const balancesFromFile = readBalancesFromFile();
  if (!balancesFromFile) {
    Object.assign(balancesMemory, mockData);
    return;
  }
  Object.assign(balancesMemory, balancesFromFile);
  balanceDataReceivedFromFileSystem = true;
};

updateInitialMemoryBalances();
