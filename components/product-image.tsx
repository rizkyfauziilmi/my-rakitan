'use client';

import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  imageUrl: string;
  altText: string;
}

export function ProductImage({ imageUrl, altText }: ProductImageProps) {
  const [errorImage, setErrorImage] = useState(false);

  return imageUrl && !errorImage ? (
    <Image
      src={imageUrl}
      alt={altText}
      width={80}
      height={80}
      onError={() => setErrorImage(true)}
      onLoad={() => setErrorImage(false)}
      className="h-full w-full rounded-md object-cover"
    />
  ) : (
    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-md">
      <ImageOff />
    </div>
  );
}
