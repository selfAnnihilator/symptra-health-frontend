import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, FileText } from "lucide-react";
import SymptomsCheckerSection from "@/components/home/SymptomsCheckerSection";
import StatsSection from "@/components/home/StatsSection";
import { toast } from "sonner";

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Array of all ad images with their paths and captions
const AD_IMAGES = [
  { src: '/ad_03_general_health_landscape.png', caption: 'Comprehensive Health Insights' },
  { src: '/ad_01_diagnosis_square.png', caption: 'AI-Powered Diagnosis' },
  { src: '/ad_02_mental_health_portrait.png', caption: 'Mental Health Support' },
  { src: '/ad_04_problem_solution_square.png', caption: 'Smart Health Solutions' },
  { src: '/ad_05_benefit_driven_landscape.png', caption: 'Your Health, Our Priority' },
  { src: '/ad_06_diagnosis_square.png', caption: 'Accurate Medical Analysis' },
  { src: '/ad_10_benefit_driven_landscape.png', caption: 'Personalized Care' },
  { src: '/ad_11_diagnosis_square.png', caption: 'Advanced Diagnostics' },
  { src: '/ad_12_mental_health_portrait.png', caption: 'Mind & Body Wellness' },
  { src: '/ad_13_general_health_landscape.png', caption: 'Health Monitoring' },
  { src: '/ad_14_problem_solution_square.png', caption: 'Health Solutions That Work' },
  { src: '/ad_15_benefit_driven_landscape.png', caption: 'Better Health Starts Here' },
  { src: '/ad_19_problem_solution_square.png', caption: 'Innovative Healthcare' },
  { src: '/ad_20_benefit_driven_landscape.png', caption: 'Your Wellness Journey' },
  { src: '/ad_21_diagnosis_square.png', caption: 'Precision Medicine' },
  { src: '/ad_22_mental_health_portrait.png', caption: 'Mental Wellness' },
  { src: '/ad_23_general_health_landscape.png', caption: 'Health & Wellness' },
  { src: '/ad_24_problem_solution_square.png', caption: 'Smart Health Tech' },
  { src: '/ad_28_general_health_landscape.png', caption: 'Holistic Health' },
  { src: '/ad_29_problem_solution_square.png', caption: 'Health Innovation' },
  { src: '/ad_30_benefit_driven_landscape.png', caption: 'Quality Care' },
  { src: '/ad_31_diagnosis_square.png', caption: 'Expert Diagnosis' },
  { src: '/ad_32_mental_health_portrait.png', caption: 'Emotional Wellbeing' },
  { src: '/ad_33_general_health_landscape.png', caption: 'Health Awareness' },
  { src: '/ad_37_mental_health_portrait.png', caption: 'Peace of Mind' },
  { src: '/ad_38_general_health_landscape.png', caption: 'Healthy Living' },
  { src: '/ad_39_problem_solution_square.png', caption: 'Health Solutions' },
  { src: '/ad_40_benefit_driven_landscape.png', caption: 'Your Health Matters' },
  { src: '/ad_41_diagnosis_square.png', caption: 'Medical Excellence' },
  { src: '/ad_42_mental_health_portrait.png', caption: 'Mental Health Care' },
  { src: '/ad_46_diagnosis_square.png', caption: 'Advanced Healthcare' },
  { src: '/ad_47_mental_health_portrait.png', caption: 'Wellbeing First' },
  { src: '/ad_48_general_health_landscape.png', caption: 'Health & Happiness' },
  { src: '/ad_49_problem_solution_square.png', caption: 'Smart Health' },
  { src: '/ad_50_benefit_driven_landscape.png', caption: 'Caring for You' },
  { src: '/doctor.jpg', caption: 'Expert Medical Team' }
];

const ImagesSection = () => {
  const images = [
    { src: '/ad_41_diagnosis_square.jpg', caption: 'Professional AI Diagnosis', link: '/diagnosis' },
    { src: '/ad_42_mental_health_portrait.jpg', caption: 'Prioritize your mental wellness', link: '/mental-health' },
    { src: '/ad_43_general_health_landscape.jpg', caption: 'Holistic Health Intelligence', link: '/med-report' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-healthcare-dark mb-10">Our Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <Link to={image.link} className="hover:opacity-80 transition-opacity duration-300">
                <img src={image.src} alt={image.caption} className="w-full h-full object-cover rounded-lg shadow-md" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Carousel configuration
const CAROUSEL_CONFIG = {
  slideDuration: 5000, // 5 seconds per slide
  transitionDuration: 1000, // 1 second transition
  autoPlay: true,
  showArrows: true,
  showDots: true,
  showCaptions: true,
  infinite: true
};

// Image Carousel Component
const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { 
    slideDuration, 
    transitionDuration, 
    autoPlay, 
    showArrows, 
    showDots, 
    showCaptions, 
    infinite 
  } = CAROUSEL_CONFIG;

  // Auto-advance to next image
  useEffect(() => {
    if (!autoPlay || isHovered) return;
    
    const timer = setTimeout(() => {
      goToNext();
    }, slideDuration);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isHovered, autoPlay, slideDuration]);

  // Handle manual navigation with transition
  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  };

  const goToNext = () => {
    const nextIndex = infinite
      ? (currentIndex + 1) % AD_IMAGES.length
      : Math.min(currentIndex + 1, AD_IMAGES.length - 1);
    goToSlide(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = infinite
      ? (currentIndex - 1 + AD_IMAGES.length) % AD_IMAGES.length
      : Math.max(0, currentIndex - 1);
    goToSlide(prevIndex);
  };

  // Generate a subset of dots for better UX with many slides
  const getVisibleDots = () => {
    const maxDots = 10;
    if (AD_IMAGES.length <= maxDots) return AD_IMAGES;
    
    let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
    let end = start + maxDots;
    
    if (end > AD_IMAGES.length) {
      end = AD_IMAGES.length;
      start = Math.max(0, end - maxDots);
    }
    
    return AD_IMAGES.slice(start, end).map((_, index) => start + index);
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto h-auto min-h-[200px] overflow-hidden rounded-lg shadow-md my-4 group bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Current Image with Zoom Effect */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img 
            src={AD_IMAGES[currentIndex].src} 
            alt={`Slide ${currentIndex + 1}`}
            className={`max-h-full max-w-full transition-all duration-300 ${isHovered ? 'scale-103' : 'scale-100'}`}
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
              maxHeight: '100%',
              maxWidth: '100%'
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {/* Caption */}
        {showCaptions && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
            <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {AD_IMAGES[currentIndex].caption}
              </h3>
              <p className="text-xs text-white/90">
                {currentIndex + 1} / {AD_IMAGES.length}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-healthcare-primary transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-healthcare-primary transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
          {getVisibleDots().map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => goToSlide(dotIndex)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                dotIndex === currentIndex 
                  ? 'w-4 bg-white' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
              aria-current={dotIndex === currentIndex ? 'step' : undefined}
            />
          ))}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: isHovered ? '100%' : '0%',
            transitionDuration: isHovered ? '0ms' : `${slideDuration}ms`,
            transitionTimingFunction: 'linear'
          }}
        />
      </div>
    </div>
  );
};

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



const Index = () => {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      setLoadingArticles(true);
      try {
        console.log('Fetching articles from:', `${API_BASE_URL}/articles`);
        const response = await fetch(`${API_BASE_URL}/articles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication if needed
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Articles API Response:', data);

        if (data.success) {
          const sortedArticles = Array.isArray(data.data) 
            ? data.data
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
            : [];

          if (sortedArticles.length === 0) {
            console.warn('No articles found in the response');
          }

          const fetchedArticles: Article[] = sortedArticles.map((a: any) => ({
            id: a._id || Math.random().toString(),
            title: a.title || 'Untitled Article',
            content: a.content || 'No content available',
            author: a.author ? { 
              _id: a.author._id || '', 
              name: a.author.name || 'Unknown', 
              email: a.author.email || 'unknown@example.com' 
            } : { _id: '', name: 'Unknown', email: 'unknown@example.com' }, 
            category: a.category || 'General',
            tags: Array.isArray(a.tags) ? a.tags : [],
            createdAt: a.createdAt || new Date().toISOString(),
          }));
          
          console.log('Processed articles:', fetchedArticles);
          setLatestArticles(fetchedArticles);
        } else {
          console.error('API returned success: false', data);
          toast.error(data.message || 'Failed to load latest articles.');
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
        toast.error('Failed to load latest articles. Please check your connection and try again.');
        setLatestArticles([]); // Ensure we have an empty array on error
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4">
          <ImageCarousel />
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        
        <SymptomsCheckerSection />
        <StatsSection />
        {/* ADD THIS NEW SECTION */}

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-healthcare-dark mb-10">Latest Health Insights</h2>
            {loadingArticles ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                <span className="ml-3 text-lg text-gray-600">Loading articles...</span>
              </div>
            ) : latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestArticles.map((article) => (
                  <Card key={article.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-healthcare-primary">
                        <Link to={`/articles/${article.id}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        By {article.author?.name || 'Unknown'} | {new Date(article.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 line-clamp-3">{article.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
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
            {latestArticles.length > 0 && (
              <div className="text-center mt-10">
                <Link to="/articles" className="text-healthcare-primary hover:underline font-medium">
                  View All Articles &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>

        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;