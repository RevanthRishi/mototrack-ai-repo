import Decimal from 'decimal.js';

/**
 * Calculate total expenses for a period
 * @param expenses - Array of expense amounts
 * @returns Total with 2 decimal precision
 */
export function calculateTotalExpenses(expenses: number[]): Decimal {
  return expenses.reduce(
    (acc, expense) => acc.add(new Decimal(expense)),
    new Decimal(0)
  ).toDecimalPlaces(2);
}

/**
 * Calculate expense breakdown by category
 * @param logs - Array of logs with cost and category
 * @returns Map of category to total cost
 */
export function calculateExpensesByCategory(
  logs: Array<{ cost: number; category: string }>
): Map<string, Decimal> {
  const categoryTotals = new Map<string, Decimal>();

  logs.forEach(log => {
    const current = categoryTotals.get(log.category) || new Decimal(0);
    categoryTotals.set(
      log.category,
      current.add(new Decimal(log.cost)).toDecimalPlaces(2)
    );
  });

  return categoryTotals;
}

/**
 * Calculate cost per kilometer/mile
 * @param totalCost - Total cost spent
 * @param distanceTraveled - Total distance
 * @returns Cost per unit distance with 4 decimal precision
 */
export function calculateCostPerKm(totalCost: number, distanceTraveled: number): Decimal {
  if (distanceTraveled <= 0) {
    return new Decimal(0);
  }

  return new Decimal(totalCost).div(distanceTraveled).toDecimalPlaces(4);
}

/**
 * Calculate monthly average expense
 * @param totalExpense - Total expense amount
 * @param months - Number of months
 * @returns Monthly average with 2 decimal precision
 */
export function calculateMonthlyAverage(totalExpense: number, months: number): Decimal {
  if (months <= 0) {
    return new Decimal(0);
  }

  return new Decimal(totalExpense).div(months).toDecimalPlaces(2);
}

/**
 * Calculate percentage of total
 * @param amount - Specific amount
 * @param total - Total amount
 * @returns Percentage with 2 decimal precision
 */
export function calculatePercentage(amount: number, total: number): Decimal {
  if (total <= 0) {
    return new Decimal(0);
  }

  return new Decimal(amount).div(total).mul(100).toDecimalPlaces(2);
}

/**
 * Calculate projected annual cost based on current spending
 * @param currentCost - Cost so far
 * @param daysPassed - Days passed in period
 * @returns Projected annual cost with 2 decimal precision
 */
export function projectAnnualCost(currentCost: number, daysPassed: number): Decimal {
  if (daysPassed <= 0) {
    return new Decimal(0);
  }

  const dailyAverage = new Decimal(currentCost).div(daysPassed);
  return dailyAverage.mul(365).toDecimalPlaces(2);
}
