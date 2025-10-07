import { createConfig } from "@privy-io/wagmi";
import { mainnet, sepolia, base, baseSepolia } from "viem/chains";
import { http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

