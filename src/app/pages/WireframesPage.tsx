import React from "react";

export function WireframesPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-black">Application Wireframes</h1>
        <p className="text-gray-600 mb-8">Low-fidelity wireframes of all 7 screens</p>
      </div>

      {/* 1. Login/Register Screen */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">1. Login / Register</h2>
        <div className="border-2 border-black bg-white p-8">
          <div className="max-w-md mx-auto space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border-2 border-black bg-gray-300" />
            </div>
            <div className="h-6 w-48 bg-black mx-auto" />
            
            {/* Tabs */}
            <div className="flex gap-2 border-b-2 border-black">
              <div className="h-10 w-32 border-2 border-black bg-gray-300" />
              <div className="h-10 w-32 border-2 border-black bg-white" />
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-gray-400 mb-2" />
                <div className="h-10 border-2 border-black bg-white" />
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-400 mb-2" />
                <div className="h-10 border-2 border-black bg-white" />
              </div>
            </div>
            
            {/* Button */}
            <div className="h-12 border-2 border-black bg-black" />
          </div>
        </div>
      </div>

      {/* 2. Dashboard */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">2. Dashboard</h2>
        <div className="border-2 border-black bg-white">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r-2 border-black p-4 space-y-4">
              <div className="h-12 bg-gray-300 border-2 border-black" />
              <div className="space-y-2">
                <div className="h-10 bg-gray-400 border border-black" />
                <div className="h-10 bg-white border border-black" />
                <div className="h-10 bg-white border border-black" />
                <div className="h-10 bg-white border border-black" />
                <div className="h-10 bg-white border border-black" />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-black pb-4">
                <div className="h-8 w-48 bg-black" />
                <div className="w-10 h-10 border-2 border-black rounded-full bg-gray-300" />
              </div>
              
              {/* Chart */}
              <div className="border-2 border-black p-4">
                <div className="h-4 w-40 bg-black mb-4" />
                <div className="h-64 bg-gray-200 border border-black flex items-end justify-around px-4 pb-4">
                  <div className="w-12 bg-gray-400 border border-black" style={{ height: '60%' }} />
                  <div className="w-12 bg-gray-400 border border-black" style={{ height: '80%' }} />
                  <div className="w-12 bg-gray-400 border border-black" style={{ height: '50%' }} />
                  <div className="w-12 bg-gray-400 border border-black" style={{ height: '70%' }} />
                  <div className="w-12 bg-gray-400 border border-black" style={{ height: '85%' }} />
                </div>
              </div>
              
              {/* Farm Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-2 border-black p-4 space-y-3">
                    <div className="h-5 w-32 bg-black" />
                    <div className="h-3 w-24 bg-gray-400" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-gray-300 border border-black" />
                      <div className="h-12 bg-gray-300 border border-black" />
                      <div className="h-12 bg-gray-300 border border-black" />
                    </div>
                    <div className="h-10 border-2 border-black bg-black" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Farm Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">3. Farm Details</h2>
        <div className="border-2 border-black bg-white p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-black" />
              <div className="h-4 w-32 bg-gray-400" />
            </div>
            <div className="h-10 w-32 border-2 border-black bg-white" />
          </div>
          
          {/* Weather Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-2 border-black p-4 space-y-2">
                <div className="h-4 w-20 bg-gray-400" />
                <div className="h-8 w-16 bg-black" />
              </div>
            ))}
          </div>
          
          {/* Crops Table */}
          <div className="border-2 border-black">
            <div className="h-6 w-32 bg-black m-4 mb-0" />
            <div className="border-t-2 border-black">
              {/* Table Header */}
              <div className="flex border-b-2 border-black bg-gray-300">
                <div className="flex-1 p-3 border-r-2 border-black">
                  <div className="h-4 w-16 bg-black" />
                </div>
                <div className="flex-1 p-3 border-r-2 border-black">
                  <div className="h-4 w-20 bg-black" />
                </div>
                <div className="flex-1 p-3 border-r-2 border-black">
                  <div className="h-4 w-16 bg-black" />
                </div>
                <div className="w-32 p-3">
                  <div className="h-4 w-20 bg-black" />
                </div>
              </div>
              {/* Table Rows */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex border-b border-black">
                  <div className="flex-1 p-3 border-r border-black">
                    <div className="h-4 w-20 bg-gray-400" />
                  </div>
                  <div className="flex-1 p-3 border-r border-black">
                    <div className="h-4 w-16 bg-gray-400" />
                  </div>
                  <div className="flex-1 p-3 border-r border-black">
                    <div className="h-4 w-24 bg-gray-400" />
                  </div>
                  <div className="w-32 p-3">
                    <div className="h-4 w-16 bg-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Add Farm Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">4. Add Farm Form</h2>
        <div className="border-2 border-black bg-white p-6">
          <div className="max-w-2xl space-y-6">
            <div className="h-8 w-40 bg-black" />
            
            {/* Form Fields */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-400" />
                <div className="h-10 border-2 border-black bg-white" />
              </div>
            ))}
            
            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="h-10 w-32 border-2 border-black bg-black" />
              <div className="h-10 w-32 border-2 border-black bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Add Crop Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">5. Add Crop Form</h2>
        <div className="border-2 border-black bg-white p-6">
          <div className="max-w-2xl space-y-6">
            <div className="h-8 w-40 bg-black" />
            
            {/* Dropdown */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-400" />
              <div className="h-10 border-2 border-black bg-white flex items-center justify-between px-3">
                <div className="h-4 w-40 bg-gray-300" />
                <div className="w-4 h-4 bg-gray-400" />
              </div>
            </div>
            
            {/* Form Fields */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-400" />
                <div className="h-10 border-2 border-black bg-white" />
              </div>
            ))}
            
            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="h-10 w-32 border-2 border-black bg-black" />
              <div className="h-10 w-32 border-2 border-black bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. AI Recommendation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">6. AI Recommendation</h2>
        <div className="border-2 border-black bg-white p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-8 w-56 bg-black" />
              <div className="h-4 w-32 bg-gray-400" />
            </div>
            <div className="w-20 h-8 border-2 border-black bg-gray-300" />
          </div>
          
          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-2 border-black p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-black bg-gray-300" />
                  <div className="h-5 w-24 bg-black" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-300" />
                  <div className="h-3 w-full bg-gray-300" />
                  <div className="h-3 w-3/4 bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Weather Section */}
          <div className="border-2 border-black p-4 space-y-4">
            <div className="h-6 w-40 bg-black" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-400" />
                  <div className="h-6 w-16 bg-black" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <div className="h-10 flex-1 border-2 border-black bg-black" />
            <div className="h-10 w-40 border-2 border-black bg-white" />
          </div>
        </div>
      </div>

      {/* 7. Profile Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">7. Profile Settings</h2>
        <div className="border-2 border-black bg-white p-6">
          <div className="max-w-2xl space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b-2 border-black">
              <div className="w-24 h-24 rounded-full border-2 border-black bg-gray-300" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-black" />
                <div className="h-4 w-48 bg-gray-400" />
              </div>
            </div>
            
            {/* Form Fields */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-400" />
                <div className="h-10 border-2 border-black bg-white" />
              </div>
            ))}
            
            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t-2 border-black">
              <div className="h-10 w-40 border-2 border-black bg-black" />
              <div className="h-10 w-32 border-2 border-black bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 8. Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">8. Reports</h2>
        <div className="border-2 border-black bg-white p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-black" />
            <div className="h-10 w-40 border-2 border-black bg-white" />
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 pb-4 border-b-2 border-black">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-32 border-2 border-black bg-white" />
            ))}
          </div>
          
          {/* Table */}
          <div className="border-2 border-black">
            {/* Table Header */}
            <div className="flex border-b-2 border-black bg-gray-300">
              <div className="flex-1 p-3 border-r-2 border-black">
                <div className="h-4 w-16 bg-black" />
              </div>
              <div className="flex-1 p-3 border-r-2 border-black">
                <div className="h-4 w-20 bg-black" />
              </div>
              <div className="flex-1 p-3 border-r-2 border-black">
                <div className="h-4 w-16 bg-black" />
              </div>
              <div className="flex-1 p-3 border-r-2 border-black">
                <div className="h-4 w-24 bg-black" />
              </div>
              <div className="w-32 p-3">
                <div className="h-4 w-20 bg-black" />
              </div>
            </div>
            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex border-b border-black">
                <div className="flex-1 p-3 border-r border-black">
                  <div className="h-4 w-20 bg-gray-400" />
                </div>
                <div className="flex-1 p-3 border-r border-black">
                  <div className="h-4 w-24 bg-gray-400" />
                </div>
                <div className="flex-1 p-3 border-r border-black">
                  <div className="h-4 w-16 bg-gray-400" />
                </div>
                <div className="flex-1 p-3 border-r border-black">
                  <div className="h-6 w-16 bg-gray-300 border border-black" />
                </div>
                <div className="w-32 p-3">
                  <div className="h-4 w-12 bg-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
