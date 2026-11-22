// src/types/fuelcast.ts

export const FUELCAST_VERSION = '2.0.0';

export type FuelType = 'Diesel' | 'Petrol' | 'Speed Petrol' | 'Power Diesel';

export type TankStatus = 'Safe' | 'Order soon' | 'At risk';

export interface Tank {
  id: string;
  name: string;
  fuelType: FuelType;
  capacityLiters: number;
  currentLiters: number;
  safeMinLiters: number;
  daysRemaining: number;
  dailyConsumption: number;
  status: TankStatus;
  percentage: number;
}

export interface Reading {
  id: string;
  timestamp: string;
  tankName: string;
  dipMm: number;
  stockLiters: number;
  type: 'Opening' | 'Closing';
  recordedBy: string;
  status: 'Synced' | 'Manual' | 'Estimated';
}

export interface PumpStation {
  id: string;
  name: string;
  code: string;
  city: string;
  area: string;
  state: string;
  depot: string;
  leadTimeDays: number;
  dealerName: string;
  dealerPhone: string;
  dealerEmail: string;
  tanks: Tank[];
  status: 'Live' | 'Setting up' | 'Inactive';
  lastReadingTime: string;
  dataSource: 'Auto-sync' | 'Manual entry' | 'CSV upload';
  coordinates: { lat: number; lng: number };
  criticalTank?: string;
  minDaysLeft: number;
}

export type OrderStage = 
  | 'waiting_for_dealer' 
  | 'to_accept' 
  | 'to_dispatch' 
  | 'on_the_way' 
  | 'delivered';

export interface RefillOrder {
  id: string;
  orderNumber: string;
  pumpId: string;
  pumpName: string;
  location: string;
  fuelType: FuelType;
  quantityLiters: number;
  suggestedDate: string;
  confirmedDate?: string;
  stage: OrderStage;
  dealerContact: string;
  truckNumber?: string;
  driverName?: string;
  driverPhone?: string;
  deliveryVarianceLiters?: number;
  depot: string;
  estimatedDelivery?: string;
  urgency: 'Critical' | 'Warning' | 'Routine';
  distributorNote?: string;
  originalRequestedLiters?: number;
  rejectionReason?: string;
}

export type TankerStatus = 'On the way' | 'Loading in depot' | 'Returning' | 'Available' | 'Maintenance';

export interface TankerTruck {
  id: string;
  registration: string;
  capacityLiters: number;
  compartments: number[]; // e.g. [4000, 4000, 4000, 4000]
  assignedDriver: string;
  driverPhone: string;
  status: TankerStatus;
  currentDestination?: string;
  eta?: string;
  fuelCarried?: FuelType;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'On duty' | 'On leave' | 'Off duty';
  assignedTruck: string;
  totalTrips: number;
}

export interface Distributor {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  headquarters: string;
  activePumps: number;
  planQuota: number;
  planTier: 'Small' | 'Standard' | 'Enterprise';
  status: 'Active' | 'Pending Setup' | 'Suspended';
  joinedDate: string;
  lastActive: string;
  monthlyFeeInr?: number;
}

export interface AlertItem {
  id: string;
  type: 'critical_tank' | 'missing_reading' | 'delivery_short' | 'system';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  pumpId?: string;
  pumpName?: string;
  actionLabel?: string;
  resolved: boolean;
}

export interface SyncRun {
  id: string;
  name: string;
  scheduledTime: string;
  completedTime?: string;
  status: 'Completed' | 'Running' | 'Scheduled' | 'Failed';
  totalPumps: number;
  successful: number;
  failed: number;
}

export interface FailedSyncRecord {
  id: string;
  pumpName: string;
  city: string;
  connectionType: 'Auto-sync' | 'Manual entry' | 'CSV upload';
  failureReason: 'Unreachable' | 'Login expired' | 'Missing tank data' | 'Not typed yet';
  lastAttempt: string;
  dealerPhone: string;
}

export interface HolidaySurge {
  id: string;
  name: string;
  date: string;
  surgeMultiplier: number; // e.g. 1.15 for +15%
  impactType: 'City-wide' | 'Highway' | 'State-wide';
}

export type ComplaintCategory =
  | 'tanker_delay'
  | 'driver_conduct'
  | 'dip_shortage'
  | 'seal_quality'
  | 'density_quality'
  | 'other';

export type ComplaintStatus = 'open' | 'investigating' | 'resolved';

export interface DealerComplaint {
  id: string;
  ticketNumber: string;
  orderNumber: string;
  pumpId: string;
  pumpName: string;
  dealerName: string;
  dealerPhone: string;
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  category: ComplaintCategory;
  severity: 'Critical' | 'High' | 'Medium';
  dealerMessage: string;
  expectedResolution?: string;
  createdAt: string;
  status: ComplaintStatus;
  distributorJustification?: string;
  justifiedAt?: string;
  resolvedBy?: string;
  actionTaken?: string;
  creditNoteAmount?: number;
}

