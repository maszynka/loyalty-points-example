import { BalancesMemory, CustomerId } from "./types";

export const getBalance = (
  customerId: CustomerId,
  balancesData: BalancesMemory
): number => {
  return balancesData[customerId] || 0;
};

export const addedUpBalance = (
  customerId: CustomerId,
  amount: number,
  balancesData: BalancesMemory
) => {
  const currentBalance = getBalance(customerId, balancesData);
  const newBalance = currentBalance + amount;
  const newSafeBalanceIsSafeForInteger = Number.isSafeInteger(newBalance);

  if (!newSafeBalanceIsSafeForInteger) {
    throw new Error("Unsafe balance operation");
  }
  return newBalance;
};

export const subtractedBalance = (
  customerId: CustomerId,
  amount: number,
  balancesData: BalancesMemory
) => {
  const currentBalance = getBalance(customerId, balancesData);

  const newBalance = currentBalance - amount;
  if (newBalance < 0) {
    throw new Error("Insufficient funds");
  }
  return newBalance;
};
