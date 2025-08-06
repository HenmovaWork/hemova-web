# Vercel Blob Storage Setup

## What Changed

Both contact and job application APIs now use **Vercel Blob Storage** instead of local file system storage. This ensures compatibility with Vercel's serverless environment.

### Changes Made:

1. **Installed Vercel Blob Storage**: `@vercel/blob` package
2. **Updated Job Applications API** (`/app/api/job-applications/route.ts`):

   - Removed local file system operations
   - Files are now uploaded to Vercel Blob Storage
   - File URLs are stored in the database instead of local paths

3. **Updated Contact API** (`/app/api/contact/route.ts`):
   - Removed local file system operations
   - Files are now uploaded to Vercel Blob Storage
   - File URLs are stored in the database instead of local paths

## Environment Setup

### 1. Get Vercel Blob Storage Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Blob**
3. Create a new Blob Store if you don't have one
4. Copy the **Read/Write Token**

### 2. Update Environment Variables

Add this to your `.env` file:

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_YOUR_ACTUAL_TOKEN_HERE"
```

### 3. Vercel Deployment

When deploying to Vercel, make sure to add the environment variable:

1. Go to your project settings in Vercel Dashboard
2. Navigate to **Environment Variables**
3. Add `BLOB_READ_WRITE_TOKEN` with your actual token
4. Redeploy your application

## File Organization

Files are now organized in Vercel Blob Storage as:

- **Job Applications**: `job-applications/jobSlug_name_timestamp.ext`
- **Contact Forms**: `contact-forms/contact_name_timestamp.ext`

## Benefits

✅ **Vercel Compatible**: Works perfectly on Vercel's serverless platform
✅ **Scalable**: No file system limitations
✅ **CDN**: Files are served via CDN for fast access
✅ **Persistent**: Files persist across deployments
✅ **Secure**: Public access controlled via Vercel's security

## File Access

Files uploaded are set with `public` access, meaning they can be accessed directly via their URLs stored in the database.
