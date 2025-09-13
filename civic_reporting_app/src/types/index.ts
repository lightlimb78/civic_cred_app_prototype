export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  aadhaarVerified: boolean;
  meritsPoints: number;
  reportsCount: number;
  joinedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  aiVerified: boolean;
  aiSuggestions?: {
    category: ReportCategory;
    severity: ReportSeverity;
    confidence: number;
  };
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'verified' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed';
  amount: number;
  reason: string;
  reportId?: string;
  timestamp: string;
}

export type ReportCategory = 
  | 'pothole'
  | 'streetlight'
  | 'trash'
  | 'drainage'
  | 'road_damage'
  | 'traffic_signal'
  | 'water_supply'
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 
  | 'draft'
  | 'submitted'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface AppState {
  user: User | null;
  reports: Report[];
  isAuthenticated: boolean;
  isLoading: boolean;
}