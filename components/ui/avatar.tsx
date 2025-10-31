"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image, { ImageProps } from "next/image"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

interface AvatarImageProps extends Omit<ImageProps, 'alt' | 'src'> {
  alt?: string;
  src?: string | null;
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  ({ className, alt = '', src, ...props }, ref) => (
    <div ref={ref} className={cn("relative aspect-square h-full w-full", className)}>
      {src && (
        <Image
          fill
          src={src}
          alt={alt}
          className="object-cover"
          {...props}
        />
      )}
    </div>
  )
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
