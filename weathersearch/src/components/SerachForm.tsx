import React, { useState } from 'react';
import Select from 'react-select';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import NoRecord from './NoRecord';
import ResultsTabs from './Results';

const usStates = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, 
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }];

const googleApiKey = 'AIzaSyC3CkllDKmcg7dPSQR1kYBd-b85SBMLVbo';

const SearchForm: React.FC = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<{ value: string; label: string } | null>(null);
  // AUTO DETECT HOOKS
  const [detectedCity, setDetectedCity] = useState(''); 
  const [detectedState, setDetectedState] = useState('');
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(false);
  
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // NO-RECORD HOOK
  const [showNoRecord, setShowNoRecord] = useState(false);
  
  // FOR DISPLAYING THE RESULTS
  const [backendData, setBackendData] = useState<any[]>([]);  
  const [displayResults, setDisplayResults] = useState(false);
  const [displayCity, setDisplayCity] = useState('');
  const [displayState, setDisplayState] = useState('');
  

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

  const fetchWeatherDataFromBackend = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`http://localhost:5001/testweather?lat=${latitude}&lng=${longitude}`);
  
      if (response.status === 200) {
        const data = await response.json();
        console.log("Data from backend:", data);
        setShowNoRecord(false);
        setBackendData(data);
        setDisplayResults(true);
      } else {
        console.error(`Error: Received status code ${response.status}`);
        setShowNoRecord(true);
        setBackendData([]);
        setDisplayResults(false);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      setShowNoRecord(true);
      setBackendData([]);
      setDisplayResults(false);
    }
  };
  

  const getGeocodeDate = async() => {
    setBackendData([]);
    setDisplayResults(false); 
    if (!state) {
      console.error("State is missing");
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
    setBackendData([]);
    setDisplayResults(false); 
    console.log({ street, city, state, autoDetectEnabled, latLng });
    if (autoDetectEnabled && latLng) {
      fetchWeatherDataFromBackend(latLng.lat, latLng.lng);
    } else if (!autoDetectEnabled) {
      getGeocodeDate();
    }
    setDisplayCity(autoDetectEnabled ? detectedCity : city);
    setDisplayState(autoDetectEnabled ? detectedState: state?.label || '');
  };

  const handleClear = () => {
    setStreet('');
    setCity('');
    setState(null);
    setAutoDetectEnabled(false);
    setCityOptions([]);
    setLatLng(null);
    setErrors({ street: false, city: false, state: false });
    setDisplayResults(false);
    setBackendData([]);
    setShowNoRecord(false);
    setDisplayCity('');
    setDisplayState('');
  };

  const toggleAutoDetect = async () => {
    setAutoDetectEnabled((prev) => !prev);
    if (!autoDetectEnabled) {
      setLoadingLocation(true);
      try {
        const response = await fetch(`https://ipinfo.io/?token=3ce693acafe8d1`);
        const data = await response.json();
        const [lat, lng] = data.loc.split(',').map(Number);
        setDetectedCity(data.city);
        setDetectedState(data.region);
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
        <div className="container">
          <div className="card p-4 shadow-sm" style={{ backgroundColor: '#f8f8f8' }}>
            <h4 className="text-center mb-4">Weather Search 🌤️</h4>
            <form onSubmit={handleSubmit}>
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="d-flex justify-content-center align-items-center mb-3">
              <label className="form-check-label" htmlFor="autodetectCheckbox">
                    Autodetect Location<span className="text-danger">*</span>
                </label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autodetectCheckbox"
                    checked={autoDetectEnabled}
                    onChange={toggleAutoDetect}
                  />
                  <span>Current Location</span>
                </div>
              </div>

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
          <div className="d-flex justify-content-center mt-4 gap-3">
            <a href="#results" className="btn btn-primary">Results</a>
            <a href="#favorites" className="btn btn-link">Favorites</a>
          </div>
          <div>
            {displayResults && backendData ? <ResultsTabs data={backendData} city={displayCity} state={displayState} latitude={latLng?.lat || 0} longitude={latLng?.lat || 0}/> : (showNoRecord && <NoRecord />)}         
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchForm;
