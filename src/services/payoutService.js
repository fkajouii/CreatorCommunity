/**
 * Stripe Payout Services
 * 
 * Documentation: https://docs.stripe.com/connect/collect-then-payout-guide
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://your-cloud-functions-url.com';

/**
 * Creates a Stripe Connect account for a creator.
 * Typically called when a creator wants to start receiving payments.
 */
export const createStripeAccount = async (creatorId, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-stripe-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, email })
    });
    
    if (!response.ok) throw new Error('Failed to create Stripe account');
    
    const { accountLinkUrl } = await response.json();
    return accountLinkUrl; // Redirect creator to this URL to complete onboarding
  } catch (error) {
    console.error("Stripe Onboarding Error:", error);
    // Simulation for dev
    return "https://connect.stripe.com/setup/s/dummy-link";
  }
};

/**
 * Initiates a payout for a creator.
 * Called by admins in the Payout Management interface.
 */
export const issuePayout = async (creatorId, amount, payoutId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/issue-payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, amount, payoutId })
    });
    
    if (!response.ok) throw new Error('Payout failed');
    
    return await response.json();
  } catch (error) {
    console.error("Stripe Payout Error:", error);
    throw error;
  }
};
