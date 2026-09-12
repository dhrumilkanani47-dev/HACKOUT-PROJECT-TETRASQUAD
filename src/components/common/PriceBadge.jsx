import React from 'react';
import { getPriceStatus } from '../../utils/constants';

export const PriceBadge = ({ price, size = 'sm', showPrice = false, priceType = null }) => {
  const status = getPriceStatus(price);

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5 font-semibold',
    lg: 'text-base px-4 py-2 font-bold'
  };

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span className={`inline-flex items-center gap-1.5 rounded-full border font-heading font-medium tracking-wide ${status.color} ${sizeClasses[size]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        <span>{status.label}</span>
        {showPrice && <span>• ₹{Number(price).toFixed(2)}/kWh</span>}
      </span>
      {priceType && (
        <span className="text-[9px] text-ink-soft dark:text-ink-muted pl-1">
          {priceType}
        </span>
      )}
    </div>
  );
};
