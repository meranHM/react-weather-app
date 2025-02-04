
import { motion } from 'framer-motion'
import { Star, Info, MapPin, MapPinPlusInside, ChevronLeft, Moon } from 'lucide-react'

const Locations = ({locations, formSubmit, manageLocsModal, openManageLocationsModal, closeManageLocationsModal, favLocation, toggleFavorite, weather, timeOfDay}) => {
    const cityElements = locations.map(({city, id}) => (
        <li key={id}
            className="font-medium text-lg ml-8 mb-5"
        >
           <span>{city}</span>
        </li>
    ))

    const modalElements = locations.map(({city, id}) => (
        <div key={id} className="p-5 bg-gray-950 mx-4 rounded-2xl flex justify-between items-center group">
            <div className="flex flex-col">
                <p className="flex items-center gap-2 mb-1">
                    <MapPin size={15}/> {city}
                </p>
                <div className="flex flex-col text-xs text-white/50 text-left">
                    <p>{weather?.location.tz_id}</p>
                    <p>{weather?.location.localtime}</p>
                </div>
            </div>
            <div>
                <button className="hidden group-hover:block group-focus-within:block"
                        onClick={() =>toggleFavorite(id)}
                >
                    <Star className={favLocation === city ? "text-yellow-400" : "text-white"}/>
                </button>
            </div>
            <div className="flex items-center gap-3">
                <div><Moon/></div>
                <div>
                    <p className="font-bold text-lg">{weather?.current.temp_c}</p>
                    <p className="text-xs text-white/50">Feels like {weather?.current.feelslike_c}</p>
                </div>
            </div>
        </div>
    ))

  return (
    <div id="side-menu-container" className="flex flex-col  p-4 text-white">
        <div className="flex flex-col mt-5 text-left px-2 py-4 border-b-2 border-dotted">
            <form action={formSubmit}
                  className="flex flex-col"
            >
                <label htmlFor="city" className="text-lg font-meidum">
                    Add a city:
                </label>
                <input id="city" type="text" name="city" placeholder="e.g Tehran" className="p-2 rounded-md mt-1"/>
            </form>
        </div>
        
        <div className="px-1 py-1">
            <div className="flex flex-col border-b-2 border-dotted mb-2 py-3 z-50">
                <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-3 mb-2 text-lg">
                    <Star/> Favorite Location
                </h2>
                <button className="cursor-pointer mb-1">
                    <Info size={20}/>
                </button> 
                </div>
                {weather &&
                <div id="favorite-location-container"
                     className="flex justify-between"
                >
                    <p className="text-2xl">
                        {favLocation}
                    </p>
                    <p className="flex items-center gap-2 text-2xl">
                        <img src={timeOfDay} 
                             className="w-6"
                        />
                        {weather?.current.temp_c}&deg;
                    </p>
                </div>}
            </div>
            <div className="mt-4 z-50">
                <h2 className="flex items-center gap-3 mb-2 text-lg">
                   <MapPinPlusInside size={22}/>  Other Locations
                </h2>
                <ul id="added-locations" className="list-none text-left py-3">
                    {cityElements}
                </ul>
                <button className="bg-white/10 backdrop-blur-md rounded-2xl p-2 w-60 hover:bg-white/20 active:bg-white/30"
                        onClick={openManageLocationsModal}
                >
                    Manage Locations
                </button>
                {manageLocsModal && 
                    <div id="modal-overlay"
                         className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[100]"
                    >
                        <motion.div 
                            className="flex flex-col fixed top-0 left-0 w-screen h-screen bg-black z-[100]"
                        >
                            <div id="modal-header" className="flex items-center text-2xl p-2 gap-5 mt-5">
                                <button onClick={closeManageLocationsModal}>
                                    <ChevronLeft size={30}/>
                                </button>
                                <h2>Manage locations</h2>
                            </div>
                            <div className="flex justify-between px-5 mt-2 mb-1">
                                <h4 className="text-sm text-white/50">Favorite location</h4>
                                <button className="cursor-pointer mb-1">
                                        <Info size={18}/>
                                </button>
                            </div>
                            {weather &&
                            <div className="p-5 bg-gray-950 mx-4 rounded-2xl flex justify-between">
                                <div className="flex flex-col">
                                    <p className="flex items-center gap-2 mb-1">
                                        <MapPin size={15}/>
                                        {favLocation}
                                    </p>
                                    <div className="flex flex-col text-xs text-white/50 text-left">
                                        <p>{weather?.location.tz_id}</p>
                                        <p>{weather?.location.localtime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div><Moon/></div>
                                    <div>
                                        <p className="font-bold text-lg">{weather?.current.temp_c}</p>
                                        <p className="text-xs text-white/50">Feels like {weather?.current.feelslike_c}</p>
                                    </div>
                                </div>
                            </div>}

                            <h4 className="text-sm text-white/50 text-left ml-5 mt-5">
                                Other locations
                            </h4>
                            {modalElements}
                        </motion.div>
                    </div>} 
                </div>
        </div>
    </div>
  )
}

export default Locations