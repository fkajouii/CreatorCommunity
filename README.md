# Pok Pok Community Portal

A dual-portal web application for managing a creator and influencer community.

## 🚀 Quick Start

### 1. Local Development Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Environment Configuration
Create a `.env` file in the root directory with your Firebase and TikTok credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
```

## 🏗️ Project Structure

- `src/apps/admin/`: Administrative management views (Campaigns, Payouts, Discovery).
- `src/apps/creator/`: Creator-facing dashboard and onboarding flows.
- `src/services/`: Core business logic and API integrations.
- `src/shared/`: Shared contexts (Auth) and components.
- `src/types/schema.js`: Centralized data definitions.

## ☁️ Deployment (Firebase Hosting)

1. Build the production assets:
   ```bash
   npm run build
   ```
2. Deploy using Firebase CLI:
   ```bash
   firebase deploy
   ```

## 🔐 Security & Audit
- All admin actions are logged to the `activity_logs` collection.
- Firestore Security Rules are defined in `firestore.rules`.
- Role-based access control (Admin vs Creator) is enforced via AuthContext.
