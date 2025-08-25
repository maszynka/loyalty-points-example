import { tryTo } from "./helpers";
import { CustomerId } from "./types";
import { balances } from "./balances-class";

const customerExists = (customerId: CustomerId): boolean => {
  return balances.customerExists(customerId);
};

const loyalty = {
  earn: (customerId: CustomerId, amount: number) => {
    const [result, exceedsSafeIntegerError] = tryTo(() =>
      balances.earnPoints(customerId, amount)
    );
    if (exceedsSafeIntegerError) {
      console.error("Error earning loyalty points:", exceedsSafeIntegerError);
      return;
    }
    return result;
  },
  redeem: (customerId: CustomerId, amount: number) => {
    const [result, error] = tryTo(() =>
      balances.redeemPoints(customerId, amount)
    );
    if (error) {
      console.error("Error redeeming loyalty points:", error);
    }
    return result;
  },
};

// Example usage
console.log("Initial balances:", balances.getSummary());

// Test earning points
loyalty.earn("customer1", 50);
console.log(
  "After earning 50 points for customer1:",
  balances.getBalance("customer1")
);

// Test redeeming points
loyalty.redeem("customer1", 25);
console.log(
  "After redeeming 25 points for customer1:",
  balances.getBalance("customer1")
);

// Export for other modules
export { loyalty, customerExists, balances };
