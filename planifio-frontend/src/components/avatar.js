import React from 'react';

export const Avatar = ({ imageUrl, size = "md", className = "" }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-24 h-24"
    };

    console.log(imageUrl);

    // the image is in base64 format so we need to convert it to a file
    // const file = new File([new Blob([new Uint8Array(imageUrl)])], "profile.png", { type: "image/png" });
  
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${className}`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <img src="/assets/profile.png" alt="Avatar" className="w-1/2 h-1/2" />
          </div>
        )}
      </div>
    );
  };