import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientEmail: string;
  patientId: string;
  recordType: 'diagnosis' | 'lab-result' | 'prescription' | 'visit-note' | 'imaging';
  title: string;
  description: string;
  date: string;
  doctor: string;
  status: 'active' | 'archived' | 'draft';
  confidentialityLevel: 'normal' | 'sensitive' | 'restricted';
  attachments?: string[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
}

const MedicalRecords: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockRecords: MedicalRecord[] = [
      {
        id: '1',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'John Doe',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'john.doe@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-789012',
        recordType: 'diagnosis',
        title: 'Annual Physical Examination',
        description: 'Complete physical examination with normal findings. Patient reports good overall health.',
        date: '2025-10-10',
        doctor: 'Dr. Smith',
        status: 'active',
        confidentialityLevel: 'normal',
        vitals: {
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 98.6,
          weight: 70,
          height: 175
        }
      },
      {
        id: '2',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'Jane Wilson',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'jane.wilson@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-456789',
        recordType: 'lab-result',
        title: 'Blood Chemistry Panel',
        description: 'Complete metabolic panel results within normal limits. Cholesterol slightly elevated.',
        date: '2025-10-08',
        doctor: 'Dr. Johnson',
        status: 'active',
        confidentialityLevel: 'normal'
      },
      {
        id: '3',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'Alice Brown',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'alice.brown@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-345678',
        recordType: 'prescription',
        title: 'Hypertension Medication',
        description: 'Prescribed Lisinopril 10mg daily for hypertension management.',
        date: '2025-10-05',
        doctor: 'Dr. Davis',
        status: 'active',
        confidentialityLevel: 'normal'
      }
    ];

    // Filter records based on role
    if (user?.role === 'patient') {
      setRecords(mockRecords.filter(record => 
        record.patientEmail === user?.email || record.patientId === user?.patient_id
      ));
    } else {
      setRecords(mockRecords);
    }
  }, [user]);

  const filteredRecords = records.filter(record => {
    const matchesFilter = filter === 'all' || record.recordType === filter;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'diagnosis': return '🩺';
      case 'lab-result': return '🧪';
      case 'prescription': return '💊';
      case 'visit-note': return '📝';
      case 'imaging': return '📋';
      default: return '📄';
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis': return 'bg-blue-100 text-blue-800';
      case 'lab-result': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'visit-note': return 'bg-yellow-100 text-yellow-800';
      case 'imaging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'normal': return 'text-green-600';
      case 'sensitive': return 'text-yellow-600';
      case 'restricted': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const canRead = hasPermission('read:patients');
  const canWrite = hasPermission('write:patients');
  // const canDelete = hasPermission('delete:records');

  const handleViewRecord = (record: MedicalRecord) => {
    if (!canRead && user?.role === 'patient' && record.patientEmail !== user?.email) {
      alert('You can only view your own medical records');
      return;
    }
    setSelectedRecord(record);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {user?.role === 'patient' ? 'My Medical Records' : 'Patient Medical Records'}
          </h3>
          <p className="text-white/70">
            {user?.role === 'patient' 
              ? 'View your medical history and health records'
              : 'Access and manage patient medical records'
            }
          </p>
        </div>
        
        {canWrite && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 backdrop-blur-xl border border-blue-500/20 flex items-center space-x-2 transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Record</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Total Records</div>
          <div className="text-2xl font-bold text-white">{records.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Diagnoses</div>
          <div className="text-2xl font-bold text-blue-400">
            {records.filter(r => r.recordType === 'diagnosis').length}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Lab Results</div>
          <div className="text-2xl font-bold text-green-400">
            {records.filter(r => r.recordType === 'lab-result').length}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Prescriptions</div>
          <div className="text-2xl font-bold text-purple-400">
            {records.filter(r => r.recordType === 'prescription').length}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Visit Notes</div>
          <div className="text-2xl font-bold text-yellow-400">
            {records.filter(r => r.recordType === 'visit-note').length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800 text-white">All Records</option>
              <option value="diagnosis" className="bg-gray-800 text-white">Diagnoses</option>
              <option value="lab-result" className="bg-gray-800 text-white">Lab Results</option>
              <option value="prescription" className="bg-gray-800 text-white">Prescriptions</option>
              <option value="visit-note" className="bg-gray-800 text-white">Visit Notes</option>
              <option value="imaging" className="bg-gray-800 text-white">Imaging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 transform hover:scale-[1.02]">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getRecordTypeIcon(record.recordType)}</span>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecordTypeColor(record.recordType)}`}>
                      {record.recordType.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className={`text-sm ${getConfidentialityColor(record.confidentialityLevel)}`}>
                  🔒 {record.confidentialityLevel}
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{record.title}</h4>
              <p className="text-white/70 text-sm mb-3 line-clamp-2">{record.description}</p>
              
              <div className="space-y-1 text-sm text-white/60 mb-4">
                <div>📅 {record.date}</div>
                <div>👨‍⚕️ {record.doctor}</div>
                {user?.role !== 'patient' && (
                  <div>👤 {record.patientName}</div>
                )}
              </div>

              {record.vitals && (
                <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-2 mb-4">
                  <div className="text-xs text-white/60 mb-1">Vitals:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-white/80">
                    {record.vitals.bloodPressure && <div>BP: {record.vitals.bloodPressure}</div>}
                    {record.vitals.heartRate && <div>HR: {record.vitals.heartRate} bpm</div>}
                    {record.vitals.temperature && <div>Temp: {record.vitals.temperature}°F</div>}
                    {record.vitals.weight && <div>Weight: {record.vitals.weight} kg</div>}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleViewRecord(record)}
                className="w-full bg-blue-500/20 text-blue-400 px-3 py-2 rounded-xl hover:bg-blue-500/30 backdrop-blur-xl border border-blue-500/20 text-sm font-medium transition-all duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <svg className="h-12 w-12 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-white">No medical records found</p>
          {searchTerm && (
            <p className="text-sm text-white/50">Try adjusting your search criteria</p>
          )}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedRecord.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecordTypeColor(selectedRecord.recordType)}`}>
                      {selectedRecord.recordType.replace('-', ' ')}
                    </span>
                    <span className={`text-sm ${getConfidentialityColor(selectedRecord.confidentialityLevel)}`}>
                      🔒 {selectedRecord.confidentialityLevel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-white/60 hover:text-white/80 p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Record Details</h4>
                  <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                      <div><strong className="text-white">Date:</strong> {selectedRecord.date}</div>
                      <div><strong className="text-white">Doctor:</strong> {selectedRecord.doctor}</div>
                      <div><strong className="text-white">Patient:</strong> {selectedRecord.patientName}</div>
                      <div><strong className="text-white">Patient ID:</strong> {selectedRecord.patientId}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Description</h4>
                  <p className="text-white/80 bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">{selectedRecord.description}</p>
                </div>

                {selectedRecord.vitals && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Vital Signs</h4>
                    <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white/80">
                        {selectedRecord.vitals.bloodPressure && (
                          <div><strong className="text-white">Blood Pressure:</strong> {selectedRecord.vitals.bloodPressure}</div>
                        )}
                        {selectedRecord.vitals.heartRate && (
                          <div><strong className="text-white">Heart Rate:</strong> {selectedRecord.vitals.heartRate} bpm</div>
                        )}
                        {selectedRecord.vitals.temperature && (
                          <div><strong className="text-white">Temperature:</strong> {selectedRecord.vitals.temperature}°F</div>
                        )}
                        {selectedRecord.vitals.weight && (
                          <div><strong className="text-white">Weight:</strong> {selectedRecord.vitals.weight} kg</div>
                        )}
                        {selectedRecord.vitals.height && (
                          <div><strong className="text-white">Height:</strong> {selectedRecord.vitals.height} cm</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-white/10 text-white/80 px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all duration-200"
                  >
                    Close
                  </button>
                  {canWrite && (
                    <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 backdrop-blur-xl border border-blue-500/20 transition-all duration-200">
                      Edit Record
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;