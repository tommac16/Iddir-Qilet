import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  TREASURER = 'TREASURER',
  SECRETARY = 'SECRETARY',
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export enum ClaimStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  types: {
    meetings: boolean;
    payments: boolean;
    news: boolean;
  };
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
  joinDate: string;
  balance: number; // Positive means credit, negative means debt
  avatarUrl?: string;
  gender?: 'MALE' | 'FEMALE';
  password?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface Transaction {
  id: string;
  memberId: string; // or 'SYSTEM' for general expenses
  memberName?: string;
  date: string;
  amount: number;
  type: 'CONTRIBUTION' | 'EXPENSE' | 'PENALTY' | 'CLAIM_PAYOUT';
  description: string;
  status: TransactionStatus;
  receiptUrl?: string; // Base64 or URL of the uploaded receipt
}

export interface Claim {
  id: string;
  memberId: string;
  memberName: string;
  type: 'FUNERAL' | 'MEDICAL' | 'WEDDING' | 'OTHER';
  description: string;
  amountRequested: number;
  status: ClaimStatus;
  dateFiled: string;
}

export interface NotificationDraft {
  topic: string;
  audience: 'ALL' | 'DEFAULTERS' | 'ADMINS';
  tone: 'FORMAL' | 'URGENT' | 'CELEBRATORY';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}