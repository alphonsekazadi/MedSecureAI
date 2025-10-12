import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  lastLogin: string;
  createdDate: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  address?: string;
  permissions: string[];
}

const UserManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newUser, setNewUser] = useState<Partial<SystemUser>>({
    name: '',
    email: '',
    role: 'patient',
    status: 'active',
    department: '',
    specialization: '',
    phone: '',
    permissions: []
  });

  // Mock data
  useEffect(() => {
    const mockUsers: SystemUser[] = [
      {
        id: '1',
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@medsecure.com',
        role: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        lastLogin: '2025-10-11T10:30:00Z',
        createdDate: '2025-01-15',
        status: 'active',
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        licenseNumber: 'MD-45678',
        phone: '+1-555-0123',
        permissions: ['read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments']
      },
      {
        id: '2',
        name: 'Dr. Michael Johnson',
        email: 'michael.johnson@medsecure.com',
        role: 'doctor',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
        lastLogin: '2025-10-10T14:22:00Z',
        createdDate: '2025-02-01',
        status: 'active',
        department: 'Internal Medicine',
        specialization: 'General Internal Medicine',
        licenseNumber: 'MD-56789',
        phone: '+1-555-0124',
        permissions: ['read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments']
      },
      {
        id: '3',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastLogin: '2025-10-11T09:15:00Z',
        createdDate: '2025-03-10',
        status: 'active',
        phone: '+1-555-0125',
        address: '123 Main St, Anytown, ST 12345',
        permissions: ['read:profile', 'read:appointments']
      },
      {
        id: '4',
        name: 'Jane Wilson',
        email: 'jane.wilson@email.com',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2b22433?w=150',
        lastLogin: '2025-10-09T16:45:00Z',
        createdDate: '2025-04-05',
        status: 'active',
        phone: '+1-555-0126',
        address: '456 Oak Ave, Somewhere, ST 67890',
        permissions: ['read:profile', 'read:appointments']
      },
      {
        id: '5',
        name: 'Admin User',
        email: 'admin@medsecure.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        lastLogin: '2025-10-11T11:00:00Z',
        createdDate: '2025-01-01',
        status: 'active',
        department: 'IT & Security',
        phone: '+1-555-0127',
        permissions: ['read:profile', 'read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments', 'delete:records', 'manage:users', 'view:analytics']
      }
    ];

    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canManageUsers = hasPermission('manage:users');

  const handleCreateUser = () => {
    if (!canManageUsers) {
      alert('You do not have permission to create users');
      return;
    }

    const rolePermissions = {
      admin: ['read:profile', 'read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments', 'delete:records', 'manage:users', 'view:analytics'],
      doctor: ['read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments'],
      patient: ['read:profile', 'read:appointments']
    };

    const user: SystemUser = {
      id: Date.now().toString(),
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role || 'patient',
      lastLogin: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
      department: newUser.department || undefined,
      specialization: newUser.specialization || undefined,
      phone: newUser.phone || undefined,
      permissions: rolePermissions[newUser.role || 'patient']
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'patient',
      status: 'active',
      department: '',
      specialization: '',
      phone: '',
      permissions: []
    });
    setShowCreateForm(false);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: SystemUser['status']) => {
    if (!canManageUsers) {
      alert('You do not have permission to update users');
      return;
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (!canManageUsers) {
      alert('You do not have permission to delete users');
      return;
    }

    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!canManageUsers) {
    return (
      <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
        <p className="text-red-300">You do not have permission to access user management features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-white">User Management</h3>
          <p className="text-white/70">Manage system users, roles, and permissions</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 backdrop-blur-xl border border-purple-500/20 flex items-center space-x-2 transition-all duration-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Total Users</div>
          <div className="text-2xl font-bold text-white">{users.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Doctors</div>
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => u.role === 'doctor').length}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Patients</div>
          <div className="text-2xl font-bold text-blue-400">
            {users.filter(u => u.role === 'patient').length}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
          <div className="text-sm text-white/60">Active</div>
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800 text-white">All Users</option>
              <option value="admin" className="bg-gray-800 text-white">Admins</option>
              <option value="doctor" className="bg-gray-800 text-white">Doctors</option>
              <option value="patient" className="bg-gray-800 text-white">Patients</option>
              <option value="active" className="bg-gray-800 text-white">Active</option>
              <option value="inactive" className="bg-gray-800 text-white">Inactive</option>
              <option value="suspended" className="bg-gray-800 text-white">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Create New User</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="user@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as SystemUser['role']})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+1-555-0123"
              />
            </div>
            {(newUser.role === 'doctor' || newUser.role === 'admin') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Cardiology, IT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={newUser.specialization}
                    onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Internal Medicine"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreateUser}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Create User
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                        ) : (
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded text-xs"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded text-xs"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p>No users found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search criteria</p>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    {selectedUser.avatar ? (
                      <img className="h-16 w-16 rounded-full" src={selectedUser.avatar} alt={selectedUser.name} />
                    ) : (
                      <span className="text-xl font-medium text-gray-700">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex space-x-2 mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Created:</strong> {selectedUser.createdDate}</div>
                      <div><strong>Last Login:</strong> {formatLastLogin(selectedUser.lastLogin)}</div>
                      {selectedUser.phone && <div><strong>Phone:</strong> {selectedUser.phone}</div>}
                      {selectedUser.department && <div><strong>Department:</strong> {selectedUser.department}</div>}
                      {selectedUser.specialization && <div><strong>Specialization:</strong> {selectedUser.specialization}</div>}
                      {selectedUser.licenseNumber && <div><strong>License:</strong> {selectedUser.licenseNumber}</div>}
                      {selectedUser.address && <div className="col-span-2"><strong>Address:</strong> {selectedUser.address}</div>}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.permissions.map((permission, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;