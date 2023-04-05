# Scraper API

## API

### Instructions

**Source setup.sh**


### Environment variables

Create a .env based on example.env and enter values accordingly.

### Routes

#### POST /api/run-scraper

Runs the scraper in the background. Scraped sites are saved in workfiles directory.
Headers: `x-scraper-key`: `scraper-key`

Body: `{"pages": 20}` (optional)

## Scraper

## Instructions

You can modify article output but changing the maxCount variable in scraper.py. The default is 50.
**cd into python directory**

1. Install Python 3.10
2. Create a virtual environment: `python -m venv scraper-env`
3. Activate the virtual environment: `source scraper-env/bin/activate` or `scraper-env\Scripts\activate` in Powershell
4. Install the requirements: `pip install -r requirements.txt`

### Run the scraper

```bash
python scraper.py
```

### Run calculations

```bash
python calculate_tokens.py
```
