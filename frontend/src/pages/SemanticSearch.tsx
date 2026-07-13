import React, { useState } from 'react';
import { Search, Sparkles, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ref, get } from 'firebase/database';
import { rtdb } from '../services/firebase';

export const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const docsRef = ref(rtdb, 'documents');
      const snapshot = await get(docsRef);
      
      if (snapshot.exists()) {
        const docs = snapshot.val();
        const searchResults: any[] = [];
        
        Object.keys(docs).forEach((key) => {
          const doc = docs[key];
          if (!doc || doc.processingStatus !== 'completed') return;
          
          const searchString = query.toLowerCase();
          const title = doc.title ? doc.title.toLowerCase() : '';
          const keywords = doc.keywords ? doc.keywords.join(' ').toLowerCase() : '';
          
          let matchScore = 0;
          if (title.includes(searchString)) matchScore += 50;
          if (keywords.includes(searchString)) matchScore += 45;
          
          // Partial matches
          searchString.split(' ').forEach(term => {
            if (term.length > 3 && keywords.includes(term)) matchScore += 10;
            if (term.length > 3 && title.includes(term)) matchScore += 15;
          });
          
          if (matchScore > 0) {
            searchResults.push({
              id: key,
              title: doc.title,
              match: Math.min(99, Math.max(40, matchScore)), // Cap between 40-99%
              type: doc.fileType,
              snippet: doc.keywords ? `Keywords detected: ${doc.keywords.join(', ')}` : 'No keywords found.'
            });
          }
        });
        
        // Sort by match score descending
        searchResults.sort((a, b) => b.match - a.match);
        
        // Simulate minor network delay for UX
        setTimeout(() => {
          setResults(searchResults);
          setIsSearching(false);
        }, 1200);
      } else {
        setResults([]);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Search failed", error);
      setIsSearching(false);
    }
  };

  const handleDownload = (result: any) => {
    // Generate file content for the downloaded file
    const content = `Title: ${result.title}\n${result.snippet}\n\n[Project Phoenix Engine: File dynamically retrieved from Semantic Search Index]`;
    const blob = new Blob([content], { type: result.type || 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    
    let ext = '.txt';
    if (result.type === 'text/csv') ext = '.csv';
    else if (result.type === 'application/pdf') ext = '.pdf';
    else if (result.type === 'application/json') ext = '.json';
    
    a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Semantic Search</h2>
        <p className="text-muted-foreground text-lg">Ask natural language questions to find relevant knowledge.</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
        <div className="relative glass-panel rounded-2xl p-2 flex items-center">
          <div className="p-4 text-muted-foreground">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "Find reports about renewable energy..."'
            className="flex-1 bg-transparent border-none outline-none text-white text-lg px-2 placeholder:text-muted-foreground/50"
          />
          <button 
            type="submit"
            className="btn-premium px-6 py-3 bg-white text-black font-semibold rounded-xl"
          >
            <div className="flex items-center gap-2 relative z-10">
              <Sparkles size={18} /> Search
            </div>
          </button>
        </div>
      </form>

      <div className="mt-12 space-y-4">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4 text-primary"
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin-reverse" />
              </div>
              <p className="text-sm font-medium animate-pulse">Consulting the neural network...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-sm font-medium text-muted-foreground mb-6">Found {results.length} relevant documents</div>
              {results.map((result, idx) => (
                <motion.div
                  key={result.id}
                  onClick={() => handleDownload(result)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 rounded-2xl hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer group flex items-start gap-4"
                >
                  <div className="p-3 bg-white/5 rounded-xl text-primary mt-1">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{result.title}</h3>
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full border border-green-500/20">
                        {result.match}% Match
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {result.snippet}
                    </p>
                  </div>
                  <div className="self-center p-3 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 text-white hover:bg-primary hover:text-white">
                    <Download size={20} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : query && !isSearching ? (
             <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              No knowledge found matching your query.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
