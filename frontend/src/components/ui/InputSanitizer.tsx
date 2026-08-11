'use client';

import { useEffect } from 'react';

export default function InputSanitizer() {
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      
      if (target && target.tagName === 'INPUT' && target.type === 'number') {
        const val = target.value;
        
        // Check for leading zero (e.g. "01", "0140"), but allow single "0" or decimal "0.5"
        if (/^0\d/.test(val)) {
          const cleanVal = val.replace(/^0+(?=\d)/, '');
          
          // Use native setter to trigger React's controlled input updates properly
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(target, cleanVal);
            target.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    };

    // Use capturing phase to intercept input events globally
    document.addEventListener('input', handleInput, true);
    
    return () => {
      document.removeEventListener('input', handleInput, true);
    };
  }, []);

  return null;
}
