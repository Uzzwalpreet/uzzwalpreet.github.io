import React, { useState } from 'react';
import Select from 'react-select';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import NoRecord from './NoRecord';

const usStates = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, /* other states here */ { value: 'WY', label: 'Wyoming' }
];

const googleApiKey = 'AIzaSyC3CkllDKmcg7dPSQR1kYBd-b85SBMLVboa';

const SearchForm: React.FC = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<{ value: string; label: string } | null>(null);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(false);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showNoRecord, setShowNoRecord] = useState(false);

  const [errors, setErrors] = useState({
    street: false,
    city: false,
    state: false,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries: ['places'],
  });

  const validateField = (fieldName: string, value: string | { value: string; label: string } | null) => {
    let isValid = true;

    if (typeof value === 'string' && (!value.trim() || value === '')) {
      isValid = false;
    } else if (fieldName === 'state' && !value) {
      isValid = false;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: !isValid,
    }));

    return isValid;
  };

  const handleBlur = (fieldName: string, value: string | { value: string; label: string } | null) => {
    validateField(fieldName, value);
  };

  const fetchWeatherDataFromBackend = async (latitude: number, longitude : number) => {
    try {
      const resposne = await fetch(`http://localhost:5001/testweather?lat=${latitude}&lng=${longitude}`);
      const data = await resposne.json();
      console.log("Data from backend:", data);
      setShowNoRecord(false);
    } catch (error) {
      setShowNoRecord(true);
    }
  };

  const getGeocodeDate = async() => {
    if (!state) {
      console.error("State is required");
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street)},${encodeURIComponent(city)},${encodeURIComponent(state.label)}&key=${googleApiKey}`;
    console.log(url)
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLatLng({lat : location.lat, lng : location.lng});
        console.log("Geocode Location", location);
        setShowNoRecord(false);
        fetchWeatherDataFromBackend(location.lat, location.lng);
      } else {
        setShowNoRecord(true);
      }
    } catch(error) {
        setShowNoRecord(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ street, city, state, autoDetectEnabled, latLng });
    if (autoDetectEnabled && latLng) {
      fetchWeatherDataFromBackend(latLng.lat, latLng.lng);
    } else if (!autoDetectEnabled) {
      getGeocodeDate();
    }
  };

  const handleClear = () => {
    setStreet('');
    setCity('');
    setState(null);
    setAutoDetectEnabled(false);
    setCityOptions([]);
    setLatLng(null);
    setErrors({ street: false, city: false, state: false });
  };

  const toggleAutoDetect = async () => {
    setAutoDetectEnabled((prev) => !prev);
    if (!autoDetectEnabled) {
      setLoadingLocation(true);
      try {
        const response = await fetch(`https://ipinfo.io/?token=3ce693acafe8d1`);
        const data = await response.json();
        const [lat, lng] = data.loc.split(',').map(Number);
        setLatLng({ lat, lng });
      } catch (error) {
        console.error("Failed to fetch location data", error);
      } finally {
        setLoadingLocation(false);
      }
    } else {
      setLatLng(null);
    }
  };

  // Function to check if form is valid for enabling the Search button
  const isFormValid = () => {
    return (
      (autoDetectEnabled && latLng) || // Enable if location is detected
      (!autoDetectEnabled &&
        street.trim() !== '' &&
        city.trim() !== '' &&
        state !== null &&
        !errors.street &&
        !errors.city &&
        !errors.state)
    );
  };

  return (
    <div>
      {isLoaded ? (
        <div className="container mt-5">
          <div className="card p-4 shadow-sm" style={{ backgroundColor: '#f8f8f8' }}>
            <h4 className="text-center mb-4">Weather Search 🌤️</h4>
            <form onSubmit={handleSubmit}>
              {/* Street Input */}
              <div className="row mb-3">
                <label htmlFor="streetInput" className="col-sm-2 col-form-label">
                  Street<span className="text-danger">*</span>
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="streetInput"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    onBlur={() => handleBlur('street', street)}
                    disabled={autoDetectEnabled}
                    required
                    style={errors.street ? { borderColor: 'red' } : {}}
                  />
                  {errors.street && <div className="text-danger">Please enter a valid street</div>}
                </div>
              </div>

              {/* City Input */}
              <div className="row mb-3">
                <label htmlFor="cityInput" className="col-sm-2 col-form-label">
                  City<span className="text-danger">*</span>
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="cityInput"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() => handleBlur('city', city)}
                    disabled={autoDetectEnabled}
                    required
                    style={errors.city ? { borderColor: 'red' } : {}}
                  />
                  {errors.city && <div className="text-danger">Please enter a valid city</div>}
                </div>
              </div>

              {/* State Select */}
              <div className="row mb-3">
                <label htmlFor="stateSelect" className="col-sm-2 col-form-label">
                  State<span className="text-danger">*</span>
                </label>
                <div className="col-sm-10">
                  <Select
                    id="stateSelect"
                    options={usStates}
                    value={state}
                    onChange={(selectedOption) => setState(selectedOption)}
                    onBlur={() => handleBlur('state', state)}
                    isDisabled={autoDetectEnabled}
                    placeholder="Select your state"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderColor: errors.state ? 'red' : provided.borderColor,
                      }),
                    }}
                    isClearable
                  />
                </div>
              </div>

              <hr className="my-4" />

              {/* Autodetect Location Checkbox */}
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autodetectCheckbox"
                    checked={autoDetectEnabled}
                    onChange={toggleAutoDetect}
                  />
                  <label className="form-check-label" htmlFor="autodetectCheckbox">
                    Autodetect Location<span className="text-danger">*</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  disabled={!isFormValid() || loadingLocation}
                >
                  <i className="bi bi-search"></i> Search
                </button>
                <button type="button" className="btn btn-secondary d-flex align-items-center gap-2" onClick={handleClear}>
                  <i className="bi bi-list"></i> Clear
                </button>
              </div>
            </form>
          </div>

          {/* Results and Favorites Links */}
          <div className="d-flex justify-content-center mt-4 gap-3">
            <a href="#results" className="btn btn-primary">Results</a>
            <a href="#favorites" className="btn btn-link">Favorites</a>
          </div>
          <div>
            {showNoRecord ? <NoRecord/> : null}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchForm;
