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
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca nelle domande frequenti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Tutte
        </button>
        {categories.map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeCategory === key
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      {Object.keys(filteredFAQs).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Nessuna domanda trovata per "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredFAQs).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded"></span>
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, index) => {
                  const isOpen = openQuestions[`${categoryKey}-${index}`];
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryKey, index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

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
