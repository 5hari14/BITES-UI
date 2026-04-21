import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { countries, getCitiesForCountry } from '@/lib/locations';
import { MapPin, ChevronDown, Check, Globe, X, ArrowLeft } from 'lucide-react';

type Step = 'closed' | 'country' | 'city';

export default function LocationSelector() {
  const { selectedCountry, selectedCity, setLocation } = useApp();
  const { c, isDark } = useBiteTheme();
  const [step, setStep] = useState<Step>('closed');
  const [pendingCountry, setPendingCountry] = useState(selectedCountry);
  const [phoneFrame, setPhoneFrame] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = document.querySelector('[data-phone-frame]') as HTMLElement || document.getElementById('phone-frame');
    if (frame) setPhoneFrame(frame);
  }, []);

  const currentCountry = countries.find(co => co.name === selectedCountry);
  const cities = getCitiesForCountry(pendingCountry);
  const pendingCountryData = countries.find(co => co.name === pendingCountry);

  const handleCountrySelect = (countryName: string) => {
    setPendingCountry(countryName);
    setStep('city');
  };

  const handleCitySelect = (cityName: string) => {
    setLocation(pendingCountry, cityName, 'All Areas');
    setStep('closed');
  };

  const handleAllCities = () => {
    setLocation(pendingCountry, 'All Cities', 'All Areas');
    setStep('closed');
  };

  // Build the label for the trigger button
  let label = '';
  if (selectedCity === 'All Cities') {
    label = `${currentCountry?.flag || '📍'} ${selectedCountry}`;
  } else {
    label = `${currentCountry?.flag || '📍'} ${selectedCity}`;
  }

  const getTitle = () => {
    if (step === 'country') return 'Select Country';
    if (step === 'city') return 'Select City';
    return '';
  };

  const handleBack = () => {
    if (step === 'city') setStep('country');
    else setStep('closed');
  };

  const overlayPanel = step !== 'closed' && phoneFrame ? createPortal(
    <div
      className="absolute inset-0 z-[60] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setStep('closed');
      }}
    >
      <div className="flex-shrink-0" style={{ height: 90 }} />

      <div
        className="mx-4 rounded-2xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(22,22,22,0.98)' : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${c.border}`,
          boxShadow: isDark
            ? '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 16px 48px rgba(0,0,0,0.2)',
          maxHeight: 'calc(100% - 180px)',
          animation: 'fadeInUp 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3.5"
          style={{ borderBottom: `1px solid ${c.divider}` }}
        >
          <div className="flex items-center gap-2">
            {step !== 'country' ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-[13px] font-semibold transition-colors"
                style={{ color: c.accent }}
              >
                <ArrowLeft size={15} />
              </button>
            ) : (
              <Globe size={15} style={{ color: c.accent }} />
            )}
            {step === 'country' ? (
              <span className="text-[14px] font-bold" style={{ color: c.text }}>
                {getTitle()}
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold" style={{ color: c.text }}>
                  {pendingCountryData?.flag} {pendingCountry}
                </span>
                <span className="text-[11px]" style={{ color: c.textDim }}>·</span>
                <span className="text-[13px] font-semibold" style={{ color: c.accent }}>
                  {getTitle()}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setStep('closed')}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: c.textDim, background: `${c.textDim}15` }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-1.5 py-2.5" style={{ borderBottom: `1px solid ${c.divider}` }}>
          {['country', 'city'].map((s) => (
            <div
              key={s}
              className="rounded-full transition-all"
              style={{
                width: step === s ? 16 : 6,
                height: 6,
                background: step === s ? c.accent
                  : (s === 'country') ? `${c.accent}60` : `${c.textDim}30`,
              }}
            />
          ))}
          <span className="text-[10px] ml-2 font-medium" style={{ color: c.textDim }}>
            Step {step === 'country' ? 1 : 2} of 2
          </span>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
          {/* COUNTRY LIST */}
          {step === 'country' && countries.map(country => {
            const isSelected = country.name === selectedCountry;
            const totalPlaces = country.cities.reduce((s, ci) => s + ci.venueCount, 0);
            return (
              <button
                key={country.name}
                onClick={() => handleCountrySelect(country.name)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.98]"
                style={{
                  background: isSelected ? `${c.accent}12` : 'transparent',
                  borderBottom: `1px solid ${c.divider}`,
                }}
              >
                <span className="text-xl flex-shrink-0">{country.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-[14px] font-semibold" style={{ color: c.text }}>
                    {country.name}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: c.textDim }}>
                    {country.cities.length} cities · {totalPlaces} places
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: c.accent }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}

          {/* CITY LIST */}
          {step === 'city' && (
            <>
              <button
                onClick={handleAllCities}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.98]"
                style={{
                  background: selectedCity === 'All Cities' && pendingCountry === selectedCountry ? `${c.accent}12` : 'transparent',
                  borderBottom: `1px solid ${c.divider}`,
                }}
              >
                <span className="text-xl flex-shrink-0">🌐</span>
                <div className="flex-1 text-left">
                  <div className="text-[14px] font-semibold" style={{ color: c.text }}>All Cities</div>
                  <div className="text-[11px] mt-0.5" style={{ color: c.textDim }}>
                    {cities.reduce((s, ci) => s + ci.venueCount, 0)} places total
                  </div>
                </div>
                {selectedCity === 'All Cities' && pendingCountry === selectedCountry && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: c.accent }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </button>

              {cities.map(city => {
                const isSelected = city.name === selectedCity && pendingCountry === selectedCountry;
                return (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city.name)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.98]"
                    style={{
                      background: isSelected ? `${c.accent}12` : 'transparent',
                      borderBottom: `1px solid ${c.divider}`,
                    }}
                  >
                    <span className="text-xl flex-shrink-0">{city.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="text-[14px] font-semibold" style={{ color: c.text }}>{city.name}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: c.textDim }}>
                        {city.venueCount} places · {city.neighborhoods.length} areas
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: c.accent }}>
                        <Check size={12} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>,
    phoneFrame
  ) : null;

  return (
    <>
      <button
        onClick={() => {
          setPendingCountry(selectedCountry);
          setStep(step === 'closed' ? 'country' : 'closed');
        }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-95"
        style={{
          background: step !== 'closed' ? `${c.accent}20` : c.surface,
          border: `1px solid ${step !== 'closed' ? c.accent : c.border}`,
          color: c.text,
        }}
      >
        <MapPin size={13} style={{ color: c.accent }} />
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown
          size={13}
          style={{ color: c.textDim, transform: step !== 'closed' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>
      {overlayPanel}
    </>
  );
}
