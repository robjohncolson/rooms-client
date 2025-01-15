import { useState } from 'react';
import './QRCodeButton.css';

const QRCodeButton = () => {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <button 
        className="qr-button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the app's click handler
          setShowQR(!showQR);
        }}
      >
        Share Room
      </button>

      {showQR && (
        <div 
          className="qr-modal"
          onClick={(e) => e.stopPropagation()} // Prevent triggering the app's click handler
        >
          <div className="qr-content">
            <img 
              src="/qr-dino.png" 
              alt="QR Code with dinosaur" 
              className="qr-image"
              width="256"
              height="256"
            />
            <p>Scan to join the room</p>
            <button 
              className="close-button"
              onClick={() => setShowQR(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeButton; 