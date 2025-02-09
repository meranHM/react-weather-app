import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, MapPin, Radiation } from 'lucide-react'
import SideBar from './components/SideBar'
import { nanoid } from 'nanoid'
import { getWeather, getWeatherAlerts, getForecast } from '../weather'
import dayIcon from './assets/sun.png'
import nightIcon from './assets/crescent-moon.png';


const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [locations, setLocations] = useState([])
  const [favLocation, setFavlocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [error, setError] = useState("")
  const [manageLocsModal, setManageLocsModal] = useState(false)
  const [infoModal, setInfoModal] = useState(false)

  //Choosing an icon based on local time
  let timeOfDay;
  const localTime = weather?.location.localtime
  const hour = parseInt(localTime?.split(" ")[1].split(":")[0], 10)

  if (hour >= 6 && hour < 19) {
    timeOfDay = dayIcon
  } else {
    timeOfDay = nightIcon
  }

  //Handling Air Quality based on data fetched from API
  const localAqi = weather?.current.air_quality["us-epa-index"]
  const aqiLevels = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for sensitive group",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
  }
  const aqi = aqiLevels[localAqi] || "Unknown"

  //Handle function for opening and closing sidebar menu
  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen)
  }

  //Fetching weather data and alerts from the API
  const fetchWeather = async () => {
    if (!favLocation) {
      return
    }
    setError("")
    setWeather(null)
    setWeatherAlerts([])
    
    const weatherData = await getWeather(favLocation)
    const weatherAlertsData = await getWeatherAlerts(favLocation)

    if (weatherData) {
      setWeather(weatherData)
    } else {
      setError("Could not fetch weather. Please try again.")
    }

    if (weatherAlertsData && weatherAlertsData.alerts) {
      setWeatherAlerts(weatherAlertsData)
  }
}

  //Handling location form submission with React 19 method
  function formSubmit(formData) {
    const cityName = formData.get("city")

    if (cityName.trim() === "") {
      return
    } 

    setLocations(prevLocs => [...prevLocs, {
        id: nanoid(),
        city: cityName.trim()
      }])

      if (!favLocation) {
        setFavlocation(cityName.trim())
      }

      setIsNavOpen(false)
  }
  

  //Handling favorite location function
  const toggleFavorite = (id) => {
    const location = locations.find(loc => loc.id === id)
    
    if (location) {
      setFavlocation(location.city)
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
  
  useEffect(() => {
    if (favLocation) {
      fetchWeather()
    }
  }, [favLocation])

  console.log(weather)
  console.log(weatherAlerts)
  return (
    <main>
      <div className="relative h-screen overflow-hidden max-w-5xl mx-auto">
        <motion.div
            animate={{x: isNavOpen ? "24rem" : "0rem"}}
            transition={{type: "spring", stiffness: 80}}
            className="flex-1 p-1"
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

            {weather && (
              <div id="weather-info" className="flex flex-col items-center text-white w-full py-10 px-5 sm:px-10 mt-10">
                <div id="temp" className="w-11/12">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-end">
                      <p className="text-5xl self-start mb-5">
                        {weather.current.temp_c}&deg;
                      </p>
                      <p className="flex items-center text-4xl gap-3">  
                        {weather.location.name} <MapPin size={30} />
                      </p>
                    </div>
                    <img 
                      src={timeOfDay} 
                      alt={(hour >= 6 && hour < 19) ? "Sun Icon" : "Moon Icon"}
                      className="w-28" 
                    />
                  </div>
                  <div className="mt-5 text-center text-sm font-normal">
                    <p>
                      Feels like {weather.current.feelslike_c}&deg;
                    </p>
                    <p>
                      {weather.location.localtime}
                    </p>
                  </div>
                </div>
                <div id="aqi" className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-lg p-5 mt-10 shadow-lg border border-white/20 w-11/12 text-center" >
                  <p className="flex gap-2"><Radiation/>AQI</p>
                  <p className="text-nowrap">{aqi}</p>
                </div>
                {weatherAlerts.alerts.alert > 0 && (
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
            initial={{x: "-100%"}}
            animate={{x: isNavOpen ? "0%" : "-100%"}}
            transition={{type: "spring", stiffness: 80}}
            className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20 h-screen sm:w-96 w-96 text-center" 
          >
            <SideBar 
                formSubmit={formSubmit}
                locations={locations}
                manageLocsModal={manageLocsModal}
                openManageLocationsModal={openManageLocationsModal}
                closeManageLocationsModal={closeManageLocationsModal}
                favLocation={favLocation}
                toggleFavorite={toggleFavorite}
                weather={weather}
                timeOfDay={timeOfDay}
                handleDelete={handleDelete}
                infoModal={infoModal}
                openInfoModal={openInfoModal}
                closeInfoModal={closeInfoModal}
            />
        </motion.div>
      </div>
    </main>
  )
}

export default App