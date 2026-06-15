import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import CMSHeader from '../../components/cms/CMSHeader';
import LexicalEditor from '../../components/cms/LexicalEditor';
import Toast from '../../components/ui/Toast';
import { getAllArticles, saveArticle } from '../../data/articleStore';
import { getActiveCategories } from '../../data/categoryStore';
import { addLog } from '../../data/logStore';
import { useAuth } from '../../context/AuthContext';

export default function ArticleEditorPage({ isModal = false, editId: propEditId = null, onClose }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlEditId = searchParams.get('id');
  const [internalEditId, setInternalEditId] = useState(propEditId || urlEditId);
  const { user } = useAuth();
  // Form Data
  const [topic, setTopic] = useState('');
  const [brief, setBrief] = useState('');
  const [articleType, setArticleType] = useState('spesifik');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [initialContent, setInitialContent] = useState('');

  // Right column states
  const [publishMode, setPublishMode] = useState('now'); // 'now' or 'schedule'
  const [publishDate, setPublishDate] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  // Load data if editing
  useEffect(() => {
    if (internalEditId) {
      const articles = getAllArticles();
      const articleToEdit = articles.find(a => a.id === parseInt(internalEditId));
      if (articleToEdit) {
        setTitle(articleToEdit.title || '');
        setSlug(articleToEdit.slug || '');
        setTopic(articleToEdit.title || '');
        setSelectedCategory(articleToEdit.category || '');
        setInitialContent(articleToEdit.content ? JSON.stringify(articleToEdit.content) : ''); // Just mock load
      }
    }
  }, [internalEditId]);

  // ESC Keyboard Listener for Modal
  useEffect(() => {
    if (!isModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  const handleSaveDraft = () => {
    const data = {
      ...(internalEditId ? { id: parseInt(internalEditId) } : {}),
      title: title || 'Untitled Draft',
      slug,
      author: user?.name || 'Unknown Writer',
      status: 'draft',
      category: selectedCategory || 'general',
      content: initialContent ? [{ heading: 'Draft Content', text: 'MOCKED CONTENT' }] : []
    };
    const saved = saveArticle(data);
    setInternalEditId(saved.id);
    setToastMessage('✅ Draft berhasil disimpan!');
    
    // Create log for save draft
    addLog({
      action: 'Save Draft',
      articleTitle: data.title,
      actor: user?.name || 'Unknown',
      status: 'Success'
    });
    
    // Jika modal, jangan auto-close agar penulis bisa lanjut ngetik
    // Jika butuh tutup, biarkan user klik "Kembali/Close"
  };

  const handlePublish = () => {
    if (!isVerified) return;
    
    if (!title || !selectedCategory) {
      setToastMessage('❌ Judul dan Kategori tidak boleh kosong!');
      return;
    }
    
    const data = {
      ...(internalEditId ? { id: parseInt(internalEditId) } : {}),
      title: title || 'Untitled Article',
      slug: slug || 'untitled-article',
      author: user?.name || 'Unknown Writer',
      status: 'published',
      category: selectedCategory || 'general',
      readingTime: 5,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
      content: initialContent ? [{ heading: 'Published Content', text: 'MOCKED CONTENT' }] : []
    };
    saveArticle(data);
    
    // Create log for publish
    addLog({
      action: publishMode === 'schedule' ? 'Schedule Publish' : 'Publish',
      articleTitle: data.title,
      actor: user?.name || 'Unknown',
      status: 'Success'
    });
    
    if (isModal && onClose) {
      onClose(true); // true = indicate success/refresh needed
    } else {
      navigate('/cms/articles');
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("API Key tidak ditemukan. Pastikan file .env.local sudah berisi VITE_GEMINI_API_KEY");
        setIsGenerating(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ];
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest", 
        safetySettings,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        }
      });

      const wordCountRule = articleType === 'general' ? 'Maksimal 200 - 250 kata' : 'Maksimal 150 - 200 kata';

      const prompt = `Anda adalah penulis medis/kesehatan Senior untuk portal "Senadee".
Tugas Anda adalah menulis artikel kesehatan yang berbobot, akurat, empatik, dan mudah dipahami.
Sangat Penting: Lokalisasi untuk pembaca di Indonesia (sesuaikan gaya hidup, iklim, makanan lokal, dan kebiasaan di Indonesia).

Topik (Keyword Utama): ${topic}
Jenis Artikel: ${articleType.toUpperCase()}
Instruksi Khusus (Brief): ${brief || 'Tidak ada'}

ATURAN POINT OF VIEW (POV) & SAPAAN:
1. Analisis target pembaca dari topik di atas. Siapa yang akan membacanya?
2. Jika topik tentang Kehamilan, Bayi, atau Anak: Gunakan sapaan "Bunda" atau "Ayah" karena yang membaca adalah orang tuanya.
3. Jika topik tentang Lansia/Geriatri: Gunakan sapaan "Anda" (diasumsikan yang membaca adalah anak/keluarga/caregiver dari lansia tersebut).
4. Jika topik tentang Penyakit Medis Berat/Umum: Gunakan sapaan formal "Anda".
5. Jika topik tentang Lifestyle, Diet Santai, atau Wellness: Gunakan sapaan "Kamu".
6. DILARANG menggunakan kata "Bang" atau "Sobat Bang" di dalam artikel. Pertahankan tone profesional medis yang elegan.

WAJIB PATUHI ATURAN EDITORIAL BERIKUT:
1. FOKUS & TO THE POINT: Jangan bertele-tele (ngalor ngidul). Bahas inti dari keyword saja.
2. PANJANG ARTIKEL: ${wordCountRule}. Padat dan bergizi.
3. PARAGRAF PENDEK: Tiap paragraf maksimal 2-3 kalimat (agar saat dibaca di mobile tidak lebih dari 3-4 baris).
4. TANDA BACA: DILARANG KERAS menggunakan tanda dash panjang (—) di dalam kalimat.
5. BAHASA: Gunakan bahasa Indonesia sesuai EYD. Tata bahasa formal tapi santai (enak dibaca, luwes, namun kredibel dan tidak menyepelekan).
6. ISTILAH ASING: Pastikan semua kata/istilah bahasa Inggris atau bahasa Latin dicetak miring (gunakan format *italic*).
7. FORMAT APLIKATIF: Gunakan *Bullet Points* atau *Numbering* jika sedang menjelaskan langkah-langkah, ciri-ciri, atau tips.
8. STRUKTUR INTRO: Paragraf pertama wajib sangat menarik (hook), langsung ke inti masalah dari keyword, beri sedikit konteks, lalu segera masuk ke Subtitle pertama (H2).
9. AKURASI MEDIS & REFERENSI: Info medis wajib 100% akurat dari sumber terpercaya (Kemenkes, WHO, Mayo Clinic, Cleveland Clinic, dll). Usia sumber tidak lebih dari 5 tahun ke belakang.
10. DAFTAR REFERENSI: Di bagian paling bawah artikel, buat tulisan **Referensi:** lalu sebutkan sumbernya (tanpa link).
11. CALL TO ACTION (DOKTER): Di paragraf penutup (ending), WAJIB arahkan pembaca untuk periksa ke dokter dengan menyebutkan kondisi *red flag*-nya (misal: "Segera konsultasikan ke dokter jika...").
12. SEO FRIENDLY: Sebar *keyword* utama secara natural di paragraf awal, tengah, dan penutup.
13. KODE ETIK MEDIS: Jangan menghakimi (non-judgemental, empati tinggi), dan WAJIB peringatkan agar tidak melakukan *self-diagnose*.
14. ATURAN ARTIKEL HERBAL: Jika topik membahas obat herbal/alami, WAJIB tulis bahwa itu harus didukung penelitian ilmiah. Tegaskan herbal bukan pengobatan tunggal dan tetap butuh pantauan dokter (terutama untuk penyakit berat).
15. FORMAT OUTPUT: HANYA gunakan format Markdown murni. Gunakan H2 (##) untuk subjudul utama. JANGAN gunakan H1 (#). JANGAN ketik kalimat pembuka/penutup basa-basi dari AI, langsung muntahkan isi artikelnya saja.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setTitle(topic);
      setSlug(topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      setInitialContent(text);
      setHasGenerated(true);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("AI Error: " + (error?.message || error) + "\n\nCek koneksi internet atau kuota API Key Gemini Anda.");
    } finally {
      setIsGenerating(false);
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      {isModal && (
        <button onClick={() => onClose(false)} className="px-4 py-2 border border-border-muted text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
          Batal
        </button>
      )}
      <button onClick={handleSaveDraft} className="px-4 py-2 border border-border-muted text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
        Save Draft
      </button>
      <button
        onClick={handlePublish}
        disabled={!isVerified}
        className={`px-4 py-2 font-label-md text-label-md rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          isVerified 
            ? 'bg-primary text-on-primary hover:opacity-90 cursor-pointer' 
            : 'bg-surface-dim text-on-surface-variant opacity-50 cursor-not-allowed'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isVerified ? 'publish' : 'lock'}
        </span>
        Publish
      </button>
    </div>
  );

  return (
    <div className={`flex flex-col relative ${isModal ? 'h-full overflow-y-auto' : ''}`}>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      
      {isModal ? (
        <div className="sticky top-0 z-30 bg-surface-container-low/80 backdrop-blur-xl border-b border-border-muted px-6 py-4 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface line-clamp-1">{title || 'New Article'}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Editor Mode</p>
          </div>
          {headerActions}
        </div>
      ) : (
        <CMSHeader 
          title={title || 'New Article'} 
          subtitle="Content Manager" 
          headerActions={headerActions} 
        />
      )}
      
      <div className={`flex-1 flex flex-col lg:flex-row gap-gutter mx-auto w-full mb-10 ${isModal ? 'p-6 max-w-7xl' : 'p-margin-mobile md:p-gutter max-w-container-max'}`}>
        
        {/* --- LEFT COLUMN --- */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {!isModal && (
            <div className="bg-surface-container-lowest rounded-xl border border-border-muted p-5 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">AI Medical Writer Assistant</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Masukkan topik spesifik dan brief untuk di-generate sebagai draf artikel.</p>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md font-bold text-on-surface">Jenis Artikel</label>
                  <select
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value)}
                    className="w-full bg-surface border border-primary-container rounded-lg font-body-md text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="general">Artikel General</option>
                    <option value="spesifik">Artikel Spesifik</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md font-bold text-on-surface">Topik / Keyword</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Type 2 Diabetes Symptoms"
                    className="w-full bg-surface border border-outline-variant rounded-lg font-body-md text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="font-label-sm text-label-sm font-medium text-on-surface-variant block mb-1">Brief / Instructions (Optional)</label>
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="e.g. Focus on early warning signs..."
                    className="w-full bg-surface border border-outline-variant rounded-lg font-body-md text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none h-20"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={!topic || isGenerating}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                      <span className="material-symbols-outlined">magic_button</span>
                    )}
                    {isGenerating ? 'Generating...' : (hasGenerated ? 'Regenerate Draft' : 'Generate Draft')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Image Upload (Compact) */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted border-dashed p-4 flex items-center gap-4 group cursor-pointer hover:bg-surface-container-low transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">add_photo_alternate</span>
            </div>
            <div className="flex-1">
              <p className="font-label-md text-label-md font-bold text-on-surface">Upload Featured Image</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Recommended: 1200x675px (16:9)</p>
            </div>
            <button className="px-4 py-2 bg-surface text-on-surface-variant border border-border-muted rounded-lg font-label-sm text-label-sm group-hover:border-primary transition-colors cursor-pointer">
              Browse
            </button>
          </div>

          {/* 3. Title */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-headline-md text-headline-md text-on-surface border-none focus:ring-0 p-0 bg-transparent placeholder-outline-variant outline-none"
              placeholder="Article Title"
            />
          </div>

          {/* 4. Link / Slug */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-muted flex items-center gap-2 text-outline font-body-md text-body-md">
            <span className="material-symbols-outlined text-[18px]">link</span>
            <span className="hidden sm:inline">bangkesehatan.com/articles/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className="flex-1 bg-transparent border-b border-dashed border-outline-variant focus:border-primary focus:ring-0 p-0 text-on-surface-variant outline-none"
            />
          </div>

          {/* 5. Text Box (Lexical Editor) */}
          <LexicalEditor initialContent={initialContent} />

          {/* 6. Reviewer / Doctor Name */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface">Ditinjau Oleh (Reviewer)</label>
            <input
              type="text"
              placeholder="e.g. dr. Rifqi Rinaldi"
              className="w-full bg-surface border border-border-muted rounded-lg font-body-md text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* 7. References */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface">Referensi / Sumber</label>
            <textarea
              rows="4"
              placeholder="1. World Health Organization. (2023). Diabetes...&#10;2. Mayo Clinic..."
              className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
            ></textarea>
          </div>

        </div>

        {/* --- RIGHT COLUMN --- */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          
          {/* Verification Guardrail (CRITICAL) */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted shadow-[0_4px_20px_rgba(14,165,164,0.02)] overflow-hidden">
            <div className="bg-surface-container-low p-4 border-b border-border-muted flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Medical Verification</h3>
            </div>
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold" htmlFor="humanVerified">
                  Verified Badge
                </label>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Required for publishing.
                </p>
              </div>
              <div className="relative inline-block w-12 flex-shrink-0 align-middle select-none transition duration-200 ease-in mt-1">
                <input
                  type="checkbox"
                  id="humanVerified"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-border-muted appearance-none cursor-pointer z-10 transition-transform duration-200"
                  style={isVerified ? { right: 0, borderColor: '#006a69' } : {}}
                />
                <label
                  htmlFor="humanVerified"
                  className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors"
                  style={isVerified ? { backgroundColor: '#0ea5a4' } : { backgroundColor: '#e2e7ff' }}
                ></label>
              </div>
            </div>
          </div>

          {/* Date Publish */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted p-5">
            <h3 className="font-label-md text-label-md font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              Publish Settings
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPublishMode('now')}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${publishMode === 'now' ? 'border-primary' : 'border-outline-variant'}`}>
                  {publishMode === 'now' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">Publish Now</span>
              </div>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPublishMode('schedule')}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${publishMode === 'schedule' ? 'border-primary' : 'border-outline-variant'}`}>
                  {publishMode === 'schedule' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">Schedule</span>
              </div>

              {publishMode === 'schedule' && (
                <input 
                  type="datetime-local" 
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="mt-2 w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              )}
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted p-5">
            <h3 className="font-label-md text-label-md font-bold text-on-surface mb-4">Categorization</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-label-sm text-label-sm font-medium text-on-surface-variant block mb-1.5">Kategori *</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {getActiveCategories().map(cat => (
                    <option key={cat.id} value={cat.key}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="font-label-sm text-label-sm font-medium text-on-surface-variant block mb-1.5">Tag</label>
                <div className="border border-border-muted rounded-lg p-2 flex flex-wrap gap-2 min-h-[44px] bg-surface">
                  <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center gap-1">
                    Diabetes
                    <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
                  </span>
                  <input type="text" placeholder="Add tag..." className="border-none bg-transparent font-body-sm text-body-sm flex-1 min-w-[80px] focus:ring-0 p-1 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-surface-container-lowest rounded-xl border border-border-muted p-5">
            <h3 className="font-label-md text-label-md font-bold text-on-surface mb-4">SEO</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-label-sm text-label-sm font-medium text-on-surface-variant block mb-1.5">Meta Title</label>
                <input
                  type="text"
                  placeholder="SEO Title"
                  className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm font-medium text-on-surface-variant block mb-1.5">Meta Deskripsi</label>
                <textarea
                  rows="3"
                  placeholder="Short description for search engines..."
                  className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
