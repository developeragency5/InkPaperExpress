# Deployment Guide - Ink & Paper Express

## Deploy to Vercel

### Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Git repository with your code
3. Vercel CLI installed (optional but recommended)

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your repository
   - Select the repository containing this code

3. **Configure Build Settings**
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables (Optional)**
   - Add any environment variables you need:
     - `BASE_URL`: Your domain (e.g., https://your-app.vercel.app)
     - `NODE_ENV`: production

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `ink-paper-express`
   - In which directory is your code located? `./`

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Post-Deployment Steps

1. **Custom Domain (Optional)**
   - In Vercel dashboard, go to your project
   - Click "Domains" tab
   - Add your custom domain

2. **SEO Configuration**
   - Your sitemap will be available at: `https://your-domain.com/sitemap.xml`
   - Your robots.txt will be available at: `https://your-domain.com/robots.txt`

3. **Test Your Deployment**
   - Visit your deployed URL
   - Test the shopping functionality
   - Verify admin panel at `/admin`
   - Check SEO features work correctly

### File Structure for Vercel
```
your-project/
├── server/
│   └── index.ts          # Main server file
├── client/
│   ├── src/
│   └── index.html
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

### Troubleshooting

**Build Failures:**
- Check that all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Verify all imports use correct paths

**Runtime Errors:**
- Check Vercel function logs in dashboard
- Ensure environment variables are set
- Verify API routes are working

**SEO Issues:**
- Confirm sitemap.xml loads correctly
- Test meta tags with social media debuggers
- Verify structured data with Google's Rich Results Test

### Production Checklist

- [ ] All pages load correctly
- [ ] Shopping cart functions work
- [ ] Admin panel is accessible
- [ ] SEO meta tags are present
- [ ] Sitemap.xml generates properly
- [ ] Image uploads work (if using external storage)
- [ ] Performance is acceptable
- [ ] Mobile responsiveness is good

### Support
- Vercel Documentation: https://vercel.com/docs
- Contact support if deployment issues persist