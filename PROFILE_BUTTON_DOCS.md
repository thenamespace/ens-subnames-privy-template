# Custom Profile / Connect Button

A comprehensive wallet connection and user identity management component for your Next.js app with Privy, Wagmi, and ENS support.

## 🎯 Features

### Disconnected State

- Displays a primary **"Connect Wallet"** button
- Clicking opens Privy's connect flow

### Connected State

- Shows a compact **account chip** with:
  - **Avatar**: User's identity avatar (subname → ENS → deterministic fallback)
  - **Name**: User's preferred name (username/subname → ENS name → truncated address)
  - **Balance**: Optional balance preview (ETH)
  - Clicking opens the Account Modal

### Account Modal - Three Views

#### 1. Default Account View

- Large avatar display with preferred name
- Optional balance information
- **Actions**:
  - **Create Username**: Shown only if user has no username yet
  - **Upload Avatar**: Shown only if user already has a username
  - **Copy Address**: Copies wallet address with confirmation
  - **Disconnect**: Ends the current session

#### 2. Create Username View

- Username input with:
  - Debounced availability check (500ms delay)
  - Live status indicators (✓ available / ✗ taken / ⟳ checking)
  - Preview of final username format (e.g., `alice.yourname.eth`)
- Optional avatar URL field
- "Create" button enabled only when username is available
- On success: identity data refreshes automatically

#### 3. Upload Avatar View

- File picker for image upload
- Live preview of selected image
- Uploads to avatar service with SIWE authentication
- Updates ENS avatar text record
- On success: identity refreshes automatically

## 📦 Components Created

### `/src/hooks/use-identity.ts`

Custom hook that combines:

- ENS name resolution (`useEnsName`)
- ENS avatar resolution (`useEnsAvatar`)
- Subname/username data (`usePreferredIdentity`)
- Deterministic emoji/color fallbacks

### `/src/components/ui/profile-button.tsx`

Main button component that:

- Shows "Connect Wallet" when disconnected
- Shows account chip when connected
- Manages modal state

### `/src/components/ui/account-modal.tsx`

Comprehensive modal with:

- Default account view
- Create username view with availability checking
- Upload avatar view with image preview
- Smooth transitions between views

## 🔧 Identity Resolution Logic

### Name Priority (in order)

1. **Username** (subname) - if user has created one
2. **ENS Name** - if available on mainnet
3. **Truncated Address** - fallback (e.g., `0x1234...5678`)

### Avatar Priority (in order)

1. **Subname Avatar** - from username's avatar text record
2. **ENS Avatar** - from ENS name's avatar record
3. **Deterministic Fallback** - emoji + gradient color based on address

## 🎨 Visual Features

- **Deterministic Fallbacks**: Each address gets a consistent emoji + color combination
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Modal transitions using Headless UI
- **Loading States**: Shows loading indicators during checks
- **Success Feedback**: Toast notifications for actions
- **Error Handling**: Clear error messages for failed operations

## 🚀 Usage

### In Your Header/Navbar

```tsx
import { Header } from "@/components/ui/header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
```

The `ProfileButton` is already integrated into the `Header` component.

### Standalone Usage

```tsx
import { ProfileButton } from "@/components/ui/profile-button";

export default function MyComponent() {
  return <ProfileButton />;
}
```

## 🔐 Environment Variables Required

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id

# Namespace Configuration
NAMESPACE_API_KEY=your_namespace_api_key
NEXT_PUBLIC_ENS_NAME=yourname.eth

# Network (optional, defaults to mainnet)
NEXT_PUBLIC_NETWORK=mainnet
```

## 📚 Dependencies

All required dependencies are already installed:

- `@headlessui/react` - For accessible modal component
- `@privy-io/react-auth` - Wallet authentication
- `wagmi` - Ethereum hooks (`useEnsName`, `useEnsAvatar`, etc.)
- `@tanstack/react-query` - Data fetching and caching
- `@heroicons/react` - UI icons

## 🎯 Key Integration Points

### Hooks Used

- `useIdentity` - Main identity resolution hook
- `useSubnames` / `useFirstSubname` - Fetch user's subnames
- `useSubnameAvailability` - Check username availability
- `useCreateSubname` - Create new username
- `useUploadAvatar` - Upload avatar image
- `useUpdateEnsAvatar` - Update ENS avatar text record
- `useDebounce` - Debounce input for availability checks
- `useEnsName` - Fetch ENS name from Wagmi
- `useEnsAvatar` - Fetch ENS avatar from Wagmi

### API Routes

- `/api/subname/create` - Creates new subname
- `/api/subname/avatar` - Updates ENS avatar text record

## 🎨 Styling

Uses Tailwind CSS with custom button classes defined in `globals.css`:

- `.button-primary` - Primary action buttons
- `.button` - Secondary action buttons
- Gradient backgrounds for fallback avatars

## ✅ Build Status

The project builds successfully with no errors or warnings:

```bash
pnpm run build
# ✓ Compiled successfully
```

## 🔄 Identity Refresh Flow

1. User creates username → `refetchIdentity()` → UI updates immediately
2. User uploads avatar → `refetchIdentity()` → Avatar appears instantly
3. Modal automatically switches back to account view after successful operations

## 🎭 User Experience Highlights

- **Immediate Feedback**: All actions show loading states
- **Auto-refresh**: Identity data refetches after mutations
- **Validation**: Username availability checked before allowing creation
- **Smart Fallbacks**: Always shows something meaningful (no empty states)
- **One Username Per Address**: System prevents duplicate usernames
- **Toast Notifications**: Success/error messages for all operations
