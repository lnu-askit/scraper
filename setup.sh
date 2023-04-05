#!bin/bash

echo "Moving into python directory..."
cd api/python

echo "Creating python environment..."
python -m venv scraper-env

echo "Activating python environment..."
source scraper-env/Scripts/activate

echo "Installing requirements..."
pip install -r requirements.txt

echo "Moving into api directory & installing npm packages..."
cd ..
npm install

cp example.env .env

echo "Enter SCRAPER_KEY: "

read scraper_key

echo "SCRAPER_KEY=$scraper_key" >| .env

echo "Setup finished!\nGo in to api directory and run `npm run dev`"
