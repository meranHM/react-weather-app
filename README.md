# Weather App

A modern, feature-rich weather application built with React, TailwindCSS, and Framer Motion.
I was always a fan of Samsung's Weather UI, so that inspired me to create this practice project.
## Features

- **Multiple Locations:** Users can add multiple cities and set one as their favorite.
- **Favorite City Details:** Displays the current temperature, min/max temperatures, feels-like temperature, local date and time, and an icon indicating day or night.
- **24-Hour Forecast:** A horizontally scrollable section showing hourly temperature, humidity, and weather conditions.
- **Sunrise & Sunset:** Displays the exact sunrise and sunset times with icons.
- **Weather Metrics:** Shows the UV index, humidity, and wind speed with corresponding icons.
- **Air Quality Index (AQI):** Displays AQI levels for the favorite city.
- **Weather Alerts:** If available, displays any weather alerts for the selected city.
- **Dynamic Background:** The app background changes based on the time of day (day/night) for the favorite city.
- **Responsive Design:** Fully responsive across different screen sizes.
- **Sidebar Navigation:**
  - A button toggles a sliding sidebar containing:
    - Input field for adding cities.
    - A section displaying the favorite city's name, temp, and day/night indicator.
    - A list of other added locations with their current temperatures.
    - A "Manage Locations" button to edit, remove, or change the favorite city.
- **Manage Locations Modal:** Allows users to:
  - View, edit, or remove locations.
  - Set a different favorite city.

## Technologies Used

- **React** - Frontend framework.
- **TailwindCSS** - For styling.
- **Framer Motion** - For smooth animations.

## Installation & Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/meranHM/weather-app.git
   cd weather-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the app:
   ```sh
   npm run dev
   ```

## Demo
![Weather App Demo](./src/assets/Demo.gif)


## Credits

Built by [meranHM].
