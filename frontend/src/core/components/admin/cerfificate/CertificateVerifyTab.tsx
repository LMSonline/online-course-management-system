import { Shield, Search, CheckCircle, XCircle } from "lucide-react";
import { CertificateCard, Certificate } from "./CertificateCard";
import React from "react";

export function CertificateVerifyTab({
  certificates,
  searchQuery,
  setSearchQuery,
  searchResult,
  setSearchResult,
  isSearching,
  setIsSearching,
  setSelectedCertificate
}: {
  certificates: Certificate[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchResult: Certificate | null;
  setSearchResult: (c: Certificate | null) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  setSelectedCertificate: (c: Certificate) => void;
}) {
  const handleSearch = () => {
    setIsSearching(true);
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

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#00ff00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#00ff00]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Certificate</h2>
            <p className="text-gray-400">Enter the certificate code to verify its authenticity</p>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Enter certificate code (e.g., CERT-2025-RCT-001234)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#1a2237] border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00] text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery}
            className="w-full px-6 py-4 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Verify Certificate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className="bg-[#12182b] border border-gray-800 rounded-lg p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Certificate Verified!</h3>
              <p className="text-gray-400">This certificate is authentic and valid</p>
            </div>
            <CertificateCard
              cert={searchResult}
              onView={setSelectedCertificate}
              onCopyCode={handleCopyCode}
              onCopyHash={handleCopyHash}
            />
          </div>
        </div>
      )}

      {searchResult === null && searchQuery && !isSearching && (
        <div className="bg-[#12182b] border border-red-700 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h3>
            <p className="text-gray-400 mb-4">No certificate found with code: <span className="font-mono text-red-400">{searchQuery}</span></p>
            <p className="text-sm text-gray-500">Please check the certificate code and try again.</p>
          </div>
        </div>
      )}

      {/* Quick Verification Guide */}
      <div className="bg-[#12182b] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How to Verify a Certificate</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-blue-400">1</span>
            </div>
            <h4 className="font-medium text-white mb-2">Get Certificate Code</h4>
            <p className="text-sm text-gray-400">Obtain the unique certificate code from the certificate holder</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-blue-400">2</span>
            </div>
            <h4 className="font-medium text-white mb-2">Enter Code</h4>
            <p className="text-sm text-gray-400">Type or paste the certificate code in the search box above</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-blue-400">3</span>
            </div>
            <h4 className="font-medium text-white mb-2">View Results</h4>
            <p className="text-sm text-gray-400">Get instant verification and view certificate details</p>
          </div>
        </div>
      </div>
    </div>
  );
}