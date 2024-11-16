import React, { useState } from 'react';
import Select from 'react-select';
import { LoadScriptNext, useLoadScript, Libraries } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NoRecord from './NoRecord';
import ResultsTabs from './Results';
import Favorites from './Favorites';

const usStates = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },{ value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, 
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }];

const googleApiKey = 'AIzaSyC3CkllDKmcg7dPSQR1kYBd-b85SBMLVbo';

const SearchForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<{ value: string; label: string } | null>(null);
  const [detectedCity, setDetectedCity] = useState(''); 
  const [detectedState, setDetectedState] = useState('');
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [showNoRecord, setShowNoRecord] = useState(false);
  
  const [backendData, setBackendData] = useState<any[]>([]);  
  const [displayResults, setDisplayResults] = useState(false);
  const [displayCity, setDisplayCity] = useState('');
  const [displayState, setDisplayState] = useState('');
  const [favorites, setFavorites] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Results');
  
  const [progress, setProgress] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);

  const [errors, setErrors] = useState({
    street: false,
    city: false,
    state: false,
  });

  const libraries: Libraries = ['places']; 

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries, 
  });

  const fetchCitySuggestions = (input: string) => {
    if (!input) {
      setCityOptions([]);
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input,
        types: ['(cities)'],
        componentRestrictions: { country: 'us' },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.map((prediction) => ({
            value: prediction.place_id,
            label: prediction.structured_formatting.main_text,
          }));
          setCityOptions(suggestions);
        } else {
          setCityOptions([]);
        }
      }
    );
  };

  const handleCityInputChange = (input: string) => {
    setCity(input);
    fetchCitySuggestions(input);
  };

  const validateField = (fieldName: string, value: string | { value: string; label: string } | null) => {
    let isValid = true;
  
    if (fieldName === 'city') {
      isValid =
        value !== null &&
        typeof value === 'string' &&
        value.trim() !== '' &&
        cityOptions.some((option) => option.label === value);
    } else if (fieldName === 'street' && typeof value === 'string') {
      isValid = value.trim() !== '';
    } else if (fieldName === 'state') {
      isValid = value !== null;
    }
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: !isValid,
    }));
  
    return isValid;
  };
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setFavorites(true);
  };

  const handleBlur = (fieldName: string, value: string | { value: string; label: string } | null) => {
    validateField(fieldName, value);
  };

  const fetchWeatherDataFromBackend = async (latitude: number, longitude: number) => {
    try {
       //const response = await fetch(`http://localhost:8080/weather?lat=${latitude}&lng=${longitude}`);
        const response = await fetch(`https://assignmentthreebackenduzzwal.wl.r.appspot.com/weather?lat=${latitude}&lng=${longitude}`);

      if (response.status === 200) {
        const data = await response.json();
        setBackendData(data);
        setDisplayResults(true);
        setShowNoRecord(false);
      } else {
        setShowNoRecord(true);
        setBackendData([]);
        setDisplayResults(false);
      }
    } catch (error) {
      setShowNoRecord(true);
      setBackendData([]);
      setDisplayResults(false);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const getGeocodeDate = async () => {
    setLoading(true);
    setBackendData([]);
    setDisplayResults(false);
    if (!state) {
      console.error("State is missing");
      return;
    }

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval); 
          return prevProgress;
        }
        return prevProgress + 10; 
      });
    }, 300);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street)},${encodeURIComponent(city)},${encodeURIComponent(state.label)}&key=${googleApiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLatLng({lat : location.lat, lng : location.lng});
        setShowNoRecord(false);
        fetchWeatherDataFromBackend(location.lat, location.lng);
      } else {
        setShowNoRecord(true);
      }
    } catch(error) {
        setShowNoRecord(true);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setBackendData([]);
    setDisplayResults(false); 
    setIsFavorite(false);
    setActiveTab('Results');
    // check to call DB if the city and state are present in DB
    const checkResponse = await fetch(`https://assignmentthreebackenduzzwal.wl.r.appspot.com/api/favorites/check?city=${autoDetectEnabled ? detectedCity : city}&state=${autoDetectEnabled ? detectedState: state?.label}`);
    const { exists } = await checkResponse.json();
    console.log("call made", exists)
    setIsFavorite(exists);

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
    setFavorites(false);
    setActiveTab('Results');
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

  const isFormValid = () => {
    return (
      (autoDetectEnabled && latLng) || 
      (!autoDetectEnabled &&
        street.trim() !== '' &&
        city.trim() !== '' &&
        state !== null &&
        !errors.street &&
        !errors.city &&
        !errors.state)
    );
  };

  const fetchWeatherDataForFavorite = async (latitude: number, longitude: number, city: string, state: string) => {
    setLoading(true);
    setDisplayCity(city);
    setDisplayState(state);
    setLatitude(latitude);
    setLongitude(longitude);
    setShowNoRecord(false);
  
    try {
      await fetchWeatherDataFromBackend(latitude, longitude);
  
      setIsFavorite(true);
    } catch (error) {
      console.error("Error fetching weather data for favorite:", error);
    } finally {
      setActiveTab('Results');
      setDisplayResults(true);
    }
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
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    onBlur={() => validateField('city', city)}
                    disabled={autoDetectEnabled}
                    required
                    list="city-options"
                    style={errors.city ? { borderColor: 'red' } : {}}
                  />
                  <datalist id="city-options">
                    {cityOptions.map((option) => (
                      <option key={option.value} value={option.label} />
                    ))}
                  </datalist>
                  {errors.city && <div className="text-danger">Please enter a valid city</div>}
                </div>
              </div>


              <div className="row">
                <label htmlFor="stateSelect" className="col-sm-2 col-form-label">
                  State<span className="text-danger">*</span>
                </label>
                <div className="col-sm-5">
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
                  disabled={!isFormValid() || loadingLocation || loading}
                >
                  <i className="bi bi-search"></i> Search
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
                  <i className="bi bi-list-nested"></i> Clear
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="progress mt-4">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress}%
              </div>
            </div>
          )}
        <div>
        <div className="d-flex justify-content-center mt-4 gap-3">
          <button
            className={`btn ${activeTab === 'Results' ? 'btn-primary' : 'no-border'}`}
            onClick={() => handleTabClick('Results')}
          >
            Results
          </button>
          <button
            className={`btn ${activeTab === 'Favorites' ? 'btn-primary' : 'no-border'}`}
            onClick={() => handleTabClick('Favorites')}
          >
            Favorites
          </button>
        </div>


      
      <div className="mt-4">
            {activeTab === 'Results' && displayResults ? (
              <ResultsTabs
                data={backendData}
                city={displayCity}
                state={displayState}
                latitude={latLng?.lat || 0}
                longitude={latLng?.lng || 0}
                isFavorite={isFavorite}
              />
            ) : activeTab === 'Favorites' ? (
              <Favorites fetchWeatherDataForFavorite={fetchWeatherDataForFavorite} />
            ) : activeTab === 'Results' && showNoRecord ? (
              <NoRecord />
            ) : null}
          </div>
    </div>
  </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchForm;