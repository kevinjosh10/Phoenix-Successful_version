import { useEffect, useState } from 'react';
import { FileText, Clock, Hash, CheckCircle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../services/firebase';

export const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docsRef = ref(rtdb, 'documents');
    const unsubscribe = onValue(docsRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const docsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setDocuments(docsArray);
      } else {
        setDocuments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground text-lg">Browse all {documents.length} processed documents securely stored in your database.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4 text-primary"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin-reverse" />
            </div>
          </motion.div>
        ) : documents.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {documents.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl group flex flex-col h-full hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 group-hover:bg-primary/10 group-hover:text-primary rounded-xl text-white transition-colors">
                    <Database size={24} />
                  </div>
                  {doc.processingStatus === 'completed' ? (
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20 flex items-center gap-1">
                      <CheckCircle size={12} /> Ready
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                      Processing
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2" title={doc.title}>
                  {doc.title || doc.filename}
                </h3>
                
                <div className="text-muted-foreground text-sm mb-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={14} /> 
                    {doc.fileType?.split('/')[1]?.toUpperCase() || 'DOCUMENT'} • {(doc.fileSize / 1024).toFixed(1)} KB
                  </div>
                  {doc.documentInsights?.reading_time_minutes && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> 
                      ~{doc.documentInsights.reading_time_minutes} min read
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3 text-sm text-white font-medium">
                    <Hash size={14} className="text-primary" /> Keywords Extracted
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doc.keywords ? doc.keywords.slice(0, 4).map((kw: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white/5 rounded-md text-xs font-medium text-muted-foreground">
                        {kw}
                      </span>
                    )) : (
                      <span className="text-xs text-muted-foreground italic">None found</span>
                    )}
                    {doc.keywords && doc.keywords.length > 4 && (
                      <span className="px-2.5 py-1 bg-white/5 rounded-md text-xs font-medium text-muted-foreground">
                        +{doc.keywords.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground glass-panel rounded-3xl"
          >
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl font-medium text-white mb-2">No documents found</p>
            <p>Upload files to start building your knowledge base.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
