# Subscription Background Images

## Directory: `/public/subscription-backgrounds/`

This directory contains the background images for the subscription paywall modal. Each user type has its own branded background image.

## Required Background Images

Place the following images in this directory:

### Entrepreneur
- `EntrepreneurPaywall.jpg` - Main entrepreneur subscription background
- `EntrepreneurPaywall2.jpg` - Alternative entrepreneur background (optional)

### Student
- `StudentPaywall.jpg` - Main student subscription background
- `StudentPaywall2.jpg` - Alternative student background (optional)
- `StudentPaywall3.jpg` - Third alternative (optional)

### Student Entrepreneur
- `StudentEntrepreneurPaywall.jpg` - Main student entrepreneur background
- `StudentEntrepreneurPaywall2.jpg` - Alternative (optional)

### Mentor
- `MentorPaywall.jpg` - Main mentor subscription background
- `MentorPaywall2.jpg` - Alternative mentor background (optional)
- `MentorPaywall3.jpg` - Third alternative (optional)

### Community Builder
- `CommunityBuilderPaywall.jpg` - Main community builder background
- `CommunityBuilderPaywall2.jpg` - Alternative (optional)

### Investor
- `InvestorPaywall.jpg` - Main investor subscription background
- `InvestorPaywall2.jpg` - Alternative investor background (optional)
- `InvestorPaywall3.jpg` - Third alternative (optional)

## Image Specifications

- **Format:** JPG or PNG
- **Recommended Size:** 1920x1080 (Full HD) minimum
- **Aspect Ratio:** 16:9 or similar wide format
- **File Size:** Optimized for web (ideally under 300KB per image)
- **Content:** High-quality images representing each user type's theme

## Design Considerations

- Images should have good contrast and depth
- Work well with a 30% black overlay
- Represent the Circl brand values
- Be visually distinct for each user type
- Professional, modern appearance

## How It's Used

When a user triggers the subscription paywall:
1. The background image appears immediately for visual impact
2. A 30% dark overlay is applied for better text readability
3. The content (title, benefits, plans) slides in after 0.6 seconds
4. The image creates a premium, immersive experience

## Testing

To test the paywall:
1. Import `useSubscription` from context
2. Call `showPaywall('entrepreneur')` or other user types
3. The paywall modal will appear with the corresponding background
