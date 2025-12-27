# Loading Screen Images

## Directory: `/public/loading-screens/`

This directory contains the background images that are randomly displayed during the loading screen when users first visit the website.

## Image Requirements

- **File Names:**
  - `loading-screen-1.jpg`
  - `loading-screen-2.jpg`
  - `loading-screen-3.jpg`
  - `loading-screen-4.jpg`
  - `loading-screen-5.jpg`
  - `loading-screen-6.jpg`
  - `loading-screen-7.jpg`

- **Image Specifications:**
  - Format: JPG or PNG
  - Recommended size: 1920x1080 (Full HD) or higher
  - Aspect ratio: 16:9 (or any wide format that works well on both desktop and mobile)
  - File size: Optimized for web (ideally under 500KB per image)
  - Content: High-quality images that represent entrepreneurship, networking, business, community, or inspiration

## Image Style Guide

The loading screens should:
- Be visually appealing and professional
- Have good contrast to ensure the white logo is visible
- Work well with a 30% black overlay (applied automatically)
- Represent the Circl brand values: connection, growth, community, entrepreneurship
- Be diverse and varied to keep the experience fresh

## How It Works

1. When a user visits the website for the first time in a session, one image is randomly selected from this directory
2. The image fills the entire screen (background-cover)
3. A 30% black overlay is applied for better logo visibility
4. The Circl logo appears centered with a loading progress bar at the bottom
5. After 3 seconds, the loading screen fades out and the main app appears

## Logo Requirements

Additionally, place your logo file at:
- `/public/logo-white.png` - White version of the Circl logo (transparent background)
  - Recommended size: 512x512 or larger
  - Format: PNG with transparency
  - Should be white or light-colored for visibility on dark backgrounds

## Testing

To test the loading screen:
1. Clear your browser's session storage
2. Refresh the page
3. A random loading screen should appear for 3 seconds

## Notes

- The loading screen only shows once per browser session
- To show it again, clear session storage or open in a new incognito/private window
- You can add more images by:
  1. Adding the image file to this directory
  2. Updating the `loadingScreens` array in `/src/components/common/LoadingScreen.tsx`
