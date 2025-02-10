

const ManageLocations = () => {

  return (
        <div id="modal-overlay"
             className="fixed top-0 left-0 w-screen h-full bg-black/50 flex justify-center items-center z-50"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col fixed top-0 left-0 items-left w-full h-screen bg-black z-[100] text-white"
            >
                <div id="modal-header" className="flex items-center text-2xl p-2 gap-5 mt-5 max-w-screen-md">
                    <button onClick={closeManageLocationsModal}>
                        <ChevronLeft size={30}/>
                    </button>
                    <h2>Manage locations</h2>
                </div>
                <div className="flex justify-between px-5 mt-2 mb-1 max-w-screen-md">
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
                <div className="p-5 bg-gray-300 rounded-2xl flex justify-between mx-4 max-w-screen-sm">
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