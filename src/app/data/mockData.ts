export interface Farm {
  id: string;
  name: string;
  location: string;
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  lastRecommendation?: string;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  plantingDate: string;
  soilType: string;
}

export interface Recommendation {
  id: string;
  date: string;
  farmId: string;
  farmName: string;
  cropId: string;
  cropName: string;
  isAI: boolean;
  irrigation: string;
  fertilization: string;
  riskAlert: string;
  priority: 'High' | 'Medium' | 'Low';
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

export const mockFarms: Farm[] = [
  {
    id: '1',
    name: 'Green Valley Farm',
    location: 'California, USA',
    weather: {
      temperature: 24,
      humidity: 65,
      rainfall: 12,
    },
    lastRecommendation: 'Increase irrigation by 15% due to high temperature forecast.',
  },
  {
    id: '2',
    name: 'Sunrise Organic Fields',
    location: 'Oregon, USA',
    weather: {
      temperature: 18,
      humidity: 78,
      rainfall: 28,
    },
    lastRecommendation: 'Monitor for fungal diseases due to high humidity levels.',
  },
  {
    id: '3',
    name: 'Harvest Moon Ranch',
    location: 'Texas, USA',
    weather: {
      temperature: 32,
      humidity: 42,
      rainfall: 3,
    },
    lastRecommendation: 'Urgent: Implement drought management protocols immediately.',
  },
];

export const mockCrops: Crop[] = [
  {
    id: '1',
    farmId: '1',
    name: 'Wheat',
    plantingDate: '2026-01-15',
    soilType: 'Loamy',
  },
  {
    id: '2',
    farmId: '1',
    name: 'Corn',
    plantingDate: '2026-02-10',
    soilType: 'Clay',
  },
  {
    id: '3',
    farmId: '2',
    name: 'Tomatoes',
    plantingDate: '2026-02-20',
    soilType: 'Sandy Loam',
  },
  {
    id: '4',
    farmId: '2',
    name: 'Lettuce',
    plantingDate: '2026-03-01',
    soilType: 'Loamy',
  },
  {
    id: '5',
    farmId: '3',
    name: 'Cotton',
    plantingDate: '2026-01-05',
    soilType: 'Clay Loam',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    date: '2026-03-28',
    farmId: '1',
    farmName: 'Green Valley Farm',
    cropId: '1',
    cropName: 'Wheat',
    isAI: true,
    irrigation: 'Increase watering frequency to twice daily. Apply 25mm of water per session during morning and evening hours.',
    fertilization: 'Apply nitrogen-rich fertilizer at 120 kg/ha. Consider split application: 60 kg at current stage and remaining after 2 weeks.',
    riskAlert: 'Medium risk of aphid infestation detected. Monitor crop closely and apply organic pesticides if needed.',
    priority: 'Medium',
    weather: {
      temperature: 24,
      humidity: 65,
      rainfall: 12,
    },
  },
  {
    id: '2',
    date: '2026-03-27',
    farmId: '2',
    farmName: 'Sunrise Organic Fields',
    cropId: '3',
    cropName: 'Tomatoes',
    isAI: true,
    irrigation: 'Reduce irrigation to compensate for recent rainfall. Water only if top 2 inches of soil is dry.',
    fertilization: 'Apply balanced NPK fertilizer (10-10-10) at 80 kg/ha. Supplement with calcium to prevent blossom end rot.',
    riskAlert: 'High risk of fungal disease due to elevated humidity. Ensure proper air circulation and consider fungicide application.',
    priority: 'High',
    weather: {
      temperature: 18,
      humidity: 78,
      rainfall: 28,
    },
  },
  {
    id: '3',
    date: '2026-03-26',
    farmId: '3',
    farmName: 'Harvest Moon Ranch',
    cropId: '5',
    cropName: 'Cotton',
    isAI: false,
    irrigation: 'Critical: Implement emergency irrigation. Water deeply at least once per day due to extreme heat and drought conditions.',
    fertilization: 'Postpone fertilization until adequate soil moisture is restored. Focus on water management first.',
    riskAlert: 'Very high risk of heat stress and crop failure. Consider installing shade structures or misting systems if available.',
    priority: 'High',
    weather: {
      temperature: 32,
      humidity: 42,
      rainfall: 3,
    },
  },
  {
    id: '4',
    date: '2026-03-25',
    farmId: '1',
    farmName: 'Green Valley Farm',
    cropId: '2',
    cropName: 'Corn',
    isAI: true,
    irrigation: 'Maintain current irrigation schedule. Soil moisture levels are optimal for this growth stage.',
    fertilization: 'Apply phosphorus-rich starter fertilizer at 40 kg/ha to support root development.',
    riskAlert: 'Low risk. Continue regular monitoring. Watch for signs of nitrogen deficiency as crop develops.',
    priority: 'Low',
    weather: {
      temperature: 23,
      humidity: 68,
      rainfall: 15,
    },
  },
];

export const mockWeatherTrends = [
  { date: 'Mar 23', temperature: 22, humidity: 62, id: 'day-1' },
  { date: 'Mar 24', temperature: 23, humidity: 65, id: 'day-2' },
  { date: 'Mar 25', temperature: 25, humidity: 60, id: 'day-3' },
  { date: 'Mar 26', temperature: 24, humidity: 68, id: 'day-4' },
  { date: 'Mar 27', temperature: 26, humidity: 63, id: 'day-5' },
  { date: 'Mar 28', temperature: 24, humidity: 65, id: 'day-6' },
  { date: 'Mar 29', temperature: 25, humidity: 67, id: 'day-7' },
];