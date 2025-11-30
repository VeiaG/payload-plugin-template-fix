import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { gcsStorage } from '@payloadcms/storage-gcs'
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { VideoUploadCollection } from './collections/VideoUpload/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection, VideoUploadCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  plugins: [
    // GCS Storage Plugin for testing client upload metadata issue
    // See: test/_community/CLIENT_UPLOAD_REPRO_README.md for reproduction instructions
    gcsStorage({
      collections: {
        'video-uploads': true,
      },
      clientUploads: true,
      bucket: process.env.GCS_BUCKET || '',
      options: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
        apiEndpoint: process.env.GCS_ENDPOINT,
        projectId: process.env.GCS_PROJECT_ID,
      },
    }),
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
