import Decimal from 'decimal.js';

/**
 * Calculate fuel mileage (km/l or MPG)
 * @param distanceTraveled - Distance in km or miles
 * @param fuelConsumed - Fuel consumed in liters or gallons
 * @returns Mileage value with 2 decimal precision
 */
export function calculateMileage(distanceTraveled: number, fuelConsumed: number): Decimal {
  if (fuelConsumed <= 0) {
    throw new Error('Fuel consumed must be greater than 0');
  }

  const distance = new Decimal(distanceTraveled);
  const fuel = new Decimal(fuelConsumed);

  return distance.div(fuel).toDecimalPlaces(2);
}

/**
 * Calculate price per unit of fuel
 * @param totalCost - Total cost paid
 * @param quantity - Quantity of fuel
 * @returns Price per unit with 2 decimal precision
 */
export function calculatePricePerUnit(totalCost: number, quantity: number): Decimal {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const cost = new Decimal(totalCost);
  const qty = new Decimal(quantity);

  return cost.div(qty).toDecimalPlaces(2);
}

/**
 * Calculate cost per distance (cost per km or cost per mile)
 * @param fuelCost - Cost of fuel
 * @param distanceTraveled - Distance traveled
 * @returns Cost per unit distance with 4 decimal precision
 */
export function calculateCostPerDistance(fuelCost: number, distanceTraveled: number): Decimal {
  if (distanceTraveled <= 0) {
    throw new Error('Distance must be greater than 0');
  }

  const cost = new Decimal(fuelCost);
  const distance = new Decimal(distanceTraveled);

  return cost.div(distance).toDecimalPlaces(4);
}

/**
 * Calculate average mileage from multiple fuel logs
 * @param mileageValues - Array of mileage values
 * @returns Average mileage with 2 decimal precision
 */
export function calculateAverageMileage(mileageValues: number[]): Decimal {
  if (mileageValues.length === 0) {
    return new Decimal(0);
  }

  const validValues = mileageValues.filter(val => val > 0);

  if (validValues.length === 0) {
    return new Decimal(0);
  }

  const sum = validValues.reduce(
    (acc, val) => acc.add(new Decimal(val)),
    new Decimal(0)
  );

  return sum.div(validValues.length).toDecimalPlaces(2);
}

/**
 * Calculate total fuel cost for a period
 * @param fuelLogs - Array of fuel costs
 * @returns Total cost with 2 decimal precision
 */
export function calculateTotalFuelCost(fuelLogs: { cost: number }[]): Decimal {
  return fuelLogs.reduce(
    (acc, log) => acc.add(new Decimal(log.cost)),
    new Decimal(0)
  ).toDecimalPlaces(2);
}

/**
 * Convert km to miles
 * @param km - Distance in kilometers
 * @returns Distance in miles with 2 decimal precision
 */
export function kmToMiles(km: number): Decimal {
  return new Decimal(km).mul(0.621371).toDecimalPlaces(2);
}

/**
 * Convert miles to km
 * @param miles - Distance in miles
 * @returns Distance in kilometers with 2 decimal precision
 */
export function milesToKm(miles: number): Decimal {
  return new Decimal(miles).mul(1.60934).toDecimalPlaces(2);
}

/**
 * Convert liters to gallons
 * @param liters - Volume in liters
 * @returns Volume in gallons with 2 decimal precision
 */
export function litersToGallons(liters: number): Decimal {
  return new Decimal(liters).mul(0.264172).toDecimalPlaces(2);
}

/**
 * Convert gallons to liters
 * @param gallons - Volume in gallons
 * @returns Volume in liters with 2 decimal precision
 */
export function gallonsToLiters(gallons: number): Decimal {
  return new Decimal(gallons).mul(3.78541).toDecimalPlaces(2);
}

/**
 * Convert km/l to MPG (miles per gallon)
 * @param kmPerLiter - Fuel economy in km/l
 * @returns Fuel economy in MPG with 2 decimal precision
 */
export function kmPerLiterToMPG(kmPerLiter: number): Decimal {
  return new Decimal(kmPerLiter).mul(2.35215).toDecimalPlaces(2);
}

/**
 * Convert MPG to km/l
 * @param mpg - Fuel economy in MPG
 * @returns Fuel economy in km/l with 2 decimal precision
 */
export function mpgToKmPerLiter(mpg: number): Decimal {
  return new Decimal(mpg).mul(0.425144).toDecimalPlaces(2);
}
