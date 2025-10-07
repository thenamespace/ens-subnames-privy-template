"use client"

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useBalance } from 'wagmi'
import { useIdentity } from '@/hooks/use-identity'
import { AccountModal } from './account-modal'

export function ProfileButton() {
  const { login, authenticated } = usePrivy()
  const { address } = useAccount()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { 
    name, 
    avatarSrc, 
    fallbackEmoji, 
    fallbackColor,
    isLoading,
    hasSubnames,
    subname,
    refetch 
  } = useIdentity(address)

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  })

  // Disconnected state
  if (!authenticated) {
    return (
      <button
        onClick={() => login()}
        className="button-primary rounded-full px-6 py-2 font-medium"
      >
        Connect Wallet
      </button>
    )
  }

  // Connected state - account chip
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={name || 'Avatar'} 
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-lg ${fallbackColor}`}>
              {fallbackEmoji}
            </div>
          )}
        </div>

        {/* Name and optional balance */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {isLoading ? '...' : name}
          </span>
          {balance && (
            <span className="text-xs text-gray-500">
              {parseFloat(balance.formatted).toFixed(3)} {balance.symbol}
            </span>
          )}
        </div>
      </button>

      {/* Account Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={address}
        name={name}
        avatarSrc={avatarSrc}
        fallbackEmoji={fallbackEmoji}
        fallbackColor={fallbackColor}
        balance={balance}
        hasSubnames={hasSubnames}
        subname={subname}
        refetchIdentity={refetch}
      />
    </>
  )
}

