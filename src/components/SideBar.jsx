
import { motion } from 'framer-motion'
import { Star, Info, MapPin, MapPinPlusInside, ChevronLeft, Moon, Trash2 } from 'lucide-react'
import Information from './Information'

const Locations = (props) => {
    const {locations, formSubmit, manageLocsModal, openManageLocationsModal, closeManageLocationsModal, favLocation, toggleFavorite, weather, timeOfDay, handleDelete, openInfoModal, closeInfoModal, infoModal} = props


    //Rendering list of elements for the sidebar list
    const cityElements = locations.map(({city, id}) => (
        <li key={id}
            className="font-medium text-lg  mb-5"
        >
           <p className="text-2xl ml-8">{city}</p>
        </li>
    ))

    //Rendering "Manage Locations" Modal Elements seperately
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
            <div className="flex gap-2">
                <button className="hidden group-hover:block group-focus-within:block"
                        onClick={() =>toggleFavorite(id)}
                >
                    <Star className={favLocation === city ? "text-yellow-400" : "text-white"}/>
                </button>
                <button onClick={() => handleDelete(id)}>
                    <Trash2 size={20}/>
                </button>
            </div>
            <div className="flex items-center gap-3">
                <div><Moon/></div>
                <div>
                    <p className="font-bold text-lg">{weather?.current.temp_c}</p>
                    <p className="text-xs text-white/50 ">Feels like {weather?.current.feelslike_c}</p>
                </div>
            </div>
        </div>
    ))

  return (
    <div id="side-menu-container" className="flex flex-col  p-4 text-white">
        {/* Adding the city form container */}
        <div className="flex flex-col mt-5 text-left px-2 py-4 border-b-2 border-dotted">
            <form action={formSubmit}
                  className="flex flex-col"
            >
                <label htmlFor="city" className="text-lg font-meidum">
                    Add a city:
                </label>
                <input id="city" type="text" name="city" placeholder="e.g Tehran" className="p-2 rounded-md mt-1 text-gray-900"/>
            </form>
        </div>
        
        <div className="px-1 py-1">
            {/* Favorite location container */}
            <div className="flex flex-col border-b-2 border-dotted mb-2 py-3 z-50">
                <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-3 mb-2 text-lg">
                    <Star/> Favorite Location
                </h2>
                <button className="cursor-pointer mb-1"
                        onClick={openInfoModal}
                >
                    <Info size={20}/>
                </button> 
                {infoModal && <Information 
                                closeInfoModal={closeInfoModal}/>
                }
                </div>
                {weather &&
                <div id="favorite-location-container"
                     className="flex justify-between"
                >
                    <p className="text-2xl ml-8">
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
            {/* Other added locations container */}
            <div className="mt-4 z-50">
                <h2 className="flex items-center gap-3 mb-2 text-lg">
                   <MapPinPlusInside size={22}/>  Other Locations
                </h2>
                <ul id="added-locations" className="list-none text-left py-3">
                    {cityElements}
                </ul>
                {/* Manage Locations Modal */}
                <button className="bg-white/10 backdrop-blur-md rounded-2xl p-2 w-60 hover:bg-white/20 active:bg-white/30"
                        onClick={openManageLocationsModal}
                >
                    Manage Locations
                </button>
                {manageLocsModal && 
                    <div id="modal-overlay"
                         className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50"
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
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
                                <button className="cursor-pointer mb-1"
                                        onClick={openInfoModal}
                                >
                                        <Info size={18}/>
                                </button>
                                {infoModal && <Information 
                                                closeInfoModal={closeInfoModal}/>
                                }
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