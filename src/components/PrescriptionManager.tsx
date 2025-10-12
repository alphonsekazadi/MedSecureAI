import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Prescription {
  id: string;
  patientName: string;
  patientEmail: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  refillsAllowed: number;
  refillsUsed: number;
  pharmacy?: string;
  sideEffects?: string[];
  interactions?: string[];
}

const PrescriptionManager: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    patientName: '',
    patientEmail: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    refillsAllowed: 0,
    sideEffects: [],
    interactions: []
  });

  // Mock data
  useEffect(() => {
    const mockPrescriptions: Prescription[] = [
      {
        id: '1',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'John Doe',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'john.doe@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-789012',
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food. Monitor blood pressure.',
        prescribedBy: 'Dr. Smith',
        prescribedDate: '2025-10-01',
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        status: 'active',
        refillsAllowed: 3,
        refillsUsed: 0,
        pharmacy: 'MedSecure Pharmacy',
        sideEffects: ['Dizziness', 'Dry cough'],
        interactions: ['Potassium supplements']
      },
      {
        id: '2',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'Jane Wilson',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'jane.wilson@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-456789',
        medication: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals to reduce stomach upset.',
        prescribedBy: 'Dr. Johnson',
        prescribedDate: '2025-09-15',
        startDate: '2025-09-15',
        endDate: '2025-12-15',
        status: 'active',
        refillsAllowed: 5,
        refillsUsed: 1,
        pharmacy: 'Health Plus Pharmacy',
        sideEffects: ['Nausea', 'Stomach upset'],
        interactions: ['Alcohol', 'Contrast dye']
      },
      {
        id: '3',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'Alice Brown',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'alice.brown@email.com',
        patientId: user?.role === 'patient' ? user?.patient_id || 'P-123456' : 'P-345678',
        medication: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'Three times daily',
        duration: '7 days',
        instructions: 'Complete full course even if feeling better.',
        prescribedBy: 'Dr. Davis',
        prescribedDate: '2025-09-20',
        startDate: '2025-09-20',
        endDate: '2025-09-27',
        status: 'completed',
        refillsAllowed: 0,
        refillsUsed: 0,
        pharmacy: 'City Care Pharmacy',
        sideEffects: ['Diarrhea', 'Nausea'],
        interactions: ['Birth control pills']
      }
    ];

    // Filter prescriptions based on role
    if (user?.role === 'patient') {
      setPrescriptions(mockPrescriptions.filter(prescription => 
        prescription.patientEmail === user?.email || prescription.patientId === user?.patient_id
      ));
    } else {
      setPrescriptions(mockPrescriptions);
    }
  }, [user]);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesFilter = filter === 'all' || prescription.status === filter;
    const matchesSearch = prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const canRead = hasPermission('read:prescriptions');
  const canWrite = hasPermission('write:prescriptions');
  // const canDelete = hasPermission('delete:records');

  const handleCreatePrescription = () => {
    if (!canWrite) {
      alert('You do not have permission to create prescriptions');
      return;
    }

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientName: newPrescription.patientName || '',
      patientEmail: newPrescription.patientEmail || '',
      patientId: `P-${Date.now().toString().slice(-6)}`,
      medication: newPrescription.medication || '',
      dosage: newPrescription.dosage || '',
      frequency: newPrescription.frequency || '',
      duration: newPrescription.duration || '',
      instructions: newPrescription.instructions || '',
      prescribedBy: user?.name || 'Dr. Unknown',
      prescribedDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      refillsAllowed: newPrescription.refillsAllowed || 0,
      refillsUsed: 0,
      sideEffects: newPrescription.sideEffects || [],
      interactions: newPrescription.interactions || []
    };

    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription({
      patientName: '',
      patientEmail: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      refillsAllowed: 0,
      sideEffects: [],
      interactions: []
    });
    setShowCreateForm(false);
  };

  // const handleUpdateStatus = (id: string, newStatus: Prescription['status']) => {
  //   if (!canWrite) {
  //     alert('You do not have permission to update prescriptions');
  //     return;
  //   }

  //   setPrescriptions(prescriptions.map(prescription => 
  //     prescription.id === id ? { ...prescription, status: newStatus } : prescription
  //   ));
  // };

  const handleRefill = (id: string) => {
    if (!canWrite) {
      alert('You do not have permission to process refills');
      return;
    }

    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === id && prescription.refillsUsed < prescription.refillsAllowed
        ? { ...prescription, refillsUsed: prescription.refillsUsed + 1 }
        : prescription
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            {user?.role === 'patient' ? 'My Prescriptions' : 'Prescription Management'}
          </h3>
          <p className="text-white/70">
            {user?.role === 'patient' 
              ? 'View your current and past prescriptions'
              : 'Manage patient prescriptions and medications'
            }
          </p>
        </div>
        
        {canWrite && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 backdrop-blur-xl border border-purple-500/20 flex items-center space-x-2 transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Prescription</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{prescriptions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {prescriptions.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-blue-600">
            {prescriptions.filter(p => p.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Refills Available</div>
          <div className="text-2xl font-bold text-purple-600">
            {prescriptions.reduce((sum, p) => sum + (p.refillsAllowed - p.refillsUsed), 0)}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Create New Prescription</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                value={newPrescription.patientName}
                onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Patient full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
              <input
                type="email"
                value={newPrescription.patientEmail}
                onChange={(e) => setNewPrescription({...newPrescription, patientEmail: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="patient@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
              <input
                type="text"
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Medication name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 10mg, 250mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 7 days, 30 days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refills Allowed</label>
              <input
                type="number"
                min="0"
                max="10"
                value={newPrescription.refillsAllowed}
                onChange={(e) => setNewPrescription({...newPrescription, refillsAllowed: parseInt(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                value={newPrescription.instructions}
                onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                placeholder="Special instructions for the patient..."
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreatePrescription}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Create Prescription
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💊</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {prescription.refillsAllowed - prescription.refillsUsed} refills left
                </div>
              </div>

              <h4 className="text-lg font-semibold text-purple-900 mb-1">{prescription.medication}</h4>
              <p className="text-sm text-gray-600 mb-2">{prescription.dosage} - {prescription.frequency}</p>
              
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <div>📅 {prescription.startDate} to {prescription.endDate}</div>
                <div>👨‍⚕️ {prescription.prescribedBy}</div>
                {user?.role !== 'patient' && (
                  <div>👤 {prescription.patientName}</div>
                )}
                {prescription.pharmacy && (
                  <div>🏪 {prescription.pharmacy}</div>
                )}
              </div>

              {prescription.instructions && (
                <div className="bg-purple-50 rounded p-2 mb-4">
                  <div className="text-xs text-purple-600 mb-1">Instructions:</div>
                  <div className="text-xs text-purple-800">{prescription.instructions}</div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPrescription(prescription)}
                  className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-md hover:bg-purple-100 text-sm font-medium"
                >
                  View Details
                </button>
                {canWrite && prescription.status === 'active' && prescription.refillsUsed < prescription.refillsAllowed && (
                  <button
                    onClick={() => handleRefill(prescription.id)}
                    className="bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 text-sm font-medium"
                  >
                    Refill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.917l-.818.68a6 6 0 01-3.86.917l-2.387.477a2 2 0 00-1.022.547L3.5 15.5a2 2 0 00-.5 1.328V19a2 2 0 002 2h14a2 2 0 002-2v-2.172a2 2 0 00-.5-1.328l-.572-.572z" />
          </svg>
          <p>No prescriptions found</p>
          {searchTerm && (
            <p className="text-sm">Try adjusting your search criteria</p>
          )}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-900">{selectedPrescription.medication}</h3>
                  <p className="text-gray-600">{selectedPrescription.dosage} - {selectedPrescription.frequency}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedPrescription.status)}`}>
                    {selectedPrescription.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prescription Details</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Prescribed:</strong> {selectedPrescription.prescribedDate}</div>
                      <div><strong>Doctor:</strong> {selectedPrescription.prescribedBy}</div>
                      <div><strong>Patient:</strong> {selectedPrescription.patientName}</div>
                      <div><strong>Duration:</strong> {selectedPrescription.duration}</div>
                      <div><strong>Start Date:</strong> {selectedPrescription.startDate}</div>
                      <div><strong>End Date:</strong> {selectedPrescription.endDate}</div>
                      <div><strong>Refills:</strong> {selectedPrescription.refillsUsed}/{selectedPrescription.refillsAllowed}</div>
                      {selectedPrescription.pharmacy && (
                        <div><strong>Pharmacy:</strong> {selectedPrescription.pharmacy}</div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedPrescription.instructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                    <p className="text-gray-700 bg-purple-50 rounded p-4">{selectedPrescription.instructions}</p>
                  </div>
                )}

                {selectedPrescription.sideEffects && selectedPrescription.sideEffects.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Possible Side Effects</h4>
                    <div className="bg-yellow-50 rounded p-4">
                      <ul className="list-disc list-inside text-sm text-yellow-800">
                        {selectedPrescription.sideEffects.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedPrescription.interactions && selectedPrescription.interactions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Drug Interactions</h4>
                    <div className="bg-red-50 rounded p-4">
                      <ul className="list-disc list-inside text-sm text-red-800">
                        {selectedPrescription.interactions.map((interaction, index) => (
                          <li key={index}>{interaction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedPrescription(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  {canWrite && (
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                      Edit Prescription
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

export default PrescriptionManager;