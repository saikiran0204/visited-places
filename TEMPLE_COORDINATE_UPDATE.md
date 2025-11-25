# Temple Coordinate Updater

This script updates the exact GPS coordinates for all temples in `src/data/locations.json` using Google Maps Geocoding API.

## Setup

1. **Get a Google Maps API Key:**
   - Go to https://console.cloud.google.com/google/maps-apis
   - Create a new project or select an existing one
   - Enable the "Geocoding API"
   - Create credentials (API Key)
   - Copy your API key

2. **Set the API Key:**
   
   Option 1: Export as environment variable
   ```bash
   export GOOGLE_MAPS_API_KEY='your-api-key-here'
   ```
   
   Option 2: Create a `.env` file (if using python-dotenv)
   ```bash
   echo "GOOGLE_MAPS_API_KEY=your-api-key-here" > .env
   ```

## Usage

```bash
python3 update_temple_coordinates.py
```

The script will:
- Geocode each temple by its name (most accurate)
- Try multiple query formats if needed
- Only update coordinates if they differ significantly (>0.01 degrees ≈ 1km)
- Show progress and results for each temple
- Update `src/data/locations.json` with accurate coordinates

## Notes

- Google Maps API has a free tier: $200/month credit (sufficient for this use case)
- The script includes rate limiting (100ms delay between requests)
- If API quota is exceeded, the script will wait and retry
- Failed geocoding attempts will keep the original coordinates

## Example Output

```
[1/69] Somnath Jyotirlinga
  Location: Somnath Temple, Prabhas Patan, Veraval
  Current: 20.888, 70.4013
    Trying: Somnath Jyotirlinga, Somnath Temple, Prabhas Patan, Veraval, Gujarat, India...
    ✓ Found: Somnath Temple, Veraval, Gujarat 395110, India...
  ✅ Updated: 20.888089, 70.401342 (diff: 0.0001, 0.0000)
```


