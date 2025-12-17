# Travel Itinerary Template - Setup Guide

This is now a reusable travel itinerary template that can be configured for any trip!

## First Time Setup

When you open `index.html` for the first time (or after resetting), you'll see a **Setup Wizard** with 3 steps:

### Step 1: Basic Information
- **Trip Title**: The name of your trip (e.g., "Winter in Seoul", "Tokyo Adventure")
- **Location/Theme**: The destination or theme (optional)
- **Start Date**: Trip start date
- **End Date**: Trip end date

The wizard will automatically calculate the number of days and create a daily schedule structure.

### Step 2: Background Media
Choose how you want your hero section to look:

- **Video**: Upload a background video (MP4, WebM)
- **Image**: Upload a background image (JPG, PNG, WebP)
- **Solid Color**: Choose a solid background color

The uploaded media will be stored in your browser and displayed as the hero background.

### Step 3: Import Schedule
- **Upload Schedule File** (optional): Import a previously exported schedule `.txt` or `.json` file
- **Create Empty Schedule**: If checked and no file is uploaded, creates blank day cards for manual entry

## Using the Template

### Managing Your Schedule
- Click on dates to switch between days
- Click the **+** button at the end of each day to add new schedule items
- Click the **edit icon** (✏️) on any item to modify it
- Drag and drop items to reorder them or move between days

### Exporting Your Schedule
- Click **"匯出行程" (Export Schedule)** in the footer to save your schedule as a file
- This file can be imported into a new trip or shared with others

### Importing a Schedule
- Click **"匯入行程" (Import Schedule)** to load a previously exported schedule file
- The schedule will replace your current itinerary

### Reset Configuration
- Click **"重新設定" (Reset Configuration)** in the footer
- This will clear all settings and schedule data and restart the setup wizard
- ⚠️ Make sure to export your schedule before resetting!

## Data Storage

All your data is stored locally in your browser using `localStorage`:
- **Trip Configuration**: Title, dates, background media
- **Schedule Data**: All your daily itinerary items

This means:
- ✅ Your data persists between sessions
- ✅ No internet connection required after initial load
- ⚠️ Clearing browser data will delete your trip
- ⚠️ Data is not synced across devices

## Tips

1. **Backup Regularly**: Export your schedule frequently to have backups
2. **Browser Compatibility**: Works best in modern browsers (Chrome, Firefox, Safari, Edge)
3. **Media Size**: Large video files will be stored in browser storage, keep them reasonable size
4. **Reusability**: You can maintain multiple versions by exporting different trip schedules

## Technical Notes

- All hardcoded Seoul trip data has been removed
- Background video is no longer bundled, you upload your own
- Date navigation is dynamically generated based on your date range
- The template supports trips of any length (1 day to months)

Enjoy planning your travels! ✈️
