'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQClient({ faqData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (categoryKey, index) => {
    const key = `${categoryKey}-${index}`;
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQs based on search and category
  const getFilteredFAQs = () => {
    let filtered = {};
    
    Object.entries(faqData).forEach(([key, category]) => {
      if (activeCategory !== 'all' && key !== activeCategory) return;
      
      const matchingQuestions = category.questions.filter(faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingQuestions.length > 0) {
        filtered[key] = {
          ...category,
          questions: matchingQuestions
        };
      }
    });
    
    return filtered;
  };

  const filteredFAQs = getFilteredFAQs();
  const categories = Object.entries(faqData);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <label
          htmlFor="faq-search"
          className="sr-only"
        >
          Cerca nelle domande frequenti
        </label>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            placeholder="Cerca nelle domande frequenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 border-2 border-gray-700 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none text-lg"
            aria-label="Cerca nelle domande frequenti"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div
        className="flex flex-wrap gap-3 justify-center mb-12"
        role="group"
        aria-label="Filtra per categoria"
      >
        <button
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          className={`px-6 py-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Tutte
        </button>
        {categories.map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            aria-pressed={activeCategory === key}
            className={`px-6 py-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
              activeCategory === key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      <div
        aria-live="polite"
        aria-atomic="false"
      >
        {Object.keys(filteredFAQs).length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-xl text-gray-400">
              Nessuna domanda trovata per &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredFAQs).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 bg-indigo-500 rounded" aria-hidden="true"></span>
                  {category.title}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const itemKey = `${categoryKey}-${index}`;
                    const isOpen = openQuestions[itemKey];
                    const panelId = `faq-panel-${itemKey}`;
                    const triggerId = `faq-trigger-${itemKey}`;
                    return (
                      <div
                        key={index}
                        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-colors hover:border-gray-600"
                      >
                        <button
                          id={triggerId}
                          onClick={() => toggleQuestion(categoryKey, index)}
                          aria-expanded={isOpen ? 'true' : 'false'}
                          aria-controls={panelId}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                        >
                          <span className="font-semibold text-gray-100 pr-4">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          hidden={!isOpen}
                          className="px-6 pb-4 text-gray-300 leading-relaxed border-t border-gray-700/60 pt-3"
                        >
                          {faq.a}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">
          Non hai trovato la risposta che cercavi?
        </h3>
        <p className="text-indigo-100 mb-6">
          Contattaci direttamente e il nostro team ti risponderà entro 24 ore
        </p>
        <a
          href="mailto:info@dtfitalia.it"
          className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
        >
          Contattaci Ora
        </a>
      </div>
    </div>
  );
}
