import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../components';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    places: 5,
    activities: 4,
    events: 3,
    itineraries: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // ใช้ Mock Data แทนการเรียก API จริง
      setTimeout(() => {
        setStats({
          places: 5,
          activities: 4,
          events: 3,
          itineraries: 3,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'สถานที่',
      value: stats.places,
      icon: '📍',
      color: 'bg-emerald-500',
      link: '/places',
      change: '+12%',
    },
    {
      title: 'กิจกรรม',
      value: stats.activities,
      icon: '🎯',
      color: 'bg-green-500',
      link: '/activities',
      change: '+8%',
    },
    {
      title: 'อีเวนต์',
      value: stats.events,
      icon: '🎉',
      color: 'bg-purple-500',
      link: '/events',
      change: '+5%',
    },
    {
      title: 'โปรแกรมท่องเที่ยว',
      value: stats.itineraries,
      icon: '🗺️',
      color: 'bg-orange-500',
      link: '/itineraries',
      change: '+15%',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมของระบบจัดการท่องเที่ยว</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" padding="default">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
                <Badge variant="success" size="sm">{card.change}</Badge>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : card.value.toLocaleString()}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/places" className="block">
            <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-left font-medium">
              + เพิ่มสถานที่
            </button>
          </Link>
          <Link to="/activities" className="block">
            <button className="w-full px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-left font-medium">
              + เพิ่มกิจกรรม
            </button>
          </Link>
          <Link to="/events" className="block">
            <button className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-left font-medium">
              + เพิ่มอีเวนต์
            </button>
          </Link>
          <Link to="/itineraries" className="block">
            <button className="w-full px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-left font-medium">
              + เพิ่มโปรแกรม
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="กิจกรรมล่าสุด">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-700">เพิ่มสถานที่ใหม่: <span className="font-medium">ตัวอย่างชื่อสถานที่</span></p>
                  <p className="text-gray-500 text-xs mt-1">{item} ชั่วโมงที่แล้ว</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status */}
        <Card title="สถานะระบบ">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">ฐานข้อมูล</span>
              </div>
              <Badge variant="success" size="sm">เชื่อมต่อแล้ว</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">API Server</span>
              </div>
              <Badge variant="success" size="sm">ทำงานปกติ</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Google Places API</span>
              </div>
              <Badge variant="success" size="sm">พร้อมใช้งาน</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Cache Storage</span>
              </div>
              <Badge variant="warning" size="sm">75% ใช้งาน</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}