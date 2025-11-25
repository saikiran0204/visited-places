#!/usr/bin/env python3
"""
Script to update exact GPS coordinates for specific temple locations.
Uses Google Maps Geocoding API for accurate temple coordinates.
"""

import json
import time
import os
import requests
from urllib.parse import quote

# Google Maps Geocoding API
GOOGLE_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'AIzaSyAqegtCIM3xGFOyjsD-hPpR61A2DiTq4tU')

def get_temple_coordinates_google(temple_name, location_string, state, country="India"):
    """Get coordinates using Google Maps Geocoding API."""
    if not GOOGLE_API_KEY:
        print("    ⚠️  GOOGLE_MAPS_API_KEY not set. Set it as environment variable.")
        return None, None
    
    try:
        # Priority queries for Google API
        queries = [
            f"{temple_name}, {location_string}, {state}, {country}",
            f"{temple_name}, {state}, {country}",
            f"{temple_name}, {location_string}",
            f"{temple_name}",
        ]
        
        for query in queries:
            try:
                print(f"    Trying: {query[:70]}...")
                # Google Geocoding API request
                url = f"https://maps.googleapis.com/maps/api/geocode/json"
                params = {
                    'address': query,
                    'key': GOOGLE_API_KEY,
                    'region': 'in'  # Bias results to India
                }
                
                response = requests.get(url, params=params, timeout=10)
                data = response.json()
                
                if data['status'] == 'OK' and len(data['results']) > 0:
                    result = data['results'][0]
                    lat = result['geometry']['location']['lat']
                    lng = result['geometry']['location']['lng']
                    address = result['formatted_address']
                    print(f"    ✓ Found: {address[:80]}...")
                    return lat, lng
                elif data['status'] == 'ZERO_RESULTS':
                    continue
                elif data['status'] == 'OVER_QUERY_LIMIT':
                    print(f"    ⚠️  API quota exceeded. Waiting 2 seconds...")
                    time.sleep(2)
                    continue
                else:
                    print(f"    ⚠️  API status: {data['status']}")
                    
            except requests.exceptions.RequestException as e:
                print(f"    Request error: {e}")
                continue
            except Exception as e:
                print(f"    Error: {e}")
                continue
        
        # If no results, try with location string only
        try:
            query = f"{location_string}, {state}, {country}"
            url = f"https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                'address': query,
                'key': GOOGLE_API_KEY,
                'region': 'in'
            }
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if data['status'] == 'OK' and len(data['results']) > 0:
                result = data['results'][0]
                lat = result['geometry']['location']['lat']
                lng = result['geometry']['location']['lng']
                address = result['formatted_address']
                print(f"    ✓ Found (location only): {address[:80]}...")
                return lat, lng
        except:
            pass
            
    except Exception as e:
        print(f"    Error: {e}")
        return None, None
    
    return None, None

def update_temple_coordinates():
    """Update temple coordinates using temple names."""
    with open('src/data/locations.json', 'r', encoding='utf-8') as f:
        locations = json.load(f)
    
    updated_locations = []
    updates_made = 0
    failed_updates = []
    
    for loc in locations:
        location_string = loc.get('location', '')
        state = loc.get('state', '')
        temple_name = loc.get('name', '')
        current_lat = loc.get('lat')
        current_lng = loc.get('lng')
        
        print(f"\n[{loc['id']}/69] {temple_name}")
        print(f"  Location: {location_string}")
        print(f"  Current: {current_lat}, {current_lng}")
        
        # Get new coordinates using Google Maps API
        new_lat, new_lng = get_temple_coordinates_google(temple_name, location_string, state)
        
        if new_lat and new_lng:
            # Check if coordinates are significantly different (more than 0.01 degrees ~1km)
            lat_diff = abs(current_lat - new_lat)
            lng_diff = abs(current_lng - new_lng)
            
            if lat_diff > 0.01 or lng_diff > 0.01:
                loc['lat'] = round(new_lat, 6)
                loc['lng'] = round(new_lng, 6)
                updates_made += 1
                print(f"  ✅ Updated: {loc['lat']}, {loc['lng']} (diff: {lat_diff:.4f}, {lng_diff:.4f})")
            else:
                print(f"  ✓ Accurate (diff: {lat_diff:.4f}, {lng_diff:.4f})")
        else:
            print(f"  ⚠️  Could not geocode. Keeping original.")
            failed_updates.append({
                'name': temple_name,
                'location': location_string
            })
        
        updated_locations.append(loc)
        
        # Rate limiting for Google API (free tier: 50 requests/second)
        time.sleep(0.1)  # 100ms delay should be safe
    
    # Write updated locations back to file
    if updates_made > 0:
        with open('src/data/locations.json', 'w', encoding='utf-8') as f:
            json.dump(updated_locations, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Updated {updates_made} location(s) with accurate temple coordinates.")
    else:
        print(f"\n✓ All coordinates appear accurate. No updates needed.")
    
    if failed_updates:
        print(f"\n⚠️  Failed to geocode {len(failed_updates)} location(s):")
        for failed in failed_updates[:10]:  # Show first 10
            print(f"  - {failed['name']}: {failed['location']}")
        if len(failed_updates) > 10:
            print(f"  ... and {len(failed_updates) - 10} more")
    
    return updates_made

if __name__ == "__main__":
    if not GOOGLE_API_KEY:
        print("⚠️  WARNING: GOOGLE_MAPS_API_KEY environment variable not set!")
        print("   Set it with: export GOOGLE_MAPS_API_KEY='your-api-key'")
        print("   Or create a .env file with: GOOGLE_MAPS_API_KEY=your-api-key")
        print("\n   Get your API key from: https://console.cloud.google.com/google/maps-apis")
        print("\n   Continuing anyway, but geocoding will fail...\n")
    
    print("Starting temple coordinate update using Google Maps Geocoding API...")
    print("This will geocode each temple by its name to get accurate coordinates.\n")
    updates = update_temple_coordinates()
    print(f"\nProcess completed. {updates} location(s) updated.")

