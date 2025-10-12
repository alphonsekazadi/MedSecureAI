import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

const AppointmentManager: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: '',
    patientEmail: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'consultation',
    status: 'scheduled',
    notes: ''
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Doe',
        patientEmail: 'john.doe@email.com',
        doctorName: 'Dr. Smith',
        date: '2025-10-15',
        time: '10:00',
        type: 'Consultation',
        status: 'scheduled',
        notes: 'Regular checkup'
      },
      {
        id: '2',
        patientName: 'Jane Wilson',
        patientEmail: 'jane.wilson@email.com',
        doctorName: 'Dr. Johnson',
        date: '2025-10-16',
        time: '14:30',
        type: 'Follow-up',
        status: 'confirmed',
        notes: 'Follow-up on blood test results'
      },
      {
        id: '3',
        patientName: user?.role === 'patient' ? user?.name || 'Your Name' : 'Alice Brown',
        patientEmail: user?.role === 'patient' ? user?.email || 'your@email.com' : 'alice.brown@email.com',
        doctorName: 'Dr. Davis',
        date: '2025-10-17',
        time: '09:15',
        type: 'Specialist',
        status: 'scheduled',
        notes: 'Cardiology consultation'
      }
    ];

    // Filter appointments based on role
    if (user?.role === 'patient') {
      setAppointments(mockAppointments.filter(apt => 
        apt.patientEmail === user?.email || apt.patientName === user?.name
      ));
    } else {
      setAppointments(mockAppointments);
    }
  }, [user]);

  const handleCreateAppointment = () => {
    if (!hasPermission('write:appointments')) {
      alert('You do not have permission to create appointments');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientName: newAppointment.patientName || '',
      patientEmail: newAppointment.patientEmail || '',
      doctorName: newAppointment.doctorName || '',
      date: newAppointment.date || '',
      time: newAppointment.time || '',
      type: newAppointment.type || 'consultation',
      status: 'scheduled',
      notes: newAppointment.notes || ''
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patientName: '',
      patientEmail: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'consultation',
      status: 'scheduled',
      notes: ''
    });
    setShowCreateForm(false);
  };

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    if (!hasPermission('write:appointments')) {
      alert('You do not have permission to update appointments');
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleDeleteAppointment = (id: string) => {
    if (!hasPermission('delete:records')) {
      alert('You do not have permission to delete appointments');
      return;
    }

    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canWrite = hasPermission('write:appointments');
  const canDelete = hasPermission('delete:records');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {user?.role === 'patient' ? 'My Appointments' : 'Appointment Management'}
          </h3>
          <p className="text-gray-600">
            {user?.role === 'patient' 
              ? 'View and manage your medical appointments'
              : 'Manage patient appointments and scheduling'
            }
          </p>
        </div>
        
        {canWrite && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Appointment</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Scheduled</div>
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-2xl font-bold text-blue-600">
            {appointments.filter(a => a.status === 'confirmed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Create New Appointment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
              <input
                type="email"
                value={newAppointment.patientEmail}
                onChange={(e) => setNewAppointment({...newAppointment, patientEmail: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="patient@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <input
                type="text"
                value={newAppointment.doctorName}
                onChange={(e) => setNewAppointment({...newAppointment, doctorName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Dr. Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newAppointment.type}
                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="specialist">Specialist</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreateAppointment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Appointment
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

      {/* Appointments List */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {(canWrite || canDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  {(canWrite || canDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {canWrite && (
                        <div className="inline-flex space-x-1">
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          >
                            Complete
                          </button>
                        </div>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded ml-1"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6v1a2 2 0 01-2 2h-2a2 2 0 01-2-2V7zm6 0a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h1" />
            </svg>
            <p>No appointments found</p>
            {canWrite && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Create your first appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManager;