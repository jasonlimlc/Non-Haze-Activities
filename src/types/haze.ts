export type SingaporeRegion = 'national' | 'central' | 'north' | 'south' | 'east' | 'west';

export interface RegionalPsiData {
  region: SingaporeRegion;
  displayName: string;
  psi24Hourly: number;
  pm25OneHourly: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  description: string;
  updateTime: string;
}

export interface PsiApiResponse {
  region_metadata: Array<{
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
    };
  }>;
  items: Array<{
    timestamp: string;
    update_timestamp: string;
    readings: {
      psi_twenty_four_hourly: Record<string, number>;
      pm25_one_hourly: Record<string, number>;
      pm25_twenty_four_hourly?: Record<string, number>;
      so2_twenty_four_hourly?: Record<string, number>;
      o3_eight_hour_max?: Record<string, number>;
      no2_one_hour_max?: Record<string, number>;
      co_eight_hour_max?: Record<string, number>;
    };
  }>;
}

export interface ItinerarySubstitution {
  id: string;
  outdoorAttraction: string;
  outdoorZone: string;
  outdoorDescription: string;
  hazeRisk: 'Moderate' | 'High' | 'Severe';
  indoorAlternative: string;
  alternativeCategory: 'Museum & Culture' | 'Botanical Dome' | 'Mega Entertainment' | 'Shopping & Dining' | 'Family & Kids';
  location: string;
  nearestMrt: string;
  indoorAirQuality: 'HEPA Filtered' | 'Fully Enclosed AC' | 'Underground Sheltered';
  highlight: string;
  admission: 'Free' | 'Ticketed';
  suggestedDuration: string;
  imageUrl: string;
  practicalTips: string[];
}

export interface MedicalSupplyItem {
  id: string;
  name: string;
  category: 'Respiratory Protection' | 'Eye Care' | 'Throat & Nasal' | 'Medication & Devices';
  singaporePriceSgd: string;
  effectivenessRating: string;
  whyNeeded: string;
  recommendedBrands: string[];
  usageAdvice: string;
  isN95OrEquivalent: boolean;
  stockAvailability: 'High' | 'Moderate' | 'In-Demand';
  retailers: string[];
}

export interface PharmacyChain {
  name: string;
  outletCount: string;
  operatingHours: string;
  popularTouristOutlets: string[];
  hotline: string;
  website: string;
  notes: string;
}

export interface ClinicOrHospital {
  id: string;
  name: string;
  type: '24h Emergency Hospital (A&E)' | 'Children Specialized Emergency' | '24h GP Clinic' | 'Telemedicine Service';
  address: string;
  area: string;
  phone: string;
  estimatedWaitTime: string;
  touristFriendly: boolean;
  languages: string[];
  insuranceAccepted: string;
  googleMapsQuery: string;
}

export interface SymptomTriage {
  level: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  recommendedAction: string;
  urgency: string;
  homeCare: string[];
  whenToSeekDoctor: string;
}

export interface AgeGroupGuideline {
  group: string;
  subtext: string;
  psiUnder100: string;
  psi101To200: string;
  psi201Plus: string;
  keyPrecautions: string[];
}
