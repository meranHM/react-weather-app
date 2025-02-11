import { useState, useEffect, useRef } from 'react'
import { getWeatherAlerts, getForecast } from '../weather'
import { motion } from 'framer-motion'
import { Menu, X, MapPin, Radiation } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useMediaQuery } from 'react-responsive'
import SideBar from './components/SideBar'
import HourlyForcast from './components/HourlyForcast.jsx'
import ManageLocations from './components/ManageLocations.jsx'
import dayIcon from './assets/sun.png'
import nightIcon from './assets/crescent-moon.png'
import uvIcon from './assets/uv-index.png'
import humidityIcon from './assets/humidity.png'
import windIcon from './assets/wind.png'
import sunriseIcon from './assets/sunrise.png'
import sunsetIcon from './assets/sunset.png'

const App = () => {

  const [isNavOpen, setIsNavOpen] = useState(false)
  const [locations, setLocations] = useState([])
  const [favLocation, setFavlocation] = useState({id: null, city: ""})
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [forecast, setForcast] = useState(null)
  const [otherForecast, setOtherForecast] = useState([])
  const [error, setError] = useState("")
  const [otherError, setOtherError] = useState("")
  const [manageLocsModal, setManageLocsModal] = useState(false)
  const [infoModal, setInfoModal] = useState(false)
  const SideBarRef = useRef(null)

  //Derived Values
  const roundedTemp = Math.floor(forecast?.current.temp_c)
  const roundedFeelTemp = Math.floor(forecast?.current.feelslike_c)
  const roundedMaxTemp = Math.floor(forecast?.forecast.forecastday[0].day.maxtemp_c)
  const roundedMinTemp = Math.floor(forecast?.forecast.forecastday[0].day.mintemp_c)
  const smallScreen = useMediaQuery({ maxWidth: 640 })
  const hasFavorite = favLocation.city !== ""
 
  //Choosing an icon based on local time
  let timeOfDay;
  const localTime = forecast?.location.localtime
  const hour = parseInt(localTime?.split(" ")[1].split(":")[0], 10)

  if (hour >= 6 && hour < 19) {
    timeOfDay = dayIcon
  } else {
    timeOfDay = nightIcon
  }

  //Handling background color based on local time
  let isDay;

  if (hour >= 6 && hour < 19) {
    isDay = true
  } else {
    isDay = false
  }


  //Handling Air Quality based on data fetched from API
  const localAqi = forecast?.current.air_quality["us-epa-index"]
  const aqiLevels = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for sensitive groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
  }
  const aqi = aqiLevels[localAqi] || "Unknown"

  //Handling UV Index based on data fetched from API
  const localUv = Math.floor(forecast?.current.uv)
  const uvLevels = {
    0: "Low",
    1: "Low",
    2: "Low",
    3: "Moderate",
    4: "Moderate",
    5: "Moderate",
    6: "High",
    7: "High",
    8: "Very High",
    9: "Very High",
    10: "Very High"
  }
  const uvIndex = localUv >= 11 ? "Extreme" : uvLevels[localUv] || "Unkown"

  //Handle function for opening and closing sidebar menu
  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen)
  }

  //Handling location form submission with React 19 method
  function formSubmit(formData) {
      const cityName = formData.get("city").trim()
  
      if (cityName === "") {
        return
      }
      
      if (!hasFavorite) {
        setFavlocation({
          id: nanoid(),
          city: cityName
        })
      } else {
        setLocations(prevLocs => [...prevLocs, {
            id: nanoid(),
            city: cityName
          }])
      }
        setIsNavOpen(false)
    }

  //Fetching weather data and alerts for favortie location from the API
  const fetchFavLocWeather = async () => {
    if (!hasFavorite) {
      return
    }
    setError("")
    setWeatherAlerts([])
    setForcast(null)
    
    const forecastData = await getForecast(favLocation.city)
    const weatherAlertsData = await getWeatherAlerts(favLocation.city)
   
    if (forecastData) {
      setForcast(forecastData)
    } else {
      setError("Could not fetch weather. Please try again.")
    }

    if (weatherAlertsData && weatherAlertsData.alerts) {
      setWeatherAlerts(weatherAlertsData)
    }
  }

  //Fetching weather data for other locations from the API
  const fetchOtherLocsWeather = async () => {
    

    setOtherError("")
    const lastLocation = locations[locations.length - 1].city
    const lastLocationId = locations[locations.length - 1].id
    const otherForecastData = await getForecast(lastLocation)
    

    if (otherForecastData) {
      setOtherForecast(prevData => [...prevData, {
        id: lastLocationId,
        temp: Math.floor(otherForecastData.current.temp_c),
        maxTemp: Math.floor(otherForecastData.forecast.forecastday[0].day.maxtemp_c),
        minTemp: Math.floor(otherForecastData.forecast.forecastday[0].day.mintemp_c),
        city: otherForecastData.location.name,
        country: otherForecastData.location.country,
        localTime: otherForecastData.location.localtime,
      }])
    } else {
      setOtherError("Could not fetch weather.")
    }
  }

  //Handling favorite location function
  const toggleFavorite = (id) => {
    const location = locations.find(loc => loc.id === id)
    
    if (location) {
      setFavlocation({
        id: location.id,
        city: location.city
      })
      handleDelete(id)
    }
  }

  //Handling Delete function
  const handleDelete = (id) => {
    setLocations(prevLocs => prevLocs.filter(loc => loc.id !== id))
  }

  //Opening and Closing Modals
  const openManageLocationsModal = () => {
    setManageLocsModal(true)
  }

  const closeManageLocationsModal = () => {
    setManageLocsModal(false)
  }

  const openInfoModal = () => {
    setInfoModal(true)
  }

  const closeInfoModal = () => {
    setInfoModal(false)
  }

  //Creating an eventListener for esc button to close the modals
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeInfoModal()
      closeManageLocationsModal()
    }
  }

  useEffect(() => {
    if (infoModal || manageLocsModal) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [infoModal, manageLocsModal])

  //Detecting if user clicked outside the SideBar
  useEffect(() => { 
    const handleClickOutside = (e) => {
      if (SideBarRef.current && !SideBarRef.current.contains(e.target)) {
        setIsNavOpen(false)
      }
    }
    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNavOpen])

  //Calling fetch functions
  useEffect(() => {
    if (favLocation.city) {
      fetchFavLocWeather()
    }
  }, [favLocation])

  useEffect(() => {
      if (locations.length > 0) {
          fetchOtherLocsWeather()
        }
  }, [locations])


  return (
    <main className={`min-h-screen transition-all duration-500 ${isDay ? "bg-day-sky" : "bg-night-sky"}`}>
      <div className="relative min-h-screen max-w-3xl mx-auto overflow-hidden">
        <motion.div
            animate={{x: isNavOpen ? (smallScreen ? "18rem" : "24rem") : "0rem"}}
            transition={{type: "spring", stiffness: 80}}
            className="p-1"
          >
            <button className="absolute top-4 left-2 sm:left-4 bg-white/10 backdrop-blur-md text-white rounded-lg p-1"
                    onClick={toggleMenu}
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {error && 
              <p className="bg-white/10 backdrop-blur-md rounded-lg p-5 shadow-lg border border-white/20 h-16 w-96 text-center text-white mx-auto mt-20">
                {error}
              </p>}

            {forecast && (
              <div id="weather-info" className="flex flex-col items-center text-white w-full py-14 sm:py-10 px-5 sm:px-10">
                <div id="temp" className="w-11/12 sm:px-10">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-end">
                      <p className="text-5xl self-start mb-5">
                        {roundedTemp}&deg;
                      </p>
                      <p className="flex items-center text-2xl sm:text-4xl gap-3 text-nowrap">  
                        {forecast.location.name} <MapPin size={30} />
                      </p>
                    </div>
                    <img 
                      src={timeOfDay} 
                      alt={(hour >= 6 && hour < 19) ? "Sun Icon" : "Moon Icon"}
                      className="w-20 sm:w-28" 
                    />
                  </div>
                  <div className="mt-5 text-left text-sm font-normal leading-6">
                    <p className="tracking-wider">
                      {roundedMaxTemp}&deg; / {roundedMinTemp}&deg; Feels like {roundedFeelTemp}&deg;
                    </p>
                    <p className="tracking-wider">
                      {forecast.location.localtime}
                    </p>
                  </div>
                </div>
                <HourlyForcast
                    forecast={forecast}
                />
                <div id="sunrise-sunset" className="flex justify-evenly items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center">
                  <div id="sunrise" className="w-1/2 flex flex-col items-center">
                    <h3>Sunrise</h3>
                    <p>{forecast.forecast.forecastday[0].astro.sunrise}</p>
                    <img src={sunriseIcon} alt="sunrise icon"  className="w-20 mt-2"/>
                  </div>
                  <div id="sunset" className="w-1/2 flex flex-col items-center">
                    <h3>Sunset</h3>
                    <p>{forecast.forecast.forecastday[0].astro.sunset}</p>
                    <img src={sunsetIcon} alt="sunset icon" className="w-20 mt-2"/>
                  </div>
                </div>
                <div id="weather-conditions" className="flex justify-evenly items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center">
                  <div id="uv-index" className="flex flex-col items-center justify-evenly gap-1 w-1/3">
                    <img src={uvIcon} alt="uv index icon"  className="w-10 mb-1"/>
                    <h3 className="text-center font-semibold">UV index</h3>
                    <p className="text-gray-200/85">{uvIndex}</p>
                  </div>
                  <div id="humidity" className="flex flex-col items-center justify-evenly gap-1 border-x border-white/20 w-1/3">
                    <img src={humidityIcon} alt="humidity icon"  className="w-10 mb-1"/>
                    <h3 className="text-center font-semibold">Humidity</h3>
                    <p className="text-gray-200/85">{forecast.current.humidity}%</p>
                  </div>
                  <div id="wind" className="flex flex-col items-center justify-evenly gap-1 w-1/3">
                    <img src={windIcon} alt="wind icon"  className="w-10 mb-1"/>
                    <h3 className="text-center font-semibold">Wind</h3>
                    <p className="text-gray-200/85">{forecast.current.wind_kph} km/h</p>
                  </div>
                </div>
                <div id="aqi" className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-2 shadow-lg border border-white/20 w-11/12 text-center sm:px-16" >
                  <p className="flex gap-2"><Radiation/>AQI</p>
                  <p className="text-nowrap">{aqi}</p>
                </div>
                {weatherAlerts.length > 0 && (
                  <div id="alerts" className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-10 shadow-lg border border-white/20 w-11/12 text-center">
                    <p className="text-center text-lg">
                      {weatherAlerts.alerts.alert[0]?.desc}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            ref={SideBarRef}
            initial={{x: "-100%"}}
            animate={{x: isNavOpen ? "0%" : "-100%"}}
            transition={{type: "spring", stiffness: 80}}
            className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20 h-full sm:w-96 w-72 text-center"

          >
            <SideBar 
                formSubmit={formSubmit}
                locations={locations}
                openManageLocationsModal={openManageLocationsModal}
                favLocation={favLocation.city}
                forecast={forecast}
                otherForecast={otherForecast}
                otherError={otherError}
                timeOfDay={timeOfDay}
                hour={hour}
                infoModal={infoModal}
                openInfoModal={openInfoModal}
                closeInfoModal={closeInfoModal}
                roundedTemp={roundedTemp}
                roundedFeelTemp={roundedFeelTemp}
            />
        </motion.div>
        {manageLocsModal && 
          <ManageLocations
            closeManageLocationsModal={closeManageLocationsModal}
            infoModal={infoModal}
            openInfoModal={openInfoModal}
            closeInfoModal={closeInfoModal}
            toggleFavorite={toggleFavorite}
            handleDelete={handleDelete}
            forecast={forecast}
            otherForecast={otherForecast}
            favLocation={favLocation.city}
            locations={locations}
            roundedTemp={roundedTemp}
            roundedMaxTemp={roundedMaxTemp}
            roundedMinTemp={roundedMinTemp}
            timeOfDay={timeOfDay}
            hour={hour}
          />}
      </div>
    </main>
  )
}

export default App