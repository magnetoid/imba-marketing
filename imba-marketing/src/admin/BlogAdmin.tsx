import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Loader2, FileText } from 'lucide-react'

function statusVariant(status?: string): 'secondary' | 'default' | 'outline' {
  if (status === 'published') return 'default'
  if (status === 'scheduled') return 'outline'
  return 'secondary'
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(name, slug)')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
  }

  async function togglePublished(post: BlogPost) {
    await supabase.from('blog_posts').update({
      published: !post.published,
      published_at: !post.published ? new Date().toISOString() : null,
      status: !post.published ? 'published' : 'draft',
    }).eq('id', post.id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage articles and insights</p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New post
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-border rounded-lg">
          <FileText className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No posts yet</p>
          <p className="text-muted-foreground/60 text-xs mt-1 mb-4">Create your first article</p>
          <Button asChild size="sm">
            <Link to="/admin/blog/new">
              <Plus className="h-4 w-4 mr-1" />
              New post
            </Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Read time</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell>
                  <Link to={`/admin/blog/${post.id}`} className="hover:text-primary transition-colors">
                    <div className="font-medium text-foreground">{post.title}</div>
                    <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
                  </Link>
                </TableCell>
                <TableCell>
                  {post.blog_categories ? (
                    <Badge variant="secondary" className="text-xs">{post.blog_categories.name}</Badge>
                  ) : post.category ? (
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(post.status)} className="text-xs capitalize">
                    {post.status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {post.read_time_minutes ? `${post.read_time_minutes} min` : '—'}
                </TableCell>
                <TableCell>
                  <Switch checked={post.published} onCheckedChange={() => togglePublished(post)} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono text-xs">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/blog/${post.id}`}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
