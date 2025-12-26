# Circl Web App Deployment Instructions

_Last updated: December 26, 2025_

This guide explains how to deploy the Circl web app (React/Vite) to production on Google Cloud Platform (GCP), making it accessible from browsers and connected to your Django backend.

---

## 1. Build the Production Bundle

In your project root, run:

```bash
npm run build
```

This creates a `dist` folder with static files (HTML, JS, CSS, assets).

---

## 2. Deploy to Google Cloud Storage (GCS)

### a. Create a GCS bucket (if you haven’t):
```bash
gsutil mb -p [YOUR_PROJECT_ID] -c standard -l [YOUR_REGION] gs://[YOUR_BUCKET_NAME]
```

### b. Set the bucket as a website:
```bash
gsutil web set -m index.html -e 404.html gs://[YOUR_BUCKET_NAME]
```

### c. Upload your build:
```bash
gsutil -m rsync -r dist gs://[YOUR_BUCKET_NAME]
```

### d. Make files public (for public web):
```bash
gsutil iam ch allUsers:objectViewer gs://[YOUR_BUCKET_NAME]
```

### e. (Optional) Set up a custom domain and HTTPS via GCP Console.

---

## 3. Connect to Your Django Backend

- Ensure your React app’s API calls point to your Django backend’s public URL (use environment variables like `VITE_API_URL`).
- Make sure CORS is configured on Django to allow requests from your frontend domain.

---

## 4. (Optional) Use Cloud CDN

- Enable Cloud CDN on your bucket for faster global delivery.

---

## 5. Test Your Deployment

- Visit `https://storage.googleapis.com/[YOUR_BUCKET_NAME]/index.html` or your custom domain.
- Check that the app loads and API calls work.

---

## 6. Automate (Optional)

- Use GitHub Actions or Cloud Build to automate deployment on push.

---

## References
- [Host a static website on Cloud Storage](https://cloud.google.com/storage/docs/hosting-static-website)
- [React deployment best practices](https://vitejs.dev/guide/static-deploy.html)
- [Django CORS setup](https://pypi.org/project/django-cors-headers/)

---

**Summary:**
- Build with `npm run build`, upload the `dist` folder to a GCS bucket, set up public access and CORS, and point your domain to the bucket. Make sure your frontend API URLs match your Django backend’s public endpoint.
