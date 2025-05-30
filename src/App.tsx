import React, { Suspense, useEffect } from 'react';
import { PaletteIcon, EraserIcon, Trash2Icon, EyeIcon, EyeOffIcon, Rotate3dIcon } from 'lucide-react';
import DrawingCanvas from './components/DrawingCanvas';
import ColorPicker from './components/ColorPicker';
import { useDrawStore } from './store/drawStore';

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function App() {
  const { 
    currentColor, 
    setCurrentColor, 
    clearLines,
    showColorPicker,
    toggleColorPicker,
    showLines,
    toggleLineVisibility,
    isErasing,
    toggleEraser,
    cameraEnabled,
    toggleCamera
  } = useDrawStore();

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    
    // Prevent default touch behavior
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);

    // Set initial viewport height
    setViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  return (
    <div className="relative w-screen bg-black text-white overflow-hidden" style={{ height: 'calc(var(--vh) * 100)' }}>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading...</div>}>
        <DrawingCanvas />
      </Suspense>
      
      {/* Control Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full">
        <button 
          onClick={toggleColorPicker} 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-800"
          aria-label="Color picker"
        >
          <div className="relative">
            <PaletteIcon size={24} />
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full" 
              style={{ backgroundColor: currentColor }}
            />
          </div>
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <button 
          onClick={toggleEraser}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-800 relative ${
            isErasing ? 'bg-red-900/50 ring-2 ring-red-500 ring-opacity-50' : ''
          }`}
          aria-label="Eraser"
        >
          <EraserIcon size={20} />
          {isErasing && (
            <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/20" />
          )}
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <button 
          onClick={toggleCamera}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-800 relative ${
            cameraEnabled ? 'bg-blue-900/50 ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}
          aria-label="Toggle camera controls"
        >
          <Rotate3dIcon size={20} />
          {cameraEnabled && (
            <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20" />
          )}
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <button 
          onClick={toggleLineVisibility}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-gray-800"
          aria-label={showLines ? "Hide lines" : "Show lines"}
        >
          {showLines ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <button 
          onClick={clearLines}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-red-900"
          aria-label="Clear canvas"
        >
          <Trash2Icon size={20} />
        </button>
      </div>
      
      {/* Color Picker */}
      {showColorPicker && (
        <ColorPicker 
          currentColor={currentColor} 
          onChange={setCurrentColor} 
          onClose={toggleColorPicker}
        />
      )}
    </div>
  );
}

export default App;