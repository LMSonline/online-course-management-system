"use client";
import { useState } from 'react';
import {
  Award, Search, CheckCircle, XCircle, Download, ExternalLink,
  Calendar, User, BookOpen, Shield, Copy, Eye, Filter, TrendingUp,
  Clock, FileText, QrCode
} from 'lucide-react';

import { CertificateCard } from "@/core/components/admin/cerfificate/CertificateCard";
import { CertificateVerifyTab } from "@/core/components/admin/cerfificate/CertificateVerifyTab";
import { CertificateAllTab } from "@/core/components/admin/cerfificate/CertificateAllTab";
import { CertificateStatsTab } from "@/core/components/admin/cerfificate/CertificateStatsTab";
import { CertificateDetailModal } from "@/core/components/admin/cerfificate/CertificateDetailModal";

interface Certificate {
  id: string;
  certificateCode: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  instructorName: string;
  issueDate: string;
  completionDate: string;
  score: number;
  status: 'valid' | 'revoked' | 'expired';
  verificationUrl: string;
  blockchainHash?: string;
}

export default function AdminCertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'verify' | 'all' | 'stats'>('verify');

  // Mock data
  const stats = {
    totalIssued: 8456,
    validCertificates: 8123,
    revokedCertificates: 287,
    expiredCertificates: 46,
    thisMonth: 342,
    lastMonth: 298,
    verificationRequests: 1245
  };

  const certificates: Certificate[] = [
    {
      id: '1',
      certificateCode: 'CERT-2025-RCT-001234',
      studentName: 'Alice Brown',
      studentEmail: 'alice@example.com',
      courseName: 'React Mastery 2025',
      instructorName: 'John Doe',
      issueDate: '2025-01-20',
      completionDate: '2025-01-18',
      score: 95,
      status: 'valid',
      verificationUrl: 'https://lms.jobnest.com/verify/CERT-2025-RCT-001234',
      blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
    },
    {
      id: '2',
      certificateCode: 'CERT-2025-PYT-001198',
      studentName: 'Bob Wilson',
      studentEmail: 'bob@example.com',
      courseName: 'Python for Data Science',
      instructorName: 'Jane Smith',
      issueDate: '2025-01-19',
      completionDate: '2025-01-17',
      score: 88,
      status: 'valid',
      verificationUrl: 'https://lms.jobnest.com/verify/CERT-2025-PYT-001198',
      blockchainHash: '0x5c8fade3a1b45c8fade3a1b45c8fade3a1b45c8fade3a1b45c8fade3a1b45c8f'
    },
    {
      id: '3',
      certificateCode: 'CERT-2025-UXD-001156',
      studentName: 'Carol Davis',
      studentEmail: 'carol@example.com',
      courseName: 'UI/UX Design Masterclass',
      instructorName: 'Mike Johnson',
      issueDate: '2025-01-18',
      completionDate: '2025-01-16',
      score: 92,
      status: 'valid',
      verificationUrl: 'https://lms.jobnest.com/verify/CERT-2025-UXD-001156'
    },
    {
      id: '4',
      certificateCode: 'CERT-2024-JSA-000982',
      studentName: 'David Lee',
      studentEmail: 'david@example.com',
      courseName: 'JavaScript Advanced',
      instructorName: 'Sarah Connor',
      issueDate: '2024-12-15',
      completionDate: '2024-12-13',
      score: 78,
      status: 'revoked',
      verificationUrl: 'https://lms.jobnest.com/verify/CERT-2024-JSA-000982'
    },
    {
      id: '5',
      certificateCode: 'CERT-2025-WEB-001201',
      studentName: 'Emma Watson',
      studentEmail: 'emma@example.com',
      courseName: 'Complete Web Development',
      instructorName: 'Tom Hardy',
      issueDate: '2025-01-17',
      completionDate: '2025-01-15',
      score: 96,
      status: 'valid',
      verificationUrl: 'https://lms.jobnest.com/verify/CERT-2025-WEB-001201',
      blockchainHash: '0x3d4fade2b9c73d4fade2b9c73d4fade2b9c73d4fade2b9c73d4fade2b9c73d4f'
    }
  ];

  const monthlyIssuance = [
    { month: 'Aug', count: 542 },
    { month: 'Sep', count: 678 },
    { month: 'Oct', count: 723 },
    { month: 'Nov', count: 812 },
    { month: 'Dec', count: 891 },
    { month: 'Jan', count: 1024 }
  ];

  const topCourses = [
    { name: 'React Mastery 2025', certificates: 234, percentage: 28 },
    { name: 'Python for Data Science', certificates: 198, percentage: 24 },
    { name: 'UI/UX Design Masterclass', certificates: 156, percentage: 19 },
    { name: 'Complete Web Development', certificates: 142, percentage: 17 },
    { name: 'JavaScript Advanced', certificates: 98, percentage: 12 }
  ];

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const found = certificates.find(c =>
        c.certificateCode.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResult(found || null);
      setIsSearching(false);
    }, 800);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Certificate code copied to clipboard!');
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    alert('Blockchain hash copied to clipboard!');
  };

  const getStatusBadge = (status: Certificate['status']) => {
    const styles = {
      valid: 'bg-green-900/30 text-green-400 border-green-700',
      revoked: 'bg-red-900/30 text-red-400 border-red-700',
      expired: 'bg-gray-700 text-gray-300 border-gray-600'
    };

    const icons = {
      valid: <CheckCircle className="w-3 h-3" />,
      revoked: <XCircle className="w-3 h-3" />,
      expired: <Clock className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification & Management</h1>
        <p className="text-gray-400">Verify certificate authenticity and manage all issued certificates</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-800 mb-8">
        <button
          onClick={() => setSelectedTab('verify')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'verify'
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Verify Certificate
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'all'
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All Certificates
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('stats')}
          className={`px-4 py-3 font-medium transition-colors ${selectedTab === 'stats'
            ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Statistics
          </div>
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'verify' && (
        <CertificateVerifyTab
          certificates={certificates}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          setSelectedCertificate={setSelectedCertificate}
        />
      )}
      {selectedTab === 'all' && (
        <CertificateAllTab
          certificates={certificates}
          setSelectedCertificate={setSelectedCertificate}
        />
      )}
      {selectedTab === 'stats' && (
        <CertificateStatsTab
          stats={stats}
          monthlyIssuance={monthlyIssuance}
          topCourses={topCourses}
        />
      )}

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <CertificateDetailModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
