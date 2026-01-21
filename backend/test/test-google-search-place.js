require("dotenv").config();

const {searchNearbyPlaces} = require("../services/google-search-service");
(
    async() => {
        try{
            console.log("==== Test Google Search Place ====");
            const query = "Khon Kaen";
            const places = await searchNearbyPlaces()
            console.log(places);

        }catch(err){
            console.log("=====================================");
            console.log("!!!Error searching places:!!!");
            console.error(err.response?.data || err.message);
            console.log("=====================================");
        }
    }
)();