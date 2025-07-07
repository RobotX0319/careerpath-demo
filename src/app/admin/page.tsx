'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

interface User {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  lastLogin: string;
  testsCompleted: number;
  status: 'active' | 'inactive';
}

interface Career {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  applications: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'users' | 'careers' | 'analytics'>('login');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Anvar Karimov',
      email: 'anvar@example.com',
      registeredAt: '2024-01-15',
      lastLogin: '2024-01-20',
      testsCompleted: 3,
      status: 'active'
    },
    {
      id: '2', 
      name: 'Malika Nazarova',
      email: 'malika@example.com',
      registeredAt: '2024-01-10',
      lastLogin: '2024-01-19',
      testsCompleted: 2,
      status: 'active'
    },
    {
      id: '3',
      name: 'Bobur Rahimov',
      email: 'bobur@example.com',
      registeredAt: '2024-01-08',
      lastLogin: '2024-01-18',
      testsCompleted: 1,
      status: 'inactive'
    }
  ]);

  const [careers, setCareers] = useState<Career[]>([
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Toshkent',
      type: 'To\'liq vaqt',
      salary: '$800-1200',
      postedDate: '2024-01-15',
      applications: 45
    },
    {
      id: '2',
      title: 'Backend Developer',
      company: 'DevStudio',
      location: 'Samarqand',
      type: 'To\'liq vaqt',
      salary: '$900-1400',
      postedDate: '2024-01-12',
      applications: 32
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: 'DesignLab',
      location: 'Toshkent',
      type: 'Yarim vaqt',
      salary: '$500-800',
      postedDate: '2024-01-10',
      applications: 28
    }
  ]);

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession === 'true') {
        setIsAuthenticated(true);
        setCurrentView('dashboard');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple admin check
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('adminUser', credentials.username);
      }
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      setError('Noto\'g\'ri login yoki parol');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminUser');
    }
    setIsAuthenticated(false);
    setCurrentView('login');
    setCredentials({ username: '', password: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteCareer = (careerId: string) => {
    setCareers(careers.filter(career => career.id !== careerId));
  };

  // Login View
  if (!isAuthenticated || currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                🔐 Admin Panel
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Administrator sifatida kirish
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    name="username"
                    type="text"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Foydalanuvchi nomi"
                    value={credentials.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Parol"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? '⏳ Kuting...' : '🔑 Kirish'}
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                  <strong>Demo ma'lumotlar:</strong><br />
                  Username: <code>admin</code><br />
                  Password: <code>admin123</code>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Header Component
  const AdminHeader = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">CareerPath Admin</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'users' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Foydalanuvchilar
              </button>
              <button
                onClick={() => setCurrentView('careers')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'careers' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Karyeralar
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'analytics' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Analitika
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">👨‍💼 Admin</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              🚪 Chiqish
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎛️ Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              CareerPath platformasini boshqarish paneli
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">👥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Foydalanuvchilar</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">💼</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Karyeralar</p>
                    <p className="text-2xl font-bold text-gray-900">{careers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📝</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Jami Testlar</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.reduce((acc, user) => acc + user.testsCompleted, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">�</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Faol Foydalanuvchilar</p>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                📈 So'nggi faollik
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <span className="text-gray-600">Yangi foydalanuvchi ro'yxatdan o'tdi</span>
                  <span className="ml-auto text-gray-400">5 daqiqa oldin</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  <span className="text-gray-600">Shaxsiyat testi yakunlandi</span>
                  <span className="ml-auto text-gray-400">15 daqiqa oldin</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  <span className="text-gray-600">Yangi karyera yo'nalishi qo'shildi</span>
                  <span className="ml-auto text-gray-400">1 soat oldin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Users View
  if (currentView === 'users') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              👥 Foydalanuvchilar boshqaruvi
            </h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Foydalanuvchilar ro'yxati ({users.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Foydalanuvchi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ro'yxatdan o'tgan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Testlar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Holat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.registeredAt).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.testsCompleted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Faol' : 'Nofaol'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1 rounded text-xs font-medium mr-2 ${
                              user.status === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Careers View
  if (currentView === 'careers') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                💼 Karyeralar boshqaruvi
              </h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Yangi karyera qo'shish
              </button>
            </div>

            <div className="grid gap-6">
              {careers.map((career) => (
                <div key={career.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {career.title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Kompaniya:</span> {career.company}
                        </div>
                        <div>
                          <span className="font-medium">Joylashuv:</span> {career.location}
                        </div>
                        <div>
                          <span className="font-medium">Maosh:</span> {career.salary}
                        </div>
                        <div>
                          <span className="font-medium">Arizalar:</span> {career.applications}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                        Tahrirlash
                      </button>
                      <button 
                        onClick={() => deleteCareer(career.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analytics View
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              📊 Analitika va Hisobotlar
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* User Growth Chart Placeholder */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Foydalanuvchilar o'sishi
                </h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </div>

              {/* Test Completion Chart Placeholder */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Test yakunlash statistikasi
                </h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart placeholder</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Umumiy statistika
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-500">Faol foydalanuvchilar</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round(users.reduce((acc, u) => acc + u.testsCompleted, 0) / users.length)}
                  </p>
                  <p className="text-sm text-gray-500">O'rtacha test soni</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {careers.reduce((acc, c) => acc + c.applications, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Jami arizalar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
}