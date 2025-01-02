import React from 'react';
import PropTypes from 'prop-types';
import profile from '../assets/profile.png';

export const Avatar = ({ imageUrl, size = "md", className = "" }) => {
    // Define fixed pixel values as a fallback
    const sizeClasses = {
      sm: "w-8 h-8 min-w-[2rem] min-h-[2rem]",
      md: "w-12 h-12 min-w-[3rem] min-h-[3rem]",
      lg: "w-16 h-16 min-w-[4rem] min-h-[4rem]",
      xlg: "w-24 h-24 min-w-[5rem] min-h-[5rem]",
    };
    
    Avatar.propTypes = {
      imageUrl: PropTypes.string,
      size: PropTypes.oneOf(["sm", "md", "lg", "xl", "xlg"]),
      className: PropTypes.string
    };

    return (
      <div 
        className={`inline-block ${sizeClasses[size]} relative rounded-full overflow-hidden ${className}`}
        style={{ aspectRatio: '1/1' }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <img 
              src={profile} 
              alt="Avatar" 
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
        )}
      </div>
    );
};