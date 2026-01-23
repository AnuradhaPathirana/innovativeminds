# Image Upload Feature - Complete Implementation Guide

## 🎯 Overview

This document describes the complete file upload implementation for program images in the admin panel.

---

## 📊 Database Schema

### Updated Programs Table Schema

```sql
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Laptop',
    image VARCHAR(500) DEFAULT NULL COMMENT 'Path to uploaded image',
    features JSON NOT NULL,
    duration VARCHAR(50),
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Key Changes:
- **`image` column**: VARCHAR(500) - Stores the relative path to uploaded images
- **Example value**: `/uploads/programs/virtual-assistant-1737456789123.jpg`

---

## 🗂️ File Structure

### Backend Files Created/Modified:

1. **`server/upload.ts`** (NEW)
   - Multer configuration for file uploads
   - File validation (type, size)
   - Storage configuration
   - Helper functions for image management

2. **`server/routes.ts`** (MODIFIED)
   - Added static file serving for `/uploads`
   - Added POST `/api/admin/upload/program-image` endpoint
   - Updated DELETE endpoint to remove image files

3. **`database/update_programs_with_image.sql`** (NEW)
   - Migration script to add image column

### Frontend Files Modified:

1. **`client/src/pages/Modules.tsx`**
   - Added file upload input
   - Added image preview
   - Added upload progress state
   - File validation on client side

---

## 🔧 Implementation Details

### 1. File Upload Configuration

**Location**: `server/upload.ts`

```typescript
// Storage Configuration
- Directory: /uploads/programs/
- Filename Format: {sanitized-name}-{timestamp}-{random}.{ext}
- Example: virtual-assistant-1737456789-123456789.jpg

// File Validation
- Allowed Types: JPEG, JPG, PNG, GIF, WebP
- Max Size: 5MB
- MIME Type Check: Yes
```

### 2. API Endpoints

#### Upload Image
```
POST /api/admin/upload/program-image
Authorization: Required (Admin session)
Content-Type: multipart/form-data

Request Body:
- image: File (form-data)

Response:
{
  "success": true,
  "imageUrl": "/uploads/programs/filename.jpg",
  "filename": "filename.jpg"
}
```

#### Static File Serving
```
GET /uploads/programs/{filename}
Authorization: None (Public)

Returns: Image file
```

### 3. Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     UPLOAD WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. User selects image file in admin panel
   ↓
2. Client-side validation (type, size)
   ↓
3. Preview generated using FileReader
   ↓
4. User clicks "Save" or "Update"
   ↓
5. Image uploaded to /api/admin/upload/program-image
   ↓
6. Server validates and saves to /uploads/programs/
   ↓
7. Server returns image URL path
   ↓
8. Program created/updated with image path in database
   ↓
9. Image displayed on website via /uploads/programs/{filename}
```

---

## 📝 Database Migration

### Run this SQL to add the image column:

```sql
USE innovativeminds;

-- Add image column if it doesn't exist
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS image VARCHAR(500) DEFAULT NULL 
AFTER icon;

-- Verify the change
DESCRIBE programs;
```

**Migration File**: `database/update_programs_with_image.sql`

---

## 🎨 Admin Panel Features

### File Upload Input
- **Type**: File input with drag-and-drop support
- **Accept**: image/*
- **Validation**: 
  - File type check (client + server)
  - File size check (max 5MB)
  - Real-time error messages

### Image Preview
- **Live preview** after file selection
- **Remove button** (X) to clear selection
- **Filename display** on preview
- **Existing image** shown when editing

### Upload Progress
- **Loading state** during upload
- **Button disabled** while uploading
- **Progress text**: "Uploading..." → "Saving..."

---

## 🔒 Security Features

### 1. File Validation
```typescript
✅ MIME type checking (server-side)
✅ File extension validation
✅ File size limits (5MB)
✅ Sanitized filenames (removes special characters)
```

### 2. Access Control
```typescript
✅ Upload endpoint requires admin authentication
✅ Session-based authentication
✅ CSRF protection via credentials
```

### 3. File Storage
```typescript
✅ Unique filenames (timestamp + random)
✅ Organized directory structure
✅ Automatic directory creation
✅ Old image cleanup on update/delete
```

---

## 🚀 Usage Guide

### For Administrators:

1. **Login to Admin Panel**
   - Navigate to `/admin`
   - Login with credentials

2. **Create/Edit Program**
   - Click "Add New Module" or edit existing
   - Fill in program details
   - Click "Choose File" under "Program Image"
   - Select an image (JPEG, PNG, GIF, WebP)
   - Preview appears automatically
   - Click "Create" or "Update"

3. **Remove Image**
   - Click the X button on preview
   - Or select a new image to replace

### For Developers:

1. **Install Dependencies**
   ```bash
   npm install multer
   npm install --save-dev @types/multer
   ```

2. **Run Database Migration**
   ```sql
   -- Run in HeidiSQL or MySQL client
   source database/update_programs_with_image.sql
   ```

3. **Restart Server**
   ```bash
   npm run dev
   ```

4. **Test Upload**
   - Go to `/admin/modules`
   - Create a test program with image
   - Verify image appears on homepage

---

## 📁 File System Structure

```
innovativeminds/
├── uploads/                    (Created automatically)
│   └── programs/              (Program images)
│       ├── virtual-assistant-1737456789-123.jpg
│       ├── business-manager-1737456790-456.png
│       └── ai-tools-1737456791-789.webp
│
├── server/
│   ├── upload.ts              (NEW - Upload configuration)
│   └── routes.ts              (MODIFIED - Added upload endpoint)
│
├── database/
│   └── update_programs_with_image.sql  (NEW - Migration)
│
└── client/src/pages/
    └── Modules.tsx            (MODIFIED - File upload UI)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'multer'"
**Solution**: 
```bash
npm install multer @types/multer
```

### Issue: "Failed to upload image"
**Check**:
1. Admin is logged in
2. File is valid image format
3. File size is under 5MB
4. Server has write permissions to `/uploads` directory

### Issue: "Image not displaying on website"
**Check**:
1. Image path is correct in database
2. `/uploads` directory exists
3. Static file serving is configured
4. File exists in `/uploads/programs/`

### Issue: "Old images not being deleted"
**Check**:
1. `deleteImageFile()` function is called
2. File path format is correct
3. Server has delete permissions

---

## 🎯 Testing Checklist

- [ ] Upload JPEG image
- [ ] Upload PNG image
- [ ] Upload GIF image
- [ ] Upload WebP image
- [ ] Try uploading non-image file (should fail)
- [ ] Try uploading >5MB file (should fail)
- [ ] Preview shows correctly
- [ ] Remove image works
- [ ] Image appears on program card
- [ ] Image appears in modal
- [ ] Edit program keeps existing image
- [ ] Replace image deletes old one
- [ ] Delete program removes image file

---

## 📊 Performance Considerations

### Image Optimization Recommendations:

1. **Resize images before upload** (recommended: 800x450px)
2. **Use WebP format** for better compression
3. **Compress images** to reduce file size
4. **Consider CDN** for production deployment

### Future Enhancements:

- [ ] Automatic image resizing on server
- [ ] Image compression
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Drag-and-drop upload
- [ ] Bulk image upload
- [ ] Image cropping tool

---

## 📚 Related Files

- **Database Schema**: `database/programs.sql`
- **Migration**: `database/update_programs_with_image.sql`
- **Upload Config**: `server/upload.ts`
- **API Routes**: `server/routes.ts`
- **Admin UI**: `client/src/pages/Modules.tsx`
- **Program Card**: `client/src/components/ProgramCard.tsx`
- **Program Modal**: `client/src/components/ProgramModal.tsx`

---

## ✅ Summary

The image upload feature is now fully implemented with:

✅ **Database**: Image column added to programs table
✅ **Backend**: Multer upload handler with validation
✅ **API**: Upload endpoint with authentication
✅ **Storage**: Local file system storage
✅ **Frontend**: File input with preview
✅ **Display**: Images shown on cards and modals
✅ **Security**: File validation and access control
✅ **Cleanup**: Old images deleted on update/delete

**Ready to use!** 🚀
