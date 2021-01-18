import React, {createContext, useState} from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {Link} from 'react-router-dom';


export const LocationContext = createContext();

const LocationProvider = (props) => {
  const [coordinates, setCoordinates] = useState([]);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  
  // const ref = useOnclickOutside(() => {
  //   // When user clicks outside of the component, we can dismiss
  //   // the searched suggestions by calling this method
  //   clearSuggestions();
  // });

  const handleInput = (e) => {

    console.log(e.target.value)
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    console.log(description);
    setValue(description, false);
    clearSuggestions(); 

    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("📍 Coordinates: ", { lat, lng });
        setCoordinates([{lat, lng}]);
        // const coords = [lat, lang];
      })
      .catch((error) => {  // ----- description, {lat. lng} o [lat, lng]
        console.log("😱 Error: ", error);
      });
  };

  // const renderSuggestions = () =>
  //   data.map((suggestion) => {
  //     const {
  //       place_id,
  //       structured_formatting: { main_text, secondary_text },
  //     } = suggestion;

  //     return (
  //       <li key={place_id} onClick={handleSelect(suggestion)}>
  //         <strong>{main_text}</strong> <small>{secondary_text}</small>
  //       </li>
  //     );
  //   });

  
  return ( 
    <LocationContext.Provider value={[coordinates, setCoordinates, handleInput, handleSelect, {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    }]}>
      {props.children}
    </LocationContext.Provider>
   );
}
 
export default LocationProvider; 

    // return (
    //   <div>
    //     <input
    //       value={value}
    //       onChange={handleInput}
    //       disabled={!ready}
    //       placeholder="Where are you going?"
    //     />
    //     {/* We can use the "status" to decide whether we should display the dropdown or not */}
    //     {status === "OK" && <ul>{renderSuggestions()}</ul>}
    //   </div>
    // );
