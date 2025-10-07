"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useSignMessage } from "wagmi";
import Image from "next/image";
import { ToastContainer } from "react-toastify";

import { FullScreenLoader } from "@/components/ui/fullscreen-loader";
import { Header } from "@/components/ui/header";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { showSuccessToast, showErrorToast } from "@/components/ui/custom-toast";

function Home() {
  const { ready, authenticated, logout, login, user } = usePrivy();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Render loading state until Privy is ready
  
  if (!ready) {
    return <FullScreenLoader />;
  }

  const handleSignMessage = async () => {
    try {
      const signature = await signMessageAsync({
        message: "Hello from Ethereum!",
      });
      showSuccessToast(`Message signed: ${signature.slice(0, 10)}...`);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to sign message");
    }
  };

  return (
    <div className="bg-[#E0E7FF66] min-h-screen">
      <Header />
      {authenticated ? (
        <section className="w-full flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-abc-favorit font-medium">
                Wallet Dashboard
              </h2>
              <button className="button" onClick={logout}>
                <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} /> Logout
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  User ID
                </h3>
                <p className="font-mono text-sm break-all">{user?.id}</p>
              </div>

              {/* Wallet Address */}
              {isConnected && address && (
                <div className="border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Wallet Address
                  </h3>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
              )}

              {/* Sign Message Demo */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  Sign with Ethereum
                </h3>
                <button
                  className="button-primary w-full"
                  onClick={handleSignMessage}
                  disabled={!isConnected}
                >
                  Sign Message
                </button>
              </div>

              {/* User Object */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  User Object
                </h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-xs">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full flex flex-row justify-center items-center h-[calc(100vh-60px)] relative">
          <Image
            src="./BG.svg"
            alt="Background"
            fill
            style={{ objectFit: "cover", zIndex: 0 }}
            priority
          />
          <div className="z-10 flex flex-col items-center justify-center w-full h-full">
            <div className="text-center mt-4 text-white text-7xl font-medium font-abc-favorit leading-[81.60px]">
              Welcome
            </div>
            <div className="text-center text-white text-xl font-normal leading-loose mt-8">
              Secure EVM wallet authentication
            </div>
            <button
              className="bg-white text-brand-off-black mt-15 w-full max-w-md rounded-full px-4 py-2 hover:bg-gray-100 lg:px-8 lg:py-4 lg:text-xl font-medium"
              onClick={() => {
                login();
                setTimeout(() => {
                  (document.querySelector('input[type="email"]') as HTMLInputElement)?.focus();
                }, 150);
              }}
            >
              Get started
            </button>
          </div>
        </section>
      )}
  
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        limit={1}
        aria-label="Toast notifications"
        style={{ top: 58 }}
      />
    </div>
  );
}

export default Home;
