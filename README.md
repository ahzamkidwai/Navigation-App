🌍 NavAI – Smart Navigation App

NavAI is a lightweight navigation assistant built with React + Vite, featuring autocomplete, voice input, map routing, and route summary display.
It uses Geoapify APIs for place search and route generation.

✨ Features

🔍 Place Autocomplete (Geoapify Places API)

🎤 Voice Input for source & destination (Web Speech API)

🗺️ Interactive Map with markers & polylines (React Leaflet)

🛣️ Driving Route Generation with distance & duration

📄 Route Summary Panel with a dismiss (cross) button

📍 Tracks user’s current location

🎯 Clean UI built using TailwindCSS

🛠️ Tech Stack

React + Vite

Geoapify Places API & Routing API

React Leaflet

TailwindCSS

Web Speech API

🚀 Setup Instructions

Clone the repository

git clone <repo-url>
cd project-folder


Install dependencies

npm install


Add Geoapify API key
Create a .env file:

VITE_API_KEY=your_geoapify_key


Start the development server

npm run dev

