import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import CMSHeader from '../../components/cms/CMSHeader';
import LexicalEditor from '../../components/cms/LexicalEditor';
import Toast from '../../components/ui/Toast';
import { getAllArticles, saveArticle } from '../../data/articleStore';
import { getCategories } from '../../data/categoryStore';
import { getDoctors } from '../../data/doctorStore';
import { addLog } from '../../data/logStore';
import { useAuth } from '../../context/AuthContext';

const markdownToSections = (markdown) => {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let currentHeading = '';
  let currentText = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (currentText.length > 0 || currentHeading) {
        sections.push({ heading: currentHeading, text: currentText.join('\n').trim() });
      }
      currentHeading = line.replace(/^#+\s*/, '');
      currentText = [];
    } else {
      currentText.push(line);
    }
  }
  if (currentText.length > 0 || currentHeading) {
    sections.push({ heading: currentHeading || 'Pendahuluan', text: currentText.join('\n').trim() });
  }
  return sections;
};

const sectionsToMarkdown = (sections) => {
  if (!sections || !Array.isArray(sections)) return '';
  return sections.map(s => {
    const heading = (s.heading && s.heading !== 'Pendahuluan') ? `## ${s.heading}\n` : '';
    return `${heading}${s.text || ''}`;
  }).join('\n\n');
};

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [referencesText, setReferencesText] = useState('');
  const [faqText, setFaqText] = useState('');
  const [reviewer, setReviewer] = useState('');

  // FAQ parsing helpers
  const parseFaqText = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const faqs = [];
    let currentQ = '';
    let currentA = '';
    for (let line of lines) {
      line = line.trim();
      if (/^(?:\*\*)?q(?:\*\*)?[:.]/i.test(line)) {
        if (currentQ) faqs.push({ question: currentQ.replace(/^(?:\*\*)?q(?:\*\*)?[:.]\s*(?:\*\*)?/i, '').replace(/(?:\*\*)?$/, '').trim(), answer: currentA.trim() });
        currentQ = line;
        currentA = '';
      } else if (/^(?:\*\*)?a(?:\*\*)?[:.]/i.test(line)) {
        currentA = line.replace(/^(?:\*\*)?a(?:\*\*)?[:.]\s*(?:\*\*)?/i, '').replace(/(?:\*\*)?$/, '').trim();
      } else if (currentQ && currentA !== '') {
        currentA += '\n' + line;
      }
    }
    if (currentQ) faqs.push({ question: currentQ.replace(/^(?:\*\*)?q(?:\*\*)?[:.]\s*(?:\*\*)?/i, '').replace(/(?:\*\*)?$/, '').trim(), answer: currentA.trim() });
    return faqs;
  };

  const formatFaqText = (faqs) => {
    if (!faqs || !Array.isArray(faqs)) return '';
    return faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  };

  // Right column states
  const [publishMode, setPublishMode] = useState('now'); // 'now' or 'schedule'
  
  const authorName = user?.penName || user?.name || 'Unknown Writer';
  const [publishDate, setPublishDate] = useState('');
  const [originalStatus, setOriginalStatus] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setCategories(getCategories().filter(c => c.isActive));
    setDoctors(getDoctors().filter(d => d.status === 'active'));
  }, []);

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
        setImageUrl(articleToEdit.imageUrl || null);
        const mdContent = sectionsToMarkdown(articleToEdit.content);
        setInitialContent(mdContent);
        setCurrentContent(mdContent);
        setReferencesText(articleToEdit.references || '');
        setFaqText(formatFaqText(articleToEdit.faq || []));
        setReviewer(articleToEdit.reviewer || '');
        setIsVerified(articleToEdit.isVerified || false);
        setOriginalStatus(articleToEdit.status || '');
        setPublishMode(articleToEdit.status === 'scheduled' ? 'schedule' : 'now');
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
      author: authorName,
      reviewer: reviewer,
      status: 'draft',
      category: selectedCategory || 'general',
      references: referencesText,
      faq: parseFaqText(faqText),
      imageUrl: imageUrl,
      content: markdownToSections(currentContent)
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // Mencegah event click merambat ke parent div
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input file
    }
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
      author: authorName,
      reviewer: reviewer,
      status: publishMode === 'schedule' ? 'scheduled' : 'published',
      category: selectedCategory || 'general',
      readingTime: 5,
      date: publishMode === 'schedule' ? (publishDate || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      isVerified: true,
      imageUrl: imageUrl,
      references: referencesText,
      faq: parseFaqText(faqText),
      content: markdownToSections(currentContent)
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
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", safetySettings });

      const wordCountRule = articleType === 'general' ? 'Maksimal 600 - 1.000 kata (minimal 500 kata)' : 'Maksimal 400 - 700 kata (minimal 350 kata)';
      const faqCountRule = articleType === 'general' ? '3-5 FAQ' : '2-3 FAQ';

      const prompt = `Anda adalah penulis medis/kesehatan Senior untuk portal "Senadee".
Tugas Anda adalah menulis artikel kesehatan yang berbobot, akurat, empatik, dan mudah dipahami.
Sangat Penting: Lokalisasi untuk pembaca di Indonesia (sesuaikan gaya hidup, iklim, makanan lokal, dan kebiasaan di Indonesia).

Topik (Keyword Utama): ${topic}
Jenis Artikel: ${articleType.toUpperCase()}
Instruksi Khusus (Brief): ${brief || 'Tidak ada'}

VALIDASI SEARCH INTENT:
Sebelum menulis, pahami apa yang sebenarnya ingin dicari pembaca dari keyword ini. Artikel Anda WAJIB menjawab 3 pertanyaan inti: 
1) Apa yang ingin diketahui pembaca? 
2) Apa tindakan yang bisa dilakukan pembaca? 
3) Kapan pembaca perlu bantuan medis?

ATURAN POINT OF VIEW (POV) & SAPAAN:
1. Analisis target pembaca dari topik di atas. Siapa yang akan membacanya?
2. Jika topik tentang Kehamilan, Bayi, atau Anak: Gunakan sapaan "Bunda" atau "Ayah" karena yang membaca adalah orang tuanya.
3. Jika topik tentang Lansia/Geriatri: Analisis konteksnya. Jika ditujukan untuk keluarga/anak yang merawat, gunakan kalimat seperti "Jika Ayah atau Ibu mengalami...". Jika ditujukan untuk dibaca langsung oleh lansia, gunakan sapaan "Anda".
4. Jika topik tentang Penyakit Medis Berat/Umum: Gunakan sapaan formal "Anda".
5. Jika topik tentang Lifestyle, Diet Santai, atau Wellness: Gunakan sapaan "Kamu".
6. DILARANG menggunakan kata "Bang" atau "Sobat Bang".

WAJIB PATUHI ATURAN EDITORIAL BERIKUT:
1. PANJANG ARTIKEL: ${wordCountRule}.
2. DILARANG MEMBUAT JUDUL ARTIKEL DI DALAM TEKS: JANGAN menggunakan H1 (#) atau menulis judul di baris pertama. Tulisan harus langsung dimulai dengan paragraf Introduction.
3. INTRODUCTION: Pada 100 kata pertama, Anda WAJIB memberikan jawaban singkat (40-60 kata) yang langsung menjawab keyword utama tanpa basa-basi. Intro ini berfungsi sebagai featured snippet Google.
4. PARAGRAF PENDEK: Tiap paragraf maksimal 2-3 kalimat (agar saat dibaca di mobile tidak lebih dari 3-4 baris). Gunakan Bullet Points jika menjelaskan langkah/ciri-ciri.
5. PENUTUP: Paragraf terakhir WAJIB berisi ringkasan singkat artikel dan bagian 'Kapan Perlu ke Dokter'. Sebutkan dengan jelas tanda-tanda bahaya/kondisi yang memerlukan evaluasi medis lanjutan, disertai ajakan konsultasi (Contoh: "Segera periksakan diri ke dokter jika Anda mengalami...").
6. TANDA BACA & BAHASA: DILARANG KERAS menggunakan tanda dash panjang (—) dan tiga bintang (***) di dalam kalimat. Gunakan koma atau titik dua. Pastikan semua istilah bahasa Inggris dicetak miring (*italic*).
7. ANTI KEYWORD STUFFING: DILARANG mengulang keyword utama secara kaku dan berlebihan. Gunakan variasi kata yang natural.
8. INTERNAL LINK MARKING: Setiap artikel hanya boleh menjawab 1 intent utama. Jika ada sebutan penyakit/topik lanjutan, jangan dijelaskan panjang lebar. Tandai frasa tersebut menggunakan tag HTML <u>...</u> sebagai rekomendasi internal link (Contoh: "Diabetes dapat memicu <u>komplikasi jantung</u>.").
9. ANTI-HALUSINASI MEDIS: DILARANG KERAS mengarang statistik, hasil penelitian, kutipan dokter, atau referensi. Gunakan deskripsi kualitatif (contoh: "sebagian", "sering ditemukan") jika tidak ada data angka spesifik. Tulis "belum ada cukup bukti" jika bukti ilmiah terbatas.
10. DISCLAIMER HERBAL: Jika topik membahas pengobatan herbal/alami, Anda WAJIB mencantumkan disclaimer ini persis: "Penggunaan herbal sebaiknya dikonsultasikan dengan dokter, terutama bila Anda memiliki penyakit kronis atau sedang mengonsumsi obat tertentu."

STRUKTUR OUTPUT (PENTING!):
Output Anda harus HANYA berisi Markdown murni tanpa basa-basi pembuka/penutup, terbagi dalam 3 bagian berurutan:
1. [KONTEN ARTIKEL]: Isi artikel utama. Sekali lagi, langsung mulai dengan paragraf pembuka tanpa judul. Gunakan H2 (##) HANYA untuk subjudul.
2. [FAQ]: Di akhir artikel, buat judul **FAQ**. Buat ${faqCountRule} yang relevan (tidak mengulang isi artikel). Formatnya:
   Q: [Pertanyaan]
   A: [Jawaban 30-80 kata]
3. [REFERENSI]: Di bawah FAQ, buat judul **Referensi:** lalu sebutkan sumbernya.`;

      setStreamedText('');
      
      const result = await model.generateContentStream(prompt);
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setStreamedText(text);
      }

      let mainContent = text;
      let refs = '';
      let rawFaq = '';
      
      const refMatch = mainContent.match(/(?:\*\*)?Referensi:(?:\*\*)?\s*([\s\S]*)/i);
      if (refMatch) {
        refs = refMatch[1].trim();
        mainContent = mainContent.substring(0, refMatch.index).trim();
      }

      const faqMatch = mainContent.match(/(?:#+\s*)?(?:\*\*)?FAQ(?:\*\*)?\s*\n([\s\S]*)/i);
      if (faqMatch) {
        rawFaq = faqMatch[1].trim();
        mainContent = mainContent.substring(0, faqMatch.index).trim();
      }

      setTitle(topic);
      setSlug(topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      setInitialContent(mainContent);
      setReferencesText(refs);
      setFaqText(rawFaq);
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
      {originalStatus !== 'published' && (
        <button onClick={handleSaveDraft} className="px-4 py-2 border border-border-muted text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors duration-200 cursor-pointer">
          Save Draft
        </button>
      )}
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
          <div 
            className="bg-surface-container-lowest rounded-xl border border-border-muted border-dashed p-4 flex items-center gap-4 group cursor-pointer hover:bg-surface-container-low transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageUrl ? (
              <div className="w-16 h-12 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden">
                <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">add_photo_alternate</span>
              </div>
            )}
            <div className="flex-1">
              <p className="font-label-md text-label-md font-bold text-on-surface">
                {imageUrl ? 'Featured Image Terpilih' : 'Upload Featured Image'}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Recommended: 1200x675px (16:9)</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <div className="flex gap-2">
              {imageUrl && (
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-error-container text-on-error-container border border-transparent rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button 
                type="button"
                className="px-4 py-2 bg-surface text-on-surface-variant border border-border-muted rounded-lg font-label-sm text-label-sm group-hover:border-primary transition-colors cursor-pointer"
              >
                {imageUrl ? 'Ganti' : 'Browse'}
              </button>
            </div>
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
            <span className="hidden sm:inline">senadee-indonesia.id/articles/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className="flex-1 bg-transparent border-b border-dashed border-outline-variant focus:border-primary focus:ring-0 p-0 text-on-surface-variant outline-none"
            />
          </div>

          {/* AI Streaming Preview Overlay */}
          {isGenerating && (
            <div className="bg-primary-fixed/30 border border-primary-container p-6 rounded-xl relative">
              <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                <span className="material-symbols-outlined animate-spin">sync</span>
                AI Sedang Mengetik...
              </div>
              <div className="prose-custom whitespace-pre-wrap text-on-surface font-body text-body-md opacity-80 min-h-[100px]">
                {streamedText || 'Menghubungkan ke server AI...'}
              </div>
            </div>
          )}

          {/* 5. Text Box (Lexical Editor) */}
          <LexicalEditor initialContent={initialContent} onChange={setCurrentContent} />

          {/* Author Name (Disabled) */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface">Ditulis Oleh (Penulis)</label>
            <input
              type="text"
              value={authorName}
              disabled
              className="w-full bg-surface-dim border border-border-muted rounded-lg font-body-md text-body-md text-on-surface-variant p-3 outline-none cursor-not-allowed"
            />
          </div>

          {/* 6. Reviewer / Doctor Name */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface">Ditinjau Oleh (Reviewer)</label>
            <select
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              className="w-full bg-surface border border-border-muted rounded-lg font-body-md text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
            >
              <option value="">Pilih Dokter Reviewer...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name} {d.specialty ? `(${d.specialty})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 7. References */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-on-surface">Referensi / Sumber</label>
            <textarea
              value={referencesText}
              onChange={(e) => setReferencesText(e.target.value)}
              rows="4"
              placeholder="1. World Health Organization. (2023). Diabetes...&#10;2. Mayo Clinic..."
              className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
            ></textarea>
          </div>

          {/* 8. FAQ */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-border-muted flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md font-bold text-on-surface">Frequently Asked Questions (FAQ)</label>
              <span className="text-xs text-on-surface-variant px-2 py-1 bg-surface-container-low rounded-lg">Format: Q: ... A: ...</span>
            </div>
            <textarea
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              rows="6"
              placeholder="Q: Apakah diabetes bisa sembuh?&#10;A: Diabetes tidak bisa sembuh total, namun..."
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
                  disabled={user?.role?.toLowerCase() !== 'writer'}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none z-10 transition-transform duration-200 ${user?.role?.toLowerCase() !== 'writer' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer border-border-muted'}`}
                  style={isVerified ? { right: 0, borderColor: user?.role?.toLowerCase() !== 'writer' ? '#ccc' : '#006a69' } : {}}
                />
                <label
                  htmlFor="humanVerified"
                  className={`toggle-label block overflow-hidden h-6 rounded-full transition-colors ${user?.role?.toLowerCase() !== 'writer' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  style={isVerified ? { backgroundColor: user?.role?.toLowerCase() !== 'writer' ? '#999' : '#0ea5a4' } : { backgroundColor: '#e2e7ff' }}
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
                  className="w-full bg-surface border border-border-muted rounded-lg font-body-sm text-body-sm p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(cat => (
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
