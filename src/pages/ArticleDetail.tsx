import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type Article = {
  id: string;
  title: string;
  content: string;
  author: {
    _id?: string;
    name?: string;
    email?: string;
  };
  status: string; // Will be 'published' for public view
  category: string;
  tags: string[];
  createdAt: string;
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get article ID from URL
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No credentials: 'include' needed as this is a public route for published articles
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Ensure the fetched article is published for public view
          if (data.data.status === 'published') {
            setArticle({
              id: data.data._id,
              title: data.data.title,
              content: data.data.content,
              author: data.data.author ? { 
                _id: data.data.author._id || '', 
                name: data.data.author.name || 'Unknown', 
                email: data.data.author.email || 'unknown@example.com' 
              } : { _id: '', name: 'Unknown', email: 'unknown@example.com' }, 
              status: data.data.status,
              category: data.data.category,
              tags: data.data.tags,
              createdAt: data.data.createdAt,
            });
          } else {
            setError('Article not found or not published.');
            toast.error('Article not found or not published.');
          }
        } else {
          setError(data.message || 'Failed to load article.');
          toast.error(data.message || 'Failed to load article.');
        }
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.message || 'An error occurred while loading the article.');
        toast.error(err.message || 'An error occurred while loading the article.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    } else {
      setError('Article ID is missing.');
      setLoading(false);
    }
  }, [id]); // Re-fetch if ID changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
        <p className="ml-3 text-lg">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/articles">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/articles" replace />; // Redirect if article is null after loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <Link to="/articles" className="text-healthcare-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Articles
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-healthcare-dark mb-2">
              {article.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              By {article.author?.name || 'Unknown Author'} | {format(new Date(article.createdAt), 'PPP')} | Category: {article.category}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-800 leading-relaxed">
              <p className="whitespace-pre-wrap">{article.content}</p> {/* Use whitespace-pre-wrap to preserve formatting */}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticleDetail;