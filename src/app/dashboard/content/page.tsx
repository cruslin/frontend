'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { upload } from '@/lib/api'
import { getPageContent, normalizePath, savePageContent } from '@/lib/site-content'
import { useToast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import { ArrowUpRight, ImagePlus, Save } from 'lucide-react'

const knownPages = [
  '/',
  '/about',
  '/events',
  '/give',
  '/grow',
  '/grow/intentionality-class',
  '/kingdom-expressions',
  '/kingdom-expressions/squads',
  '/kingdom-expressions/kip',
  '/resources/audio',
  '/resources/video',
  '/training/tema',
  '/training/kisolam',
  '/training/eis',
  '/contact',
  '/prayer',
  '/testimonies',
  '/blog',
]

export default function ContentEditorPage() {
  const [pagePath, setPagePath] = useState('/grow/intentionality-class')
  const [writeUp, setWriteUp] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const content = getPageContent(pagePath)
    setWriteUp(content.writeUp)
    setImages(content.images)
  }, [pagePath])

  const handlePageChange = (value: string) => {
    const normalized = normalizePath(value)
    setPagePath(normalized)
  }

  const handleSave = () => {
    setIsSaving(true)
    try {
      savePageContent(pagePath, {
        writeUp,
        images,
      })
      success('Page content saved successfully.')
    } catch (err) {
      error('Unable to save page content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadImage = async (file: File) => {
    setIsUploading(true)
    try {
      const result = await upload.image(file)
      setImages((current) => [...current, result.url])
      success('Image uploaded successfully.')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Image upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FAFAF8] py-10">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="rounded-[24px] border border-[#E8E6F0] bg-white p-10 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#C9A84C] font-semibold">Content Editor</p>
                <h1 className="text-4xl font-heading font-bold text-[#0E0B1E] mt-2">
                  Edit website write-ups & page images
                </h1>
              </div>
              <div className="space-y-2 text-sm text-[#8A8A90]">
                <p>Use this page to store landing copy and media for any route.</p>
                <p>Display content by rendering the <code className="rounded bg-[#FAFAF8] px-1 py-0.5 font-mono text-xs">EditableContent</code> component on the target page.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
              <div className="rounded-[20px] border border-[#E8E6F0] bg-[#F7F5FF] p-6">
                <h2 className="text-xl font-semibold text-[#0E0B1E] mb-4">Page Target</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#0E0B1E]">Page path</label>
                  <input
                    value={pagePath}
                    onChange={(event) => handlePageChange(event.target.value)}
                    className="w-full rounded-xl border border-[#D8D1E5] bg-white px-4 py-3 text-sm text-[#0E0B1E] focus:border-[#C9A84C] focus:outline-none"
                    placeholder="/grow/intentionality-class"
                  />

                  <div className="grid gap-2">
                    {knownPages.map((path) => (
                      <button
                        key={path}
                        type="button"
                        onClick={() => handlePageChange(path)}
                        className={`text-left rounded-xl px-4 py-3 text-sm font-medium transition ${pagePath === path ? 'bg-[#C9A84C] text-white' : 'bg-white text-[#0E0B1E] hover:bg-[#F1EDFF]'}`}
                      >
                        {path}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[20px] border border-[#E8E6F0] bg-white p-6">
                  <h2 className="text-xl font-semibold text-[#0E0B1E] mb-4">Write-up</h2>
                  <textarea
                    value={writeUp}
                    onChange={(event) => setWriteUp(event.target.value)}
                    rows={10}
                    className="w-full rounded-3xl border border-[#D8D1E5] bg-[#F7F5FF] px-5 py-4 text-sm text-[#0E0B1E] focus:border-[#C9A84C] focus:outline-none"
                    placeholder="Enter the page content you want to display."
                  />
                </div>

                <div className="rounded-[20px] border border-[#E8E6F0] bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[#0E0B1E]">Images</h2>
                      <p className="text-sm text-[#8A8A90]">Upload or paste image URLs for this page.</p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="inline-flex items-center gap-2"
                      onClick={() => document.getElementById('image-upload-input')?.click()}
                    >
                      <ImagePlus className="w-4 h-4" /> Upload
                    </Button>
                  </div>
                  <input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        handleUploadImage(file)
                      }
                    }}
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <input
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        type="text"
                        placeholder="Paste an image URL"
                        className="min-w-0 flex-1 rounded-xl border border-[#D8D1E5] bg-[#F7F5FF] px-4 py-3 text-sm text-[#0E0B1E] focus:border-[#C9A84C] focus:outline-none"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        className="whitespace-nowrap"
                        onClick={() => {
                          if (!imageUrl.trim()) return
                          setImages((current) => [...current, imageUrl.trim()])
                          setImageUrl('')
                        }}
                      >
                        Add URL
                      </Button>
                    </div>
                    {images.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {images.map((url, index) => (
                          <div key={url + index} className="group relative overflow-hidden rounded-3xl border border-[#E8E6F0] bg-[#F7F5FF]">
                            <img src={url} alt={`Page media ${index + 1}`} className="h-36 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setImages((current) => current.filter((_, idx) => idx !== index))}
                              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#8A8A90]">No images added for this page yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between flex-col gap-4 sm:flex-row">
              <div className="text-sm text-[#8A8A90]">
                <p className="font-semibold text-[#0E0B1E]">Display Notes</p>
                <p>
                  To render this content on the target page, add <code className="rounded bg-[#FAFAF8] px-1 py-0.5 font-mono text-xs">&lt;EditableContent pagePath="{pagePath}" /&gt;</code> in that page's component tree.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Content'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
