import { authClient } from '../api/client';

export interface OverviewStats {
  total_households: number;
  total_residents: number;
  feedback_this_month: number;
  resolution_rate: number;
}

export interface HouseholdTrendItem {
  month: string;
  count: number;
}

export interface FeedbackCategoryItem {
  name: string;
  value: number;
  category_code: string;
}

export interface FeedbackStatusItem {
  name: string;
  count: number;
  percentage: number;
  status_code: string;
}

export interface AgeDistributionItem {
  group: string;
  count: number;
  percentage: number;
}

export interface GenderDistributionItem {
  gender: string;
  count: number;
  percentage: number;
}

export interface DemographicsData {
  age_distribution: AgeDistributionItem[];
  gender_distribution: GenderDistributionItem[];
  total: number;
}

export interface ProcessingTimeItem {
  category: string;
  avg_days: number;
}

export const statisticsService = {
  /**
   * Get overview statistics for dashboard
   */
  async getOverview(): Promise<OverviewStats> {
    const response = await authClient.get<OverviewStats>('/statistics/overview');
    return response.data;
  },

  /**
   * Get household trend for last N months
   */
  async getHouseholdTrend(months: number = 5): Promise<HouseholdTrendItem[]> {
    const response = await authClient.get<{ data: HouseholdTrendItem[] }>('/statistics/households/trend', {
      params: { months },
    });
    return response.data.data;
  },

  /**
   * Get feedback count by category
   */
  async getFeedbackByCategory(): Promise<FeedbackCategoryItem[]> {
    const response = await authClient.get<{ data: FeedbackCategoryItem[] }>('/statistics/feedback/by-category');
    return response.data.data;
  },

  /**
   * Get feedback count by status
   */
  async getFeedbackByStatus(): Promise<{ data: FeedbackStatusItem[]; total: number }> {
    const response = await authClient.get<{ data: FeedbackStatusItem[]; total: number }>('/statistics/feedback/by-status');
    return response.data;
  },

  /**
   * Get resident demographics (age and gender distribution)
   */
  async getResidentDemographics(): Promise<DemographicsData> {
    const response = await authClient.get<DemographicsData>('/statistics/residents/demographics');
    return response.data;
  },

  /**
   * Get average feedback processing time by category
   */
  async getFeedbackProcessingTime(): Promise<ProcessingTimeItem[]> {
    const response = await authClient.get<{ data: ProcessingTimeItem[] }>('/statistics/feedback/processing-time');
    return response.data.data;
  },
};

export default statisticsService;
