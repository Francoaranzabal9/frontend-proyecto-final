import { useState, useEffect, useRef } from 'react';

const PriceRangeSlider = ({ min, max, onChange, minLimit, maxLimit }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const getPercent = (value) => Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100);

  useEffect(() => {
    setMinVal(min);
    minValRef.current = min;
  }, [min]);

  useEffect(() => {
    setMaxVal(max);
    maxValRef.current = max;
  }, [max]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ min: minVal, max: maxVal });
    }, 500);
    return () => clearTimeout(timeout);
  }, [minVal, maxVal]);

  return (
    <div className="slider-container">
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > maxLimit - 100 && "5" }}
      />
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>

      <div className="slider__values">
        <div className="slider__value">${minVal.toLocaleString()}</div>
        <div className="slider__value">${maxVal.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
