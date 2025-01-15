import { useState } from 'react';
import './ColorPicker.css';

function ColorPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (channel, newValue) => {
    const updatedColor = { ...value, [channel]: parseInt(newValue) };
    onChange(updatedColor);
  };

  const cmykToRgb = (c, m, y, k) => {
    let r = 255 * (1 - c / 100) * (1 - k / 100);
    let g = 255 * (1 - m / 100) * (1 - k / 100);
    let b = 255 * (1 - y / 100) * (1 - k / 100);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const colorPreview = cmykToRgb(value.c, value.m, value.y, value.k);

  return (
    <div className="color-picker">
      <button 
        className="color-preview"
        style={{ backgroundColor: colorPreview }}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="color-sliders">
          <div className="slider-group">
            <label>C</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.c}
              onChange={(e) => handleChange('c', e.target.value)}
            />
            <span>{value.c}%</span>
          </div>
          
          <div className="slider-group">
            <label>M</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.m}
              onChange={(e) => handleChange('m', e.target.value)}
            />
            <span>{value.m}%</span>
          </div>
          
          <div className="slider-group">
            <label>Y</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.y}
              onChange={(e) => handleChange('y', e.target.value)}
            />
            <span>{value.y}%</span>
          </div>
          
          <div className="slider-group">
            <label>K</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.k}
              onChange={(e) => handleChange('k', e.target.value)}
            />
            <span>{value.k}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker; 