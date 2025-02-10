import { Info, MapPin, ChevronLeft, Moon, Trash2, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Information from './Information'

const ManageLocations = (props) => {
    const { closeManageLocationsModal, openInfoModal, closeInfoModal, infoModal, forecast, favLocation, locations, roundedTemp, roundedFeelTemp } = props


      //Rendering "Manage Locations" Modal Elements seperately
      const modalElements = locations.map(({city, id}) => (
        <div key={id} className="p-5 bg-gray-800 mx-4 rounded-2xl flex justify-between items-center group">
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
        <div id="modal-overlay"
             className="absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col absolute top-0 left-0 items-left w-full h-screen bg-black z-[100] text-white"
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
                
                {forecast &&
                <div className="p-5 bg-gray-800 rounded-2xl flex justify-between mx-4 ">
                    <div className="flex flex-col">
                        <p className="flex items-center gap-2 mb-1">
                            <MapPin size={15}/>
                            {favLocation}
                        </p>
                        <div className="flex flex-col text-xs text-white/50 text-left">
                            <p>{forecast.location.tz_id}</p>
                            <p>{forecast.location.localtime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div><Moon/></div>
                        <div>
                            <p className="font-bold text-lg">{roundedTemp}</p>
                            <p className="text-xs text-white/50">Feels like {roundedFeelTemp}</p>
                        </div>
                    </div>
                </div>}

                <h4 className="text-sm text-white/50 text-left ml-5 mt-5">
                    Other locations
                </h4>
                {modalElements}
            </motion.div>
        </div>
  )
}

export default ManageLocations