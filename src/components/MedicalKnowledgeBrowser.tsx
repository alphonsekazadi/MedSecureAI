import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { medicalKnowledgeService } from '../services/medicalKnowledgeService';
import type { MedicalKnowledgeItem, UserContext } from '../services/medicalKnowledgeService';
import { Search, Book, Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const MedicalKnowledgeBrowser: React.FC = () => {
  const { user } = useAuth();
  const [knowledgeItems, setKnowledgeItems] = useState<MedicalKnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MedicalKnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessStats, setAccessStats] = useState<{
    totalItems: number;
    accessibleItems: number;
    accessPercentage: number;
    restrictedBy: string[];
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const userContext: UserContext = {
    role: (user?.role as any) || 'patient',
    specializations: [user?.specialization || 'family-medicine'], // Convert single specialization to array
    permissions: user?.permissions || []
  };

  useEffect(() => {
    loadKnowledgeData();
  }, [user]);

  const loadKnowledgeData = async () => {
    setLoading(true);
    try {
      const [items, stats] = await Promise.all([
        medicalKnowledgeService.getAccessibleKnowledge(userContext),
        medicalKnowledgeService.getAccessStats(userContext)
      ]);
      
      setKnowledgeItems(items);
      setAccessStats(stats);
    } catch (error) {
      console.error('Error loading medical knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await medicalKnowledgeService.searchKnowledge(searchQuery, userContext);
      setKnowledgeItems(results);
    } catch (error) {
      console.error('Error searching knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = async (itemId: string) => {
    const item = await medicalKnowledgeService.getKnowledgeItem(itemId, userContext);
    setSelectedItem(item);
  };

  const filteredItems = selectedCategory === 'all' 
    ? knowledgeItems 
    : knowledgeItems.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diagnostic': return '🔬';
      case 'treatment': return '🏥';
      case 'medication': return '💊';
      default: return '📋';
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-white/70 bg-white/10 border-white/20';
    }
  };

  if (loading && !knowledgeItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading medical knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with FGA Stats */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Medical Knowledge Base</h2>
            <p className="text-white/70">
              Access to medical information with Fine-Grained Authorization
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Auth0 FGA Protected</span>
          </div>
        </div>

        {/* Access Statistics */}
        {accessStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Knowledge</p>
                  <p className="text-2xl font-bold text-white">{accessStats.totalItems}</p>
                </div>
                <Book className="h-8 w-8 text-white/50" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Accessible</p>
                  <p className="text-2xl font-bold text-green-400">{accessStats.accessibleItems}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Access Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{accessStats.accessPercentage}%</p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Your Role</p>
                  <p className="text-lg font-bold text-purple-400 capitalize">{userContext.role}</p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userContext.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                  userContext.role === 'doctor' ? 'bg-green-500/20 text-green-400' :
                  userContext.role === 'nurse' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-teal-500/20 text-teal-400'
                }`}>
                  <Shield className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restrictions Info */}
        {accessStats && accessStats.restrictedBy.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-orange-300 font-medium mb-1">Access Restrictions</p>
                <p className="text-orange-200/80 text-sm">
                  Some content is restricted due to: {accessStats.restrictedBy.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search medical knowledge... (e.g., diabetes, hypertension)"
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-blue-500/30 backdrop-blur-xl"
          >
            Search
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['all', 'diagnostic', 'treatment', 'medication'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category === 'all' ? '📚 All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Available Knowledge ({filteredItems.length})</h3>
          {filteredItems.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-8 text-center">
              <Lock className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">No accessible knowledge items found</p>
              <p className="text-white/50 text-sm">
                Try adjusting your search or contact your administrator for access
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(item.category)}</span>
                    <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors duration-200">
                      {item.title}
                    </h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSensitivityColor(item.metadata.sensitivity)}`}>
                    {item.metadata.sensitivity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span className="capitalize">{item.category}</span>
                  <span>Updated: {item.metadata.lastUpdated}</span>
                </div>
                {item.metadata.specializationRequired && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.metadata.specializationRequired.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60"
                      >
                        {spec}
                      </span>
                    ))}
                    {item.metadata.specializationRequired.length > 2 && (
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">
                        +{item.metadata.specializationRequired.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Selected Item Detail */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          {selectedItem ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{selectedItem.title}</h3>
                  <p className="text-white/70 text-sm capitalize">{selectedItem.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSensitivityColor(selectedItem.metadata.sensitivity)}`}>
                    {selectedItem.metadata.sensitivity} sensitivity
                  </span>
                </div>
              </div>

              {/* Access Control Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Access Control Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/70">Allowed Roles:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.metadata.accessLevel.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            role === userContext.role
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-white/10 text-white/60 border border-white/20'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedItem.metadata.specializationRequired && (
                    <div>
                      <span className="text-white/70">Required Specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedItem.metadata.specializationRequired.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Content Preview</h4>
                <p className="text-white/70 text-sm">
                  This would display the full medical knowledge content from: {selectedItem.filePath}
                </p>
                <p className="text-white/50 text-xs mt-2">
                  In a production environment, this would show the parsed markdown content with proper medical formatting.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Book className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">Select a knowledge item</p>
              <p className="text-white/50 text-sm">
                Choose an item from the list to view detailed medical information
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FGA Demo Information */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-500/20 p-3 rounded-xl">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Auth0 Fine-Grained Authorization Demo</h3>
            <p className="text-white/80 mb-4">
              This medical knowledge base demonstrates Auth0's FGA capabilities by controlling access to sensitive medical information based on:
            </p>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> User roles (patient, doctor, admin, nurse, pharmacist)</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Medical specializations and certifications</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Content sensitivity levels (low, medium, high)</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Prescribing authority for medication information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalKnowledgeBrowser;