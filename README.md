# Fat-Loss Activity Dashboard

A lightweight, phone-friendly tracker for the Phase 1 starter plan: moderate fasting, protein at meals, reduced sugar/refined carbs, lighter evenings, strength training, golf/walks, HIIT, sleep, stress resets, and scale check-ins.

## Test it from your phone

### Option 1: Publish with GitHub Pages

This repo includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.

1. Merge the dashboard into the repository's default branch (`main` or `master`).
2. In GitHub, open **Settings → Pages** for the repository.
3. Set **Source** to **GitHub Actions** if it is not already selected.
4. Open **Actions → Deploy dashboard to GitHub Pages** and run it, or push to `main` or `master` to trigger it automatically.
5. When the workflow finishes, open the published Pages URL on your phone.
6. Optional: use your mobile browser's **Add to Home Screen** action to keep it as an app-like shortcut.

> Your entries are stored in the browser's local storage on the device you use. Entries saved on a laptop will not automatically sync to your phone.

### Option 2: Same Wi-Fi local test

If you only want to test from your phone while your computer is running the app:

```bash
npm install
npm run phone
```

Then find your computer's local network IP address and open this URL from your phone while both devices are on the same Wi-Fi network:

```text
http://YOUR-COMPUTER-IP:5173/
```

Examples of local IP addresses often look like `192.168.1.23` or `10.0.0.14`.

## Development commands

```bash
npm install
npm run phone      # development server exposed to your local network
npm run build      # production static build in dist/
npm run preview    # preview the built dashboard on your local network
npm test           # syntax check and production build
```
