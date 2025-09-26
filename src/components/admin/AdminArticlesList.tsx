import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrashIcon, 
  EditIcon, 
  PlusIcon, 
  CheckIcon, 
  XIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshCw,
  Send // Import Send icon for submit button
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext'; // Import useAuth

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type ArticleStatus = 'draft' | 'pending' | 'published' | 'rejected';

type Article = {
  id: string;
  title: string;
  content: string;
  author: {
    _id?: string;
    name?: string;
    email?: string;
  };
  status: ArticleStatus;
  category: string;
  tags: string[];
};

const AdminArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article>({
    id: '',
    title: '',
    content: '',
    author: { _id: '', name: '', email: '' },
    status: 'draft',
    category: '',
    tags: []
  });
  const { getToken, user: currentUser } = useAuth();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/articles/admin/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        toast.error('Session expired or not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const fetchedArticles: Article[] = data.data.map((a: any) => ({
          id: a._id,
          title: a.title,
          content: a.content,
          author: a.author ? { 
            _id: a.author._id || '', 
            name: a.author.name || 'Unknown', 
            email: a.author.email || 'unknown@example.com' 
          } : { _id: '', name: 'Unknown', email: 'unknown@example.com' }, 
          status: a.status,
          category: a.category,
          tags: a.tags,
        }));
        setArticles(fetchedArticles);
      } else {
        toast.error(data.message || 'Failed to load articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setCurrentArticle({
      id: '',
      title: '',
      content: '',
      author: { _id: '', name: '', email: '' },
      status: 'draft',
      category: '',
      tags: []
    });
    setIsEditing(false);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (article: Article) => {
    setCurrentArticle({...article});
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setArticles(articles.filter(article => article.id !== id));
          toast.success('Article deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error('Failed to delete article');
      }
    }
  };

  const handleReviewArticle = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (status === 'approved') {
          toast.success('Article approved and published');
        } else {
          toast.success('Article rejected');
        }
        fetchArticles();
      } else {
        toast.error(data.message || `Failed to ${status} article`);
      }
    } catch (error) {
      console.error(`Error reviewing article:`, error);
      toast.error(`Failed to ${status} article`);
    }
  };

  // NEW FUNCTION: Submit Article for Approval
  const handleSubmitForApproval = async (id: string) => {
    if (confirm('Are you sure you want to submit this article for approval?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}/submit`, {
          method: 'POST', // Use POST for submit endpoint
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('Article submitted for approval');
          fetchArticles(); // Re-fetch to update status to 'pending'
        } else {
          toast.error(data.message || 'Failed to submit article for approval');
        }
      } catch (error) {
        console.error('Error submitting article for approval:', error);
        toast.error('Failed to submit article for approval');
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      let url = `${API_BASE_URL}/articles`;
      let method = 'POST';

      if (isEditing) {
        url = `${API_BASE_URL}/articles/${currentArticle.id}`;
        method = 'PUT';
      }

      const payload: any = {
        title: currentArticle.title,
        content: currentArticle.content,
        category: currentArticle.category,
        tags: currentArticle.tags,
      };

      if (isEditing && currentUser && currentUser.role === 'admin') {
        payload.status = currentArticle.status;
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (isEditing) {
          toast.success('Article updated successfully');
        } else {
          toast.success('Article added successfully (as Draft)'); // Clarify status
        }
        fetchArticles();
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(data.message || `Failed to ${isEditing ? 'update' : 'add'} article`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} article:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} article`);
    }
  };

  const getStatusBadge = (status: ArticleStatus) => {
    switch(status) {
      case 'published':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Published</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending Review</span>;
      case 'draft':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Article Management</h2>
          <p className="text-sm text-gray-600">Manage blog articles and content</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Article
        </Button>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate">{article.title}</div>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.author?.name || 'N/A'}</TableCell> 
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(article)}
                        title="Edit"
                      >
                        <EditIcon className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteArticle(article.id)}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                      
                      {/* Show Submit for Approval button if status is Draft or Rejected */}
                      {(article.status === 'draft' || article.status === 'rejected') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSubmitForApproval(article.id)}
                          title="Submit for Approval"
                        >
                          <Send className="h-4 w-4 text-purple-500" />
                        </Button>
                      )}

                      {/* Show Approve/Reject buttons if status is Pending */}
                      {article.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleReviewArticle(article.id, 'approved')}
                            title="Approve"
                          >
                            <ThumbsUpIcon className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleReviewArticle(article.id, 'rejected')}
                            title="Reject"
                          >
                            <ThumbsDownIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No articles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Article' : 'Add New Article'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Article Title</label>
              <Input
                id="title"
                value={currentArticle.title}
                onChange={(e) => setCurrentArticle({...currentArticle, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea
                id="content"
                value={currentArticle.content}
                onChange={(e) => setCurrentArticle({...currentArticle, content: e.target.value})}
                required
                className="min-h-[200px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  value={currentArticle.category}
                  onChange={(e) => setCurrentArticle({...currentArticle, category: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  id="tags"
                  value={currentArticle.tags.join(', ')}
                  onChange={(e) => setCurrentArticle({
                    ...currentArticle, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
            
            {isEditing && currentUser && currentUser.role === 'admin' && ( // Only show status dropdown if editing and is admin
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select 
                  value={currentArticle.status}
                  onValueChange={(value: ArticleStatus) => setCurrentArticle({
                    ...currentArticle, 
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Article' : 'Add Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticlesList;