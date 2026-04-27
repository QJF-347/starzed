import React from 'react';
import * as Icons from 'lucide-react';

/**
 * A reusable component that renders a Lucide icon by its name.
 * @param {string} name - The name of the Lucide icon (e.g., 'Shield', 'Car', 'Heart').
 * @param {number} size - The size of the icon (default: 24).
 * @param {string} className - Optional CSS class name.
 * @returns {JSX.Element|null} The rendered icon or null if not found.
 */
const LucideIcon = ({ name, size = 24, className = '' }) => {
    // Safety check: ensure Icons object exists and name is valid
    if (!Icons || typeof Icons !== 'object' || !name) {
        // Return a default fallback icon if Icons is not available or name is invalid
        return <div className={`icon-fallback ${className}`} style={{ width: size, height: size }}></div>;
    }

    // Try to find the icon component in the lucide-react library
    const IconComponent = Icons[name];

    if (!IconComponent || typeof IconComponent !== 'function') {
        // Return a default fallback icon (Shield) if the requested one isn't found
        const FallbackIcon = Icons.Shield;
        if (FallbackIcon && typeof FallbackIcon === 'function') {
            return <FallbackIcon size={size} className={className} />;
        }
        // Ultimate fallback
        return <div className={`icon-fallback ${className}`} style={{ width: size, height: size }}></div>;
    }

    return <IconComponent size={size} className={className} />;
};

export default LucideIcon;
