# Deploy to Vercel

Your app is a **Next.js** project and is ready to deploy. Use either method below.

---

## Option 1: Deploy from your terminal (recommended)

1. **Install Vercel CLI** (one time):
   ```bash
   npm i -g vercel
   ```
2. **From the project folder**, run:
   ```bash
   cd /Users/guramipichkhaia/Desktop/copilot
   vercel
   ```
3. **First time only:** log in when prompted (browser or token).
4. **When asked:**
   - Set up and deploy? **Y**
   - Which scope? **your account**
   - Link to existing project? **N**
   - Project name? **copilot** (or press Enter)
   - In which directory is your code? **./** (press Enter)
5. Vercel will build and deploy. You’ll get a URL like:
   ```text
   https://copilot-xxxx.vercel.app
   ```
   Use that link to open the app from anywhere.

**Later:** run `vercel --prod` from the same folder to deploy to production.

---

## Option 2: Deploy via Vercel website (GitHub)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```
2. Open **https://vercel.com** and sign in (e.g. with GitHub).
3. Click **Add New… → Project**.
4. **Import** your `copilot` repo.
5. Leave **Framework Preset** as **Next.js** and **Root Directory** as `.` → **Deploy**.
6. When the build finishes, Vercel will show your live URL, e.g.:
   ```text
   https://copilot-xxxx.vercel.app
   ```
   Every push to `main` will trigger a new deployment.

---

## Notes

- The link (e.g. `https://copilot-xxxx.vercel.app`) is public: anyone with the URL can open the app.
- For a custom domain, use **Project → Settings → Domains** in the Vercel dashboard.
