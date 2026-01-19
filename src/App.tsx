import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, getBlogById, createBlog } from './api/blogs'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(true) // Start in "Create Mode"
  
  // Form State
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const queryClient = useQueryClient()

  // 1. Fetch All Blogs
  const { data: blogs, isLoading: loadingList } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  })

  // 2. Fetch Single Blog Details (Only runs if a blog is selected)
  const { data: selectedBlog, isLoading: loadingBlog } = useQuery({
    queryKey: ['blog', selectedId],
    queryFn: () => getBlogById(selectedId!),
    enabled: !!selectedId && !isCreating, // Only fetch if we selected an ID and aren't creating
  })

  // 3. Create Mutation
  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setTitle('')
      setDesc('')
      alert("Blog Created Successfully!")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !desc) return alert("Please fill in both fields")

    createMutation.mutate({
      id: Date.now().toString(),
      title,
      description: desc,
      category: ["Tech", "New"],
      date: new Date().toISOString(),
      coverImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg" // Default image
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Blog App</h1>
          <button 
            onClick={() => { setIsCreating(true); setSelectedId(null); }}
            className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            + New Blog
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Blog List (Takes up 4 columns) */}
          <div className="md:col-span-4 bg-white p-4 rounded-xl shadow border border-gray-100 h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 px-2">Latest Blogs</h2>
            
            {loadingList && <p className="text-gray-500 px-2">Loading list...</p>}

            <div className="space-y-3">
              {blogs?.map((blog: any) => (
                <div 
                  key={blog.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedId === blog.id && !isCreating ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => { setSelectedId(blog.id); setIsCreating(false); }}
                >
                  <div className="flex gap-2 mb-2">
                    {blog.category?.map((cat: string, index: number) => (
                      <span key={index} className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1">{blog.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2">{blog.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Content (Takes up 8 columns) */}
          <div className="md:col-span-8 bg-white p-8 rounded-xl shadow border border-gray-100 h-fit min-h-[500px]">
            
            {/* VIEW MODE: Create Form */}
            {isCreating ? (
              <div>
                 <h2 className="text-2xl font-bold mb-6">Create a New Blog</h2>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="Enter an engaging title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg h-64 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Start writing your story..."
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                    >
                      {createMutation.isPending ? 'Publishing...' : 'Publish Blog Post'}
                    </button>
                 </form>
              </div>
            ) : (
              /* VIEW MODE: Read Blog */
              <div className="animate-in fade-in duration-300">
                {loadingBlog ? (
                  <div className="flex items-center justify-center h-64 text-gray-400">Loading story...</div>
                ) : selectedBlog ? (
                  <article>
                    {selectedBlog.coverImage && (
                      <img 
                        src={selectedBlog.coverImage} 
                        alt="Cover" 
                        className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
                      />
                    )}
                    
                    <div className="flex gap-2 mb-4">
                      {selectedBlog.category?.map((cat: string, i: number) => (
                        <span key={i} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                      {selectedBlog.title}
                    </h1>

                    <div className="flex items-center text-gray-400 text-sm mb-8 pb-8 border-b border-gray-100">
                      <span>Published on {new Date(selectedBlog.date).toLocaleDateString()}</span>
                    </div>

                    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedBlog.description} <br/><br/>
                      {/* Using description as content for now since we typed it in description field */}
                      {selectedBlog.content || ""} 
                    </div>
                  </article>
                ) : (
                  <div className="text-center text-gray-400 mt-20">Select a blog to read</div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default App