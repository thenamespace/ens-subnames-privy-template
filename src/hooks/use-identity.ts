import { useEnsName, useEnsAvatar } from 'wagmi'
import { usePreferredIdentity } from './use-subnames'
import { mainnet } from 'wagmi/chains'

export function useIdentity(address: string | undefined) {
  // Fetch ENS name and avatar
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: mainnet.id,
  })
  
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id,
  })

  // Get subname/username data and preferred identity
  const { name, avatarSrc, isLoading, hasSubnames, subname, refetch } = usePreferredIdentity({
    address,
    fallbackName: ensName || undefined,
    fallbackAvatar: ensAvatar || undefined,
  })

  // Generate deterministic emoji/color fallback if no avatar
  const getDeterministicEmoji = (addr: string) => {
    const emojis = ['🌟', '🎨', '🚀', '🌈', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎼', '🎹', '🎬', '🎮', '🏆', '🏀', '⚽', '🎾', '🏈', '🏐']
    const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return emojis[hash % emojis.length]
  }

  const getDeterministicColor = (addr: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-400 to-pink-400',
      'bg-gradient-to-br from-blue-400 to-cyan-400',
      'bg-gradient-to-br from-green-400 to-emerald-400',
      'bg-gradient-to-br from-orange-400 to-red-400',
      'bg-gradient-to-br from-indigo-400 to-purple-400',
      'bg-gradient-to-br from-pink-400 to-rose-400',
      'bg-gradient-to-br from-yellow-400 to-orange-400',
      'bg-gradient-to-br from-teal-400 to-cyan-400',
    ]
    const hash = addr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const fallbackEmoji = address ? getDeterministicEmoji(address) : '👤'
  const fallbackColor = address ? getDeterministicColor(address) : 'bg-gray-400'

  return {
    name,
    avatarSrc,
    fallbackEmoji,
    fallbackColor,
    isLoading,
    hasSubnames,
    subname,
    ensName,
    ensAvatar,
    refetch,
  }
}

