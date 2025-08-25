import fs from "node:fs";
import { tryTo } from "./helpers";
import { CustomerId } from "./types";
import { addedUpBalance, subtractedBalance } from "./balance";
import { updateCustomerBalance } from "./data-store";

const customerExists = (
  customerId: CustomerId,
  balancesData: BalancesMemory
): boolean => {
  return customerId in balancesData;
};

const loyalty = {
  earn: (
    customerId: CustomerId,
    amount: number,
    balancesMemory: BalancesMemory
  ) => {
    const [result, exceedsSafeIntegerError] = tryTo(() =>
      addedUpBalance(customerId, amount, balancesMemory)
    );
    if (exceedsSafeIntegerError) {
      console.error("Error earning loyalty points:", exceedsSafeIntegerError);
      return;
    }
    updateCustomerBalance(customerId, result, balancesMemory);
    return result;
  },
  redeem: (
    customerId: CustomerId,
    amount: number,
    balancesMemory: BalancesMemory
  ) => {
    const [result, error] = tryTo(() =>
      subtractedBalance(customerId, amount, balancesMemory)
    );
    if (error) {
      console.error("Error redeeming loyalty points:", error);
    }
    return result;
  },
};
