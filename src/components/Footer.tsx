/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-white border-t border-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            &copy; {currentYear} CampusLens Academic Dashboard. All rights reserved.
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-semibold">
            Confidential Academic Database and student monitoring tracking mechanisms.
          </p>
        </div>

        {/* Footer Credit Tagline */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <p className="text-xs font-semibold text-gray-600">
            Powered By <span className="text-indigo-600 font-black">Ignizia Tech</span>
          </p>
          <div className="flex items-center space-x-3 text-[10px] uppercase font-black tracking-wider text-slate-400">
            <span className="flex items-center">
              <ShieldCheck className="h-3 w-3 mr-1 text-emerald-500" /> Compliance Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
