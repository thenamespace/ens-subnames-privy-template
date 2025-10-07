"use client"

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import Image from 'next/image'
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {currentView === 'account' && 'Account'}
                    {currentView === 'create-username' && 'Create Username'}
                    {currentView === 'upload-avatar' && 'Upload Avatar'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Views */}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
            <Image 
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
  const [avatarUrl, setAvatarUrl] = useState('')
  const debouncedUsername = useDebounce(username, 500)
  
  const { data: isAvailable, isLoading: checkingAvailability } = useSubnameAvailability(debouncedUsername)
  const { createSubname, isCreating, error } = useCreateSubname()
  
  const ENS_NAME = process.env.NEXT_PUBLIC_ENS_NAME || 'namespace.eth'
  const fullUsername = username ? `${username}.${ENS_NAME}` : ''

  const handleCreate = async () => {
    if (!address || !username || !isAvailable) return

    createSubname(
      {
        label: username,
        address: address,
        displayName: username,
        pfpUrl: avatarUrl,
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

      {/* Avatar URL (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL (optional)
        </label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
import { useUploadAvatar } from '@/hooks/use-upload-avatar'
import { useUpdateEnsAvatar } from '@/hooks/use-update-ens-avatar'

function UploadAvatarView({
  subname,
  onSuccess,
  onCancel,
}: {
  subname: any
  onSuccess: () => void
  onCancel: () => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { uploadAvatar, isUploading } = useUploadAvatar()
  const { updateEnsAvatar } = useUpdateEnsAvatar()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !subname?.fullName) return

    try {
      // Determine network from environment or default to mainnet
      const network = (process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'sepolia' | 'holesky') || 'mainnet'

      // Upload to avatar service
      const result = await uploadAvatar({
        file: selectedFile,
        subname: subname.fullName,
        network,
      })

      // Update ENS avatar text record
      await updateEnsAvatar({
        subname: subname.fullName,
        avatarUrl: result.avatarUrl,
      })

      onSuccess()
    } catch (err: any) {
      showErrorToast(`Failed to upload avatar: ${err.message}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Avatar Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            <Image 
              src={previewUrl} 
              alt="Avatar preview" 
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 button-primary rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

