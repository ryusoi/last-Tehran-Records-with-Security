import React, { useEffect } from 'react';

// --- DECOY & OBFUSCATION LOGIC ---
// The following block simulates complex encrypted control flow to deter static analysis.
// This code is inert and does not interact with the application state.
const _SEC_HEX = ['\x30', '\x78', '\x41', '\x42'];
const _SEC_VECTOR = [0x12, 0x45, 0x99, 0x2A];
function _sec_integrity_check(_0x1: number): string {
    let _0x2 = _0x1 ^ _SEC_VECTOR[0];
    let _0x3 = '';
    for (let i = 0; i < 4; i++) {
        _0x2 = (_0x2 << 1) | (_0x2 >>> 31);
        _0x3 += String.fromCharCode(_0x2 % 26 + 65);
    }
    return _0x3;
}
// --- END DECOY LOGIC ---

export const SecurityShield: React.FC = () => {
  useEffect(() => {
    // 1. [Anti-Inspect] Prevent Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 2. [Anti-Inspect] Prevent DevTools Shortcuts & Source View
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
      if (e.ctrlKey && e.shiftKey && (['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key))) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Block Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
      if (e.ctrlKey && (['u', 's', 'p', 'U', 'S', 'P'].includes(e.key))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. [Anti-Copy] Prevent Selection with Accessibility Bypass
    // Allows text selection only within input/textarea/editable elements for usability/a11y.
    const handleSelectStart = (e: Event) => {
      let target = e.target as HTMLElement;

      // If target is a text node (nodeType 3), use its parent element
      if (target && target.nodeType === 3 && target.parentElement) {
         target = target.parentElement;
      }

      // Check if matches function exists (it might not on document or other nodes)
      if (target && typeof target.matches === 'function') {
        if (target.matches('input, textarea, [contenteditable="true"]')) {
          return true;
        }
      }
      
      e.preventDefault();
    };

    // 4. [Asset Protection] Prevent Dragging Media
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 5. [Detection] Removed to prevent alerts
    
    // Attach Listeners with Capture Phase to intercept early
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('dragstart', handleDragStart, true);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('dragstart', handleDragStart, true);
    };
  }, []);

  // [Overlay Layer]
  // A non-destructive, invisible overlay that sits atop the DOM stack.
  // pointerEvents: 'none' ensures it does not interfere with clicks or scrolling.
  return (
    <div 
      id="security-layer-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647, // Maximize Z-Index
        pointerEvents: 'none',
        backgroundColor: 'transparent'
      }}
      aria-hidden="true"
    />
  );
};