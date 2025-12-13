import { Billing } from "@/types/billing.type";

export const calculateTotals = (bill: Billing) => {
  if (!bill)
    return {
      totalElectricityCost: 0,
      totalWaterCost: 0,
      totalAmount: 0,
    };

  const contract = bill.tenantContract.contract;
  const electricityUsage =
    bill.electricity_end_index - bill.electricity_start_index;
  const waterUsage = bill.water_end_index - bill.water_start_index;

  const totalElectricityCost =
    Number(contract.fixed_electricity_fee) > 0
      ? Number(contract.fixed_electricity_fee)
      : electricityUsage * Number(contract.price_per_electricity_unit);

  const totalWaterCost =
    Number(contract.fixed_water_fee) > 0
      ? Number(contract.fixed_water_fee)
      : waterUsage * Number(contract.price_per_water_unit);

  const totalAmount =
    Number(contract.base_rent) +
    totalElectricityCost +
    totalWaterCost +
    Number(contract.internet_fee) +
    Number(contract.living_fee) +
    Number(contract.parking_fee) +
    Number(contract.cleaning_fee);

  return {
    totalElectricityCost,
    totalWaterCost,
    totalAmount,
  };
};
