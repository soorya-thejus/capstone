// services/dealService.ts
import { Deal, IDeal } from "../models/Deals";

// Create a Deal
export const createDealService = async (dealData: IDeal): Promise<IDeal> => {
    const newDeal = new Deal(dealData);
    return await newDeal.save();  // This will return a Promise<IDeal>
};

// Get all Deals
export const getDealsService = async (): Promise<IDeal[]> => {
    return await Deal.find();  // This will return a Promise<IDeal[]>
};

// Get a Deal By Id
export const getDealByIdService = async (id: string): Promise<IDeal | null> => {
    return await Deal.findById(id);  // This will return a Promise<IDeal | null>
};

// Update Deal
export const updateDealService = async (id: string, dealData: Partial<IDeal>): Promise<IDeal | null> => {
    return await Deal.findByIdAndUpdate(id, dealData, { new: true, runValidators: true });  // This will return a Promise<IDeal | null>
};

// Delete a Deal
export const deleteDealService = async (id: string): Promise<IDeal | null> => {
    return await Deal.findByIdAndDelete(id);  // This will return a Promise<IDeal | null>
};

// Get Deal Values for deal_ids
export const getDealValuesService = async (deal_ids: string[]): Promise<{ deals: IDeal[], totalDealValue: number }> => {
    const deals = await Deal.find({ _id: { $in: deal_ids } }).select('deal_value');
    const totalDealValue = deals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
    return { deals, totalDealValue };  // This will return a Promise<{ deals: IDeal[], totalDealValue: number }>
};
