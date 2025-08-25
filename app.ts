import { Command } from "commander";
import { tryTo } from "./helpers";
import { CustomerId } from "./types";
import { Balances } from "./balances-class";

const balances = new Balances();

const customerExists = (customerId: CustomerId): boolean => {
  return balances.customerExists(customerId);
};

const loyalty = {
  earn: (customerId: CustomerId, amount: number) => {
    const [result, exceedsSafeIntegerError] = tryTo(() =>
      balances.earnPoints(customerId, amount)
    );
    if (exceedsSafeIntegerError) {
      console.error(
        "Error earning loyalty points:",
        exceedsSafeIntegerError.message
      );
      return null;
    }
    console.log(
      `Successfully added ${amount} points to ${customerId}. New balance: ${result}`
    );
    return result;
  },
  redeem: (customerId: CustomerId, amount: number) => {
    const [result, error] = tryTo(() =>
      balances.redeemPoints(customerId, amount)
    );
    if (error) {
      console.error("Error redeeming loyalty points:", error.message);
      return null;
    }
    console.log(
      `Successfully redeemed ${amount} points from ${customerId}. New balance: ${result}`
    );
    return result;
  },
};

// CLI Interface using Commander
const program = new Command();

program
  .name("loyalty-app")
  .description("Customer Loyalty Points Management System")
  .version("1.0.0");

program
  .command("earn <customerId> <points>")
  .description("Add loyalty points to a customer")
  .action((customerId: string, pointsStr: string) => {
    const points = parseInt(pointsStr);

    if (isNaN(points) || points <= 0) {
      console.error("Points must be a positive number");
      process.exit(1);
    }

    loyalty.earn(customerId, points);
  });

program
  .command("redeem <customerId> <points>")
  .description("Redeem loyalty points from a customer")
  .action((customerId: string, pointsStr: string) => {
    const points = parseInt(pointsStr);

    if (isNaN(points) || points <= 0) {
      console.error("Points must be a positive number");
      process.exit(1);
    }

    loyalty.redeem(customerId, points);
  });

// Run CLI if this file is executed directly
if (require.main === module) {
  program.parse(process.argv);
}

// Export for other modules
export { loyalty, customerExists, balances };
