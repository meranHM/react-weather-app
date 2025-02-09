import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL

const today = new Date().toISOString().split("T")[0]

export const getForecast = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: API_KEY,
                q: city,
                aqi: "yes",
                days: 7,
                dt: today
            }
        })
        return response.data
    } catch (error) {
        console.error("Error fetching weather alerts:", error)
        return null
    }
}

export const getWeatherAlerts = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/alerts.json`, {
            params: {
                key: API_KEY,
                q: city
            },
        })
        return response.data
    } catch (error) {
        console.error("Error fetching weather alerts:", error)
        return null
    }
}

