import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, MapPin } from 'lucide-react'
import Locations from './components/Locations'
import { nanoid } from 'nanoid'
import { getWeather } from '../weather'
import dayIcon from './assets/sun.png'
import nightIcon from './assets/crescent-moon.png';

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [locations, setLocations] = useState([])
  const [favLocation, setFavlocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState("")
  const [manageLocsModal, setManageLocsModal] = useState(false)

  //Choosing an icon based on local time
  let timeOfDay;
  const localTime = weather?.location.localtime
  const hour = parseInt(localTime?.split(" ")[1].split(":")[0], 10)

  if (hour >= 6 && hour < 19) {
    timeOfDay = dayIcon
  } else {
    timeOfDay = nightIcon
  }

  //Handle function for opening and closing sidebar menu
  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen)
  }

  //Fetching weather data from the API
  const fetchWeather = async () => {
    if (!favLocation) {
      return
    }
    setError("")
    setWeather(null)
  
    const data = await getWeather(favLocation)
    if (data) {
      setWeather(data)
    } else {
      setError("Could not fetch weather. Please try again.")
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

  //Opening and Closing Modals
  const openManageLocationsModal = () => {
    setManageLocsModal(true)
  }

  const closeManageLocationsModal = () => {
    setManageLocsModal(false)
  }
  
  useEffect(() => {
    fetchWeather()
  }, [favLocation])

  console.log(weather)
  return (
    <main>
      <div className="relative h-screen overflow-hidden">
      <motion.div
          animate={{x: isNavOpen ? "24rem" : "0rem"}}
          transition={{type: "spring", stiffness: 100}}
          className="flex-1 p-2"
        >
          <button className="fixed top-4 left-2 bg-white/10 backdrop-blur-md text-white rounded-lg p-1"
                  onClick={toggleMenu}
          >
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {weather && (
            <div id="weather-info" className="flex flex-col items-start text-white font-medium w-full p-10 mt-10">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-end">
                  <p className="text-5xl self-start mb-5">
                    {weather.current.temp_c} &deg;
                  </p>
                  <p className="flex items-center text-4xl gap-3">  
                    {weather.location.name} <MapPin size={30} />
                  </p>
                </div>
                <div>
                  <img 
                    src={timeOfDay} 
                    alt={(hour >= 6 && hour < 19) ? "Sun Icon" : "Moon Icon"}
                    className="w-28" 
                  />
                </div>
              </div>
              <div className="mt-10 text-sm font-normal">
                <p>
                  Feels like {weather.current.feelslike_c}&deg;
                </p>
                <p>
                  {weather.location.localtime}
                </p>
              </div>
              <div>

              </div>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{x: "-100%"}}
          animate={{x: isNavOpen ? "0%" : "-100%"}}
          transition={{type: "spring", stiffness: 100}}
          className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-lg p-5 shadow-lg border border-white/20 h-screen w-96 text-center " 
        >
          <Locations 
              formSubmit={formSubmit}
              locations={locations}
              manageLocsModal={manageLocsModal}
              openManageLocationsModal={openManageLocationsModal}
              closeManageLocationsModal={closeManageLocationsModal}
              favLocation={favLocation}
              toggleFavorite={toggleFavorite}
              weather={weather}
              timeOfDay={timeOfDay}
          />
        </motion.div>
      </div>
    </main>
  )
}

export default App