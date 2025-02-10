
import { motion } from 'framer-motion'
import { Star, Info, MapPin, MapPinPlusInside, ChevronLeft, Moon, Trash2 } from 'lucide-react'
import Information from './Information'

const Locations = (props) => {
    const {locations, formSubmit, manageLocsModal, openManageLocationsModal, closeManageLocationsModal, favLocation, toggleFavorite, forecast, timeOfDay, handleDelete, openInfoModal, closeInfoModal, infoModal} = props

    const roundedTemp = Math.floor(forecast?.current.temp_c)
    const roundedFeelTemp = Math.floor(forecast?.current.feelslike_c)

    //Rendering list of elements for the sidebar list
    const cityElements = locations.map(({city, id}) => (
        <li key={id}
            className="text-2xl ml-8 font-normal mb-5 text-left"
        >
           {city}
        </li>
    ))

    //Rendering "Manage Locations" Modal Elements seperately
    const modalElements = locations.map(({city, id}) => (
        <div key={id} className="p-5 bg-gray-300 w-11/12 mx-4 rounded-2xl flex justify-between items-center group">
            <div className="flex flex-col">
                <p className="flex items-center gap-2 mb-1">
                    <MapPin size={15}/> {city}
                </p>
                <div className="flex flex-col text-xs text-white/50 text-left">
                    <p>{forecast?.location.tz_id}</p>
                    <p>{forecast?.location.localtime}</p>
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
                    <p className="font-bold text-lg">{roundedTemp}</p>
                    <p className="text-xs text-white/50 ">Feels like {roundedFeelTemp}</p>
                </div>
            </div>
        </div>
    ))

  return (
    <div id="side-menu-container" className="flex flex-col min-h-screen p-4 text-white items-center">
        {/* Adding the city form container */}
        <div className="flex flex-col mt-5 text-left  py-4 border-b-2 border-dotted border-white/50 w-full">
            <form action={formSubmit}
                  className="flex flex-col w-full"
            >
                <label htmlFor="city" className="text-lg">
                    Add a city:
                </label>
                <input id="city" type="text" name="city" placeholder="e.g Tehran" className="p-2 rounded-md mt-1 text-gray-900"/>
            </form>
        </div>
        <div className="py-1 w-full flex flex-col items-center">
            {/* Favorite location container */}
            <div className="flex flex-col border-b-2 border-dotted border-white/50 mt-1 pb-4 w-full">
                <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-1 mb-2 text-lg">
                    <Star size={22}/> Favorite Location
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
                {forecast &&
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
                        {roundedTemp}&deg;
                    </p>
                </div>}
            </div>
            {/* Other locations container */}
            <div className="mt-4 w-full flex flex-col items-center">
                <h2 className="flex items-center self-start gap-1 mb-2 text-lg">
                   <MapPinPlusInside size={22}/>  Other Locations
                </h2>
                <ul id="added-locations" className="flex flex-col self-start list-none py-3">
                    {cityElements}
                </ul>
                {/* Manage Locations Modal */}
                <button className="bg-white/10 backdrop-blur-md rounded-2xl p-2 w-60 hover:bg-white/20 active:bg-white/30"
                        onClick={openManageLocationsModal}
                >
                    Manage Locations
                </button>
            </div>
        </div>
    </div>
  )
}

export default Locations