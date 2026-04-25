/**
 * Data Schema Definitions (Conceptual / Types)
 * 
 * Creators Collection:
 * - id: string
 * - name: string
 * - email: string
 * - handle: string (TikTok)
 * - status: 'lead' | 'validated' | 'agreement_sent' | 'signed' | 'active' | 'paused' | 'archived'
 * - createdAt: timestamp
 * - validatedAt: timestamp
 * - signedAt: timestamp
 * - instructionsSent: boolean
 * 
 * Videos Collection:
 * - id: string
 * - creatorId: string (FK)
 * - url: string
 * - views: number
 * - lastUpdated: timestamp
 * - postedAt: timestamp
 * 
 * Agreements Collection:
 * - id: string
 * - creatorId: string (FK)
 * - content: string
 * - accepted: boolean
 * - acceptedAt: timestamp
 * 
 * Payouts Collection:
 * - id: string
 * - creatorId: string (FK)
 * - amount: number
 * - status: 'pending' | 'approved' | 'paid'
 * - scheduledFor: timestamp
 * - paidAt: timestamp
 */

export const CREATOR_STATUS = {
  LEAD: 'lead',
  VALIDATED: 'validated',
  AGREEMENT_SENT: 'agreement_sent',
  SIGNED: 'signed',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ARCHIVED: 'archived'
};

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid'
};

export const LOG_TYPES = {
  PAYOUT_ISSUED: 'payout_issued',
  CAMPAIGN_CREATED: 'campaign_created',
  CAMPAIGN_UPDATED: 'campaign_updated',
  CREATOR_STATUS_CHANGE: 'creator_status_change',
  LEAD_SAVED: 'lead_saved',
  AGREEMENT_SIGN: 'agreement_sign'
};
