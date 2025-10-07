"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { XMarkIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import { showSuccessToast, showErrorToast } from './custom-toast'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  address: string | undefined
  name: string
  avatarSrc: string | undefined
  fallbackEmoji: string
  fallbackColor: string
  balance: any
  hasSubnames: boolean
  subname: any
  refetchIdentity: () => void
}

type ModalView = 'account' | 'create-username' | 'upload-avatar'

export function AccountModal({
  isOpen,
  onClose,
  address,
  name,
  avatarSrc,
  fallbackEmoji,
  fallbackColor,
  balance,
  hasSubnames,
  subname,
  refetchIdentity,
}: AccountModalProps) {
  const { logout } = usePrivy()
  const [currentView, setCurrentView] = useState<ModalView>('account')
  const [copied, setCopied] = useState(false)
  const isMobile = useMediaQuery('(max-width: 639px)')

  const handleClose = () => {
    setCurrentView('account')
    onClose()
  }

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      showSuccessToast('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    logout()
    handleClose()
  }

  const handleUsernameCreated = () => {
    refetchIdentity()
    setCurrentView('account')
    showSuccessToast('Username created successfully!')
  }

  const handleAvatarUploaded = () => {
    refetchIdentity()
    setCurrentView('account')
    showSuccessToast('Avatar uploaded successfully!')
  }

  if (!isOpen) return null

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
        <SheetContent>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium">
              {currentView === 'account' && 'Account'}
              {currentView === 'create-username' && 'Create Username'}
              {currentView === 'upload-avatar' && 'Upload Avatar'}
            </h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {currentView === 'account' && (
            <AccountView
              address={address}
              name={name}
              avatarSrc={avatarSrc}
              fallbackEmoji={fallbackEmoji}
              fallbackColor={fallbackColor}
              balance={balance}
              hasSubnames={hasSubnames}
              copied={copied}
              onCopyAddress={handleCopyAddress}
              onCreateUsername={() => setCurrentView('create-username')}
              onUploadAvatar={() => setCurrentView('upload-avatar')}
              onDisconnect={handleDisconnect}
            />
          )}

          {currentView === 'create-username' && (
            <CreateUsernameView
              address={address}
              onSuccess={handleUsernameCreated}
              onCancel={() => setCurrentView('account')}
            />
          )}

          {currentView === 'upload-avatar' && (
            <UploadAvatarView
              subname={subname}
              onSuccess={handleAvatarUploaded}
              onCancel={() => setCurrentView('account')}
            />
          )}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentView === 'account' && 'Account'}
            {currentView === 'create-username' && 'Create Username'}
            {currentView === 'upload-avatar' && 'Upload Avatar'}
          </DialogTitle>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </DialogHeader>

        {currentView === 'account' && (
          <AccountView
            address={address}
            name={name}
            avatarSrc={avatarSrc}
            fallbackEmoji={fallbackEmoji}
            fallbackColor={fallbackColor}
            balance={balance}
            hasSubnames={hasSubnames}
            copied={copied}
            onCopyAddress={handleCopyAddress}
            onCreateUsername={() => setCurrentView('create-username')}
            onUploadAvatar={() => setCurrentView('upload-avatar')}
            onDisconnect={handleDisconnect}
          />
        )}

        {currentView === 'create-username' && (
          <CreateUsernameView
            address={address}
            onSuccess={handleUsernameCreated}
            onCancel={() => setCurrentView('account')}
          />
        )}

        {currentView === 'upload-avatar' && (
          <UploadAvatarView
            subname={subname}
            onSuccess={handleAvatarUploaded}
            onCancel={() => setCurrentView('account')}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

// Account View Component
function AccountView({
  name,
  avatarSrc,
  fallbackEmoji,
  fallbackColor,
  balance,
  hasSubnames,
  copied,
  onCopyAddress,
  onCreateUsername,
  onUploadAvatar,
  onDisconnect,
}: {
  address: string | undefined
  name: string
  avatarSrc: string | undefined
  fallbackEmoji: string
  fallbackColor: string
  balance: any
  hasSubnames: boolean
  copied: boolean
  onCopyAddress: () => void
  onCreateUsername: () => void
  onUploadAvatar: () => void
  onDisconnect: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Large Avatar and Name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-4">
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={name} 
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-3xl ${fallbackColor}`}>
              {fallbackEmoji}
            </div>
          )}
        </div>
        <h4 className="text-xl font-medium text-gray-900">{name}</h4>
        {balance && (
          <p className="text-sm text-gray-500 mt-1">
            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {/* Create Username - only if no username */}
        {!hasSubnames && (
          <button
            onClick={onCreateUsername}
            className="w-full button-primary rounded-lg py-3"
          >
            Create Username
          </button>
        )}

        {/* Upload Avatar - only if has username */}
        {hasSubnames && (
          <button
            onClick={onUploadAvatar}
            className="w-full button-primary rounded-lg py-3"
          >
            Upload Avatar
          </button>
        )}

        {/* Copy Address */}
        <button
          onClick={onCopyAddress}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Copy Address</span>
            </>
          )}
        </button>

        {/* Disconnect */}
        <button
          onClick={onDisconnect}
          className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>
    </div>
  )
}

// Create Username View Component
import { useDebounce } from '@/hooks/use-debounce'
import { useSubnameAvailability, useCreateSubname } from '@/hooks/use-subname-creation'

function CreateUsernameView({
  address,
  onSuccess,
  onCancel,
}: {
  address: string | undefined
  onSuccess: () => void
  onCancel: () => void
}) {
  const [username, setUsername] = useState('')
  const debouncedUsername = useDebounce(username, 500)
  
  const { data: isAvailable, isLoading: checkingAvailability } = useSubnameAvailability(debouncedUsername)
  const { createSubname, isCreating, error } = useCreateSubname()
  
  const ENS_NAME = process.env.NEXT_PUBLIC_ENS_NAME!;
  const fullUsername = username ? `${username}.${ENS_NAME}` : ''

  const handleCreate = async () => {
    if (!address || !username || !isAvailable) return

    createSubname(
      {
        label: username,
        address: address,
        displayName: username,
        pfpUrl: '',
      },
      {
        onSuccess: () => {
          onSuccess()
        },
        onError: (err) => {
          showErrorToast(`Failed to create username: ${err.message}`)
        },
      }
    )
  }

  const canCreate = username && isAvailable && !checkingAvailability

  return (
    <div className="space-y-4">
      {/* Username Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
            placeholder="yourname"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {username && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingAvailability ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : isAvailable ? (
                <CheckIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XMarkIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
          )}
        </div>
        {/* Preview */}
        {fullUsername && (
          <p className="mt-2 text-sm text-gray-500">
            Your username will be: <span className="font-medium">{fullUsername}</span>
          </p>
        )}
        {/* Status */}
        {username && !checkingAvailability && (
          <p className={`mt-1 text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {isAvailable ? 'Available' : 'Not available'}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isCreating}
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!canCreate || isCreating}
          className="flex-1 button-primary rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}

// Upload Avatar View Component
import { AvatarUpload } from '@/components/ui/avatar-upload'

function UploadAvatarView({
  subname,
  onSuccess,
  onCancel,
}: {
  subname: any
  onSuccess: () => void
  onCancel: () => void
}) {
  const network = (process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'sepolia') || 'mainnet'

  return (
    <div className="space-y-4">
      <AvatarUpload
        subname={subname?.fullName || ''}
        network={network}
        address={subname?.owner}
        currentAvatarSrc={subname?.texts?.avatar}
            onAvatarUploaded={() => {
              onSuccess()
            }}
      />
      
      <button
        onClick={onCancel}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        Close
      </button>
    </div>
  )
}

