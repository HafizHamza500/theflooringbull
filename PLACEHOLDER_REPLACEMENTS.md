# SEO Quick Start Guide - Placeholder Replacements

## ⚠️ CRITICAL: Update Business Information

To complete your SEO implementation, you MUST update the following placeholder values in your HTML files. These placeholders prevent your business information from appearing correctly in search results and maps.

---

## Step 1: Google Analytics Setup

### Current Placeholder:
```
G-XXXXXXXXXX
```

### What to Do:
1. Go to [Google Analytics](https://analytics.google.com)
2. Find your Google Analytics 4 Measurement ID (starts with G-)
3. Replace `G-XXXXXXXXXX` with your actual ID in ALL HTML files

### Files to Update:
Every `.html` file in your website contains this line in the `<head>` section:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Search for `G-XXXXXXXXXX` and replace with your actual tracking ID.

---

## Step 2: Business Contact Information

### Phone Number Placeholder:
```
+1-XXX-XXX-XXXX
```

### Correct Phone Number:
Based on your website traffic, use: **+1-602-638-0121**

### Where to Update:
In schema.org script tags (look for `"telephone":`):
- `index.html`
- `aboutus.html`
- `services.html`
- `contactus.html`
- `warranty.html`

---

## Step 3: Business Email

### Current Placeholder:
```
contact@theflooringbull.com
```

### What to Do:
Replace with your actual business email address in:
- `index.html`
- `aboutus.html`
- `services.html`
- `contactus.html`
- `warranty.html`

Look for: `"email": "contact@theflooringbull.com"`

---

## Step 4: Physical Business Address

### Current Placeholder (in index.html):
```json
{
  "streetAddress": "Your Address",
  "addressLocality": "Your City",
  "addressRegion": "Your State",
  "postalCode": "Your ZIP",
  "addressCountry": "US"
}
```

### What to Do:
Replace each field with your actual business information:
- **streetAddress:** Your street address (e.g., "123 Main Street")
- **addressLocality:** Your city (e.g., "Phoenix")
- **addressRegion:** Your state (e.g., "Arizona" or "AZ")
- **postalCode:** Your ZIP code (e.g., "85001")
- **addressCountry:** Keep as "US"

### Location in File:
Search for `"streetAddress": "Your Address"` in `index.html`

---

## Step 5: Social Media Links

### Current Placeholder (in index.html):
```json
"sameAs": [
  "https://www.facebook.com/theflooringbull",
  "https://www.instagram.com/theflooringbull",
  "https://www.yelp.com/biz/flooring-bull"
]
```

### What to Do:
Update these URLs with your actual social media profiles:
```json
"sameAs": [
  "https://www.facebook.com/YOUR_FACEBOOK_PAGE_URL",
  "https://www.instagram.com/YOUR_INSTAGRAM_USERNAME",
  "https://www.yelp.com/biz/YOUR_YELP_BUSINESS_ID"
]
```

### How to Find These:
1. **Facebook:** Go to your page → Copy URL from browser
2. **Instagram:** Go to your profile → Copy username
3. **Yelp:** Search for your business → Copy business ID from URL

---

## Step 6: Verification & Testing

### After Making Changes:

1. **Test Rich Snippets:**
   - Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Paste your homepage URL
   - Verify schema markup is valid

2. **Verify Sitemap:**
   - Visit `https://theflooringbull.com/robots.txt`
   - Verify it displays correctly
   - Visit `https://theflooringbull.com/sitemap.xml`
   - Verify it shows all pages

3. **Check Mobile:**
   - Use [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
   - Verify pages are mobile-optimized

4. **Submit to Google:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your website
   - Submit sitemap.xml
   - Request indexation

---

## Quick Replacement Checklist

Use your code editor's Find & Replace feature:

- [ ] Find: `G-XXXXXXXXXX` → Replace with: `YOUR_GA_ID`
- [ ] Find: `+1-XXX-XXX-XXXX` → Replace with: `+1-602-638-0121`
- [ ] Find: `contact@theflooringbull.com` → Replace with: `YOUR_EMAIL@theflooringbull.com`
- [ ] Find: `"Your Address"` → Replace with: your street address
- [ ] Find: `"Your City"` → Replace with: your city
- [ ] Find: `"Your State"` → Replace with: your state
- [ ] Find: `"Your ZIP"` → Replace with: your ZIP code
- [ ] Find: `facebook.com/theflooringbull` → Replace with: your Facebook URL
- [ ] Find: `instagram.com/theflooringbull` → Replace with: your Instagram
- [ ] Find: `yelp.com/biz/flooring-bull` → Replace with: your Yelp URL

---

## Important Notes

⚠️ **Do These Updates FIRST:**
1. Google Analytics ID (needed to track visitors)
2. Business address (helps with local search)
3. Phone number (customers need to reach you)

✅ **Then Update:**
4. Email address
5. Social media links
6. Submit sitemap to Google Search Console

---

## SEO Impact Timeline

**Immediately after updates:**
- Rich snippets may appear in search results
- Better appearance in Google Business Profile
- Social media sharing improved

**Within 1-4 weeks:**
- Pages begin to rank better
- Increased organic traffic
- Better local search visibility

**Within 3-6 months:**
- Significant ranking improvements
- Established organic traffic baseline
- Local search dominance for target keywords

---

## Questions?

If you need help with:
- Finding your Google Analytics ID: Check your Google Analytics account settings
- Verifying schema markup: Use [Schema Test Tool](https://schema.org/docs/schemas.html)
- Submitting to Google: Go to [Google Search Console Help](https://support.google.com/webmasters)

---

**Last Updated:** February 6, 2026
**Status:** Ready for implementation ✓
