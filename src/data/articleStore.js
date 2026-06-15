import { articles as initialArticles } from './articles';

const STORAGE_KEY = 'senadee_articles';

/**
 * Get all articles (both published and drafts) from localStorage or initial state
 */
export function getAllArticles() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with initial articles as published
  const defaultArticles = initialArticles.map(a => ({
    ...a,
    status: 'published'
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles));
  return defaultArticles;
}

/**
 * Save an article (create or update)
 */
export function saveArticle(articleData) {
  const articles = getAllArticles();
  let savedArticle;
  
  // If it has an ID, update it
  if (articleData.id) {
    const index = articles.findIndex(a => a.id === articleData.id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...articleData, updatedAt: new Date().toISOString() };
      savedArticle = articles[index];
    } else {
      const newArt = { ...articleData, updatedAt: new Date().toISOString() };
      articles.push(newArt);
      savedArticle = newArt;
    }
  } else {
    // New article
    const newId = Math.max(0, ...articles.map(a => a.id || 0)) + 1;
    const newArticleId = `SND-${String(newId).padStart(3, '0')}`;
    
    const newArticle = {
      ...articleData,
      id: newId,
      articleId: newArticleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    articles.push(newArticle);
    savedArticle = newArticle;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  return savedArticle;
}

/**
 * Delete an article
 */
export function deleteArticle(id) {
  const articles = getAllArticles();
  const filtered = articles.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Get articles by status
 */
export function getArticlesByStatus(status) {
  const articles = getAllArticles();
  return articles.filter(a => a.status === status);
}

/**
 * Generate mock activity logs based on articles
 */
export function getRecentActivities() {
  // We can return some mock activities based on the initial articles
  return [
    { id: 1, action: 'Published', target: 'Mitos dan Fakta Nutrisi Anak', user: 'dr. Sarah Wijaya, Sp.A', time: '2 hours ago' },
    { id: 2, action: 'Draft Saved', target: 'Manfaat Jahe Merah', user: 'Admin Sistem', time: '5 hours ago' },
    { id: 3, action: 'Verified', target: 'Panduan Lengkap MPASI', user: 'dr. Ahmad Faisal', time: '1 day ago' }
  ];
}
