import { trpc } from "@/utils/trpc";
import Image from "next/image";
import React from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  image: string;
}

export function WhatsAppButton({
  phoneNumber = `${process.env.NEXT_PUBLIC_NOMOR_ADMIN}`,
  message = "",
  label = "Chat with us",
  size = "md",
  showLabel = true,
  className = "",
  image
}: WhatsAppButtonProps) {
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}${
    message ? `?text=${encodedMessage}` : ""
  }`;

  const sizeClasses = {
    sm: "text-xs px-2 py-1 space-x-1",
    md: "text-sm px-3 py-2 space-x-2",
    lg: "text-base px-4 py-3 space-x-3",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-8 right-8 flex items-center transition-all duration-300 ${className}`}
    >
      <div className="relative size-32 md:size-64 p-2 flex items-center justify-center overflow-hidden">
        <Image
          src={image || "https://res.cloudinary.com/dazayhg7s/image/upload/v1742701209/HELPDESK_ICON_ti2xn7.png"}
          alt="WhatsApp"
          width={1000}
          height={1000}
          objectFit="contain"
          className="p-2"
        />
        {showLabel && (
          <span className="absolute -top-10 whitespace-nowrap bg-gray-800 text-white px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {label}
          </span>
        )}
      </div>
    </a>
  );
}