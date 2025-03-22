"use client"

import { URL_LOGO } from "@/constants"
import Image from "next/image"
import { useEffect, useState, type ReactNode } from "react"

export function AuthPage({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (    
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: mounted ? "url('/bg-auth.webp')" : "none",
        backgroundColor: "#f5f5f5", 
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0" />

      {/* Content container */}
      <div className="w-full max-w-md z-10 relative">
        {/* Logo or branding at the top */}
        <div className="flex justify-center ">
            <Image src={URL_LOGO as string} alt="Logo" width={200} height={100} className="h-full w-auto" />
        </div>

        <div className=" backdrop-blur-md rounded-xl shadow-xl overflow-hidden relative">
          <div className="p-8">{children}</div>       
        </div>

        {/* Footer text */}
        <div className="text-center mt-6 text-white text-md">
          <p>© {new Date().getFullYear()} VazzUniverse. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}

