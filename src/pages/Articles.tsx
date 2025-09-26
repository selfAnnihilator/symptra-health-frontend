import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type Article = {
  id: string;
  title: string;
  content: string;
  author: {
    _id?: string;
    name?: string;
    email?: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
};

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/articles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const fetchedArticles: Article[] = data.data.map((a: any) => ({
            id: a._id,
            title: a.title,
            content: a.content,
            author: a.author ? { 
              _id: a.author._id || '', 
              name: a.author.name || 'Unknown', 
              email: a.author.email || 'unknown@example.com' 
            } : { _id: '', name: 'Unknown', email: 'unknown@example.com' }, 
            category: a.category,
            tags: a.tags,
            createdAt: a.createdAt,
          }));
          setArticles(fetchedArticles);
        } else {
          toast.error(data.message || 'Failed to load articles.');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        toast.error('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Health Articles & Insights</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Browse our collection of articles on various health topics, written by experts.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
            <span className="ml-3 text-lg text-gray-600">Loading articles...</span>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-xl font-semibold text-healthcare-primary line-clamp-2">
                    <Link to={`/articles/${article.id}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    By {article.author?.name || 'Unknown'} | {format(new Date(article.createdAt), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700 mb-4 line-clamp-4">{article.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to={`/articles/${article.id}`}>
                      <Button variant="outline" size="sm">Read More</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No published articles available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;