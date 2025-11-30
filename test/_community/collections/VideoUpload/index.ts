import type { CollectionConfig } from 'payload'

export const videoUploadSlug = 'video-uploads'

/**
 * This collection is for reproducing the client upload metadata issue with GCS storage.
 *
 * To test:
 * 1. Configure GCS storage plugin with clientUploads: true
 * 2. Upload a video file via admin UI
 * 3. Check the saved document metadata:
 *    - size should be correct (actual file size)
 *    - mimeType should be correct (e.g., video/mp4)
 *
 * Expected bug without patch:
 * - File in GCS gets overwritten with 21-byte corrupted file
 * - size: 21 (wrong)
 * - mimeType: text/plain;charset=UTF-8 (wrong)
 *
 * Expected behavior with patch:
 * - File in GCS preserved correctly (37MB)
 * - size: 37000000 (correct)
 * - mimeType: text/plain;charset=UTF-8 (still wrong - known issue)
 */
export const VideoUploadCollection: CollectionConfig = {
  slug: videoUploadSlug,
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    mimeTypes: ['video/*', 'application/octet-stream'],
  },
}
