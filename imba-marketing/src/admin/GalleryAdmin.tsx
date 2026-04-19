import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MediaFile } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react'

type GalleryImage = MediaFile

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editCaption, setEditCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .like('filename', 'gallery/%')
      .order('created_at', { ascending: false })
    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadFiles(fileList: FileList) {
    if (!fileList.length) return
    setUploading(true)
    setUploadError('')
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('media')
        .upload(`gallery/${Date.now()}-${file.name}`, file, { contentType: file.type })
      if (uploadErr) {
        setUploadError(uploadErr.message)
        continue
      }
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path)
      await supabase.from('media_files').insert([{
        filename: uploadData.path,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        url: publicUrl,
        alt: '',
        caption: '',
      }])
    }
    setUploading(false)
    load()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(e.target.files)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files)
  }, [])

  async function deleteImage(img: GalleryImage) {
    if (!confirm('Delete this gallery image permanently?')) return
    await supabase.storage.from('media').remove([img.filename])
    await supabase.from('media_files').delete().eq('id', img.id)
    setImages(prev => prev.filter(f => f.id !== img.id))
    if (editingId === img.id) setEditingId(null)
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id)
    setEditAlt(img.alt || '')
    setEditCaption(img.caption || '')
  }

  async function saveEdit() {
    if (!editingId) return
    await supabase.from('media_files').update({ alt: editAlt, caption: editCaption }).eq('id', editingId)
    setImages(prev => prev.map(f => f.id === editingId ? { ...f, alt: editAlt, caption: editCaption } : f))
    setEditingId(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">{images.length} images — displayed on /gallery page</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          Upload Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {uploadError && <p className="text-destructive text-sm mb-4">{uploadError}</p>}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          Drag & drop images here, or click Upload above
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP supported</p>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No gallery images yet. Upload some to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || img.original_name || ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => startEdit(img)}
                >
                  Edit details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                  onClick={() => deleteImage(img)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>

              {/* Caption */}
              {img.caption && (
                <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit panel */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingId(null)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit Image Details</h3>
            <div className="flex flex-col gap-4">
              <div>
                <img
                  src={images.find(i => i.id === editingId)?.url}
                  alt=""
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Alt text</Label>
                <Input value={editAlt} onChange={e => setEditAlt(e.target.value)} placeholder="Describe the image..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Caption</Label>
                <Input value={editCaption} onChange={e => setEditCaption(e.target.value)} placeholder="Optional caption shown on gallery..." />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
