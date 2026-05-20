/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Mail, Phone, Contact, Search, Filter, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FacultyContact } from '../types';

interface IndividualFaculty {
  id: string;
  name: string;
  role: 'Program Chair' | 'Program Co-Chair';
  department: string;
  email: string;
  phone: string;
}

export default function FacultyTab() {
  const contacts: FacultyContact[] = [
    {
      department: "B.Tech CSE Core - 1st Year (CSE)",
      chairName: "Dr. Indrajeet Gupta",
      chairEmail: "indrajeet.gupta@galgotiasuniversity.edu.in",
      chairPhone: "+91-79743-13624",
      coChairName: "Ms. Shweta Mayor Sabharwal",
      coChairEmail: "shweta.sabharwal@galgotiasuniversity.edu.in",
      coChairPhone: "+91-98972-88477"
    },
    {
      department: "B.Tech CSE Core - 2nd Year (CSE)",
      chairName: "Dr. Pooja Singh",
      chairEmail: "poojasingh@galgotiasuniversity.edu.in",
      chairPhone: "+91-87502-96662",
      coChairName: "Dr. Sumit Kumar Mishra",
      coChairEmail: "sumitmishra@galgotiasuniversity.edu.in",
      coChairPhone: "+91-98396-55327"
    },
    {
      department: "B.Tech CSE Core - 3rd Year (CSE)",
      chairName: "Dr. G. Sakthi",
      chairEmail: "g.sakthi@galgotiasuniversity.edu.in",
      chairPhone: "+91-94866-19152",
      coChairName: "Dr. Anil Sharma",
      coChairEmail: "anil.sharma@galgotiasuniversity.edu.in",
      coChairPhone: "+91-99993-48890"
    },
    {
      department: "B.Tech CSE Core - 4th Year (CSE)",
      chairName: "Dr. P. Sudhakar",
      chairEmail: "p.sudhakar@galgotiasuniversity.edu.in",
      chairPhone: "+91-99655-30858",
      coChairName: "Dr. Triveni Lal Pal",
      coChairEmail: "triveni.pal@galgotiasuniversity.edu.in",
      coChairPhone: "+91-98824-42237"
    },
    {
      department: "Dept of Artificial Intelligence & Machine Learning",
      chairName: "Dr. Gaurav Agrawal",
      chairEmail: "gaurav.agrawal@galgotiasuniversity.edu.in",
      chairPhone: "+91-98999-87137",
      coChairName: "Dr. K Susheel Kumar",
      coChairEmail: "k.kumar@galgotiasuniversity.edu.in",
      coChairPhone: "+91-88264-85667"
    },
    {
      department: "Dept of Artificial Intelligence & Data Science",
      chairName: "Dr. Vipin Rai",
      chairEmail: "vipin.rai@galgotiasuniversity.edu.in",
      chairPhone: "+91-82993-56673",
      coChairName: "Dr. Shachi Mall",
      coChairEmail: "shachi.mall@galgotiasuniversity.edu.in",
      coChairPhone: "+91-99846-01301"
    },
    {
      department: "Department of Cyber Security",
      chairName: "Dr. Azath Muhamed Husain",
      chairEmail: "azath.hussain@galgotiasuniversity.edu.in",
      chairPhone: "+91-95665-93123",
      coChairName: "Mr. Sunil Kumar Chowdhary",
      coChairEmail: "sunil.chowdhary@galgotiasuniversity.edu.in",
      coChairPhone: "+91-99686-99898"
    },
    {
      department: "CSE Tech (Cloud & FullStack)",
      chairName: "Dr. Bharat Bhushan Naib",
      chairEmail: "bharat.bhushan@galgotiasuniversity.edu.in",
      chairPhone: "+91-92122-49250",
      coChairName: "Dr. Kanika Thakur",
      coChairEmail: "kanika.thakur@galgotiasuniversity.edu.in",
      coChairPhone: "+91-62055-98500"
    }
  ];

  // Dynamic flattening to separate individuals
  const flatFacultyList = useMemo<IndividualFaculty[]>(() => {
    const list: IndividualFaculty[] = [];
    contacts.forEach((c, index) => {
      // Chair
      list.push({
        id: `fac_${index}_chair`,
        name: c.chairName,
        role: "Program Chair",
        department: c.department,
        email: c.chairEmail,
        phone: c.chairPhone
      });
      // Co-Chair
      list.push({
        id: `fac_${index}_cochair`,
        name: c.coChairName,
        role: "Program Co-Chair",
        department: c.department,
        email: c.coChairEmail,
        phone: c.coChairPhone
      });
    });
    return list;
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Program Chair' | 'Program Co-Chair'>('All');
  const [deptGroupFilter, setDeptGroupFilter] = useState<string>('All');

  // Compute category/department groups for filtering
  const deptGroups = useMemo(() => {
    const groups = new Set<string>();
    flatFacultyList.forEach(f => {
      if (f.department.includes('1st Year')) groups.add('1st Year');
      else if (f.department.includes('2nd Year')) groups.add('2nd Year');
      else if (f.department.includes('3rd Year')) groups.add('3rd Year');
      else if (f.department.includes('4th Year')) groups.add('4th Year');
      else if (f.department.includes('Artificial Intelligence')) groups.add('AI / Data-Science');
      else if (f.department.includes('Cyber Security')) groups.add('Cyber Security');
      else groups.add('Specializations');
    });
    return ['All', ...Array.from(groups)];
  }, [flatFacultyList]);

  // Handle building WhatsApp trigger
  const getWhatsAppUrl = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^\d]/g, '');
    const prefilledMessage = encodeURIComponent(
      `Hello ${name},\n\nI am contacting you from the CampusLens platform regarding student academic status and intervention triggers.`
    );
    return `https://wa.me/${cleanNumber}?text=${prefilledMessage}`;
  };

  // Filter List based on Search Query, Role, and Dept group
  const filteredFaculty = useMemo(() => {
    return flatFacultyList.filter(f => {
      // 1. Search Query Match
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery);

      // 2. Role match
      const matchesRole = roleFilter === 'All' || f.role === roleFilter;

      // 3. Dept Group Match
      let matchesDept = true;
      if (deptGroupFilter !== 'All') {
        if (deptGroupFilter === '1st Year') matchesDept = f.department.includes('1st Year');
        else if (deptGroupFilter === '2nd Year') matchesDept = f.department.includes('2nd Year');
        else if (deptGroupFilter === '3rd Year') matchesDept = f.department.includes('3rd Year');
        else if (deptGroupFilter === '4th Year') matchesDept = f.department.includes('4th Year');
        else if (deptGroupFilter === 'AI / Data-Science') matchesDept = f.department.includes('Artificial Intelligence');
        else if (deptGroupFilter === 'Cyber Security') matchesDept = f.department.includes('Cyber Security');
        else matchesDept = !f.department.includes('Year') && !f.department.includes('Artificial Intelligence') && !f.department.includes('Cyber Security');
      }

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [searchQuery, roleFilter, deptGroupFilter, flatFacultyList]);

  // Determine a deterministic premium styling card border and badge setup for each faculty member
  const getAvatarColors = (name: string, role: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorSchemes = [
      { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', ring: 'ring-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-100/50' },
      { bg: 'bg-violet-50 border-violet-100 text-violet-700', ring: 'ring-violet-100', text: 'text-violet-600', iconBg: 'bg-violet-100/50' },
      { bg: 'bg-sky-50 border-sky-100 text-sky-700', ring: 'ring-sky-100', text: 'text-sky-600', iconBg: 'bg-sky-100/50' },
      { bg: 'bg-teal-50 border-teal-100 text-teal-700', ring: 'ring-teal-100', text: 'text-teal-600', iconBg: 'bg-teal-100/50' },
      { bg: 'bg-rose-50 border-rose-100 text-rose-700', ring: 'ring-rose-100', text: 'text-rose-600', iconBg: 'bg-rose-100/50' },
      { bg: 'bg-amber-50 border-amber-100 text-amber-700', ring: 'ring-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-100/50' }
    ];
    return colorSchemes[hash % colorSchemes.length];
  };

  const getInitials = (name: string) => {
    const cleaned = name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '');
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'FC';
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setRoleFilter('All');
    setDeptGroupFilter('All');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 105, damping: 15 }
    }
  };

  // Phone ringing icon motion animation helper
  const phoneIconVariants = {
    ring: {
      rotate: [0, -12, 12, -12, 12, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Descriptive Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight flex items-center space-x-2" id="faculty-heading">
            <Contact className="h-6 w-6 text-indigo-600 mr-1" />
            <span>Executive Faculty Contacts</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Escalate actions or request classroom intervention support from designated program chairs & co-chairs
          </p>
        </div>

        {/* Counter Widget */}
        <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-xs shrink-0 self-start md:self-auto">
          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
            {filteredFaculty.length}
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">Officers Listed</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">Faculty Members</p>
          </div>
        </div>
      </div>

      {/* Integration Control Panel: Search & Filters */}
      <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search box with dynamic scale microinteraction */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty name, specialization email, or phone code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-sm focus:outline-none transition bg-gray-50/20"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Role filter toggles */}
          <div className="flex flex-wrap gap-1.5 items-center bg-gray-50 p-1.5 rounded-2xl">
            {(['All', 'Program Chair', 'Program Co-Chair'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  roleFilter === role 
                    ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            ))}
          </div>

          {/* Department Group Pill Filter */}
          <div className="relative select-none flex items-center space-x-1 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
            <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={deptGroupFilter}
              onChange={(e) => setDeptGroupFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-gray-600 hover:text-indigo-600 focus:outline-none cursor-pointer pr-6 py-1 select-custom"
            >
              {deptGroups.map(grp => (
                <option key={grp} value={grp}>
                  Group: {grp}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filter Shortcut */}
          {(searchQuery || roleFilter !== 'All' || deptGroupFilter !== 'All') && (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer self-start lg:self-center"
            >
              <RefreshCw className="h-3 w-3 animate-spin duration-1000" />
              <span>Reset Filters</span>
            </motion.button>
          )}

        </div>
      </div>

      {/* Grid of Individual Faculty Cards */}
      <AnimatePresence mode="popLayout">
        {filteredFaculty.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            id="faculty-grid"
          >
            {filteredFaculty.map((fac) => {
              const pal = getAvatarColors(fac.name, fac.role);
              const initials = getInitials(fac.name);

              return (
                <motion.div
                  layoutId={fac.id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)'
                  }}
                  key={fac.id}
                  className="bg-white border border-gray-100 rounded-[28px] overflow-hidden flex flex-col justify-between transition-colors hover:border-indigo-100 group shadow-xs relative"
                >
                  {/* Highlight card banner based on role */}
                  <div className={`absolute top-0 left-0 w-full h-[6px] ${fac.role === "Program Chair" ? 'bg-indigo-500' : 'bg-pink-500'}`} />

                  {/* Top: Avatar, Role, Department Info */}
                  <div className="p-6 pb-4 flex flex-col items-center text-center space-y-4">
                    
                    {/* Interactive Animated Avatar Frame */}
                    <div className="relative">
                      {/* Interactive hover glowing active rings */}
                      <div className={`absolute inset-0 rounded-full bg-indigo-50 border border-dashed border-indigo-200 animate-spin group-hover:scale-110 opacity-0 group-hover:opacity-100 transition duration-700 ease-out`} style={{ animationDuration: '10s' }} />
                      
                      <div className={`h-16 w-16 rounded-full border flex items-center justify-center font-black relative ${pal.bg} ${pal.ring} tracking-tighter text-lg shadow-inner group-hover:scale-105 duration-300 transition-transform`}>
                        <span>{initials}</span>
                        {/* Tiny active support badge */}
                        <span className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 w-full">
                      {/* Name with subtle expansion/bold accent */}
                      <h3 className="font-extrabold text-sm text-gray-950 block tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                        {fac.name}
                      </h3>

                      {/* Role Pill */}
                      <span className={`inline-block text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider select-none ${
                        fac.role === "Program Chair" 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-violet-50 text-violet-700 border border-violet-100'
                      }`}>
                        {fac.role}
                      </span>

                      {/* Small Module/Department Label */}
                      <div className="pt-2 text-[11px] text-gray-500 font-medium px-2 leading-relaxed bg-gray-50 rounded-xl py-1.5 h-16 flex items-center justify-center">
                        <span className="line-clamp-2">{fac.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Contacts Section */}
                  <div className="px-6 py-3 border-t border-b border-gray-50 bg-gray-50/20 space-y-2 text-xs">
                    
                    {/* Mail Link with Hover Action */}
                    <a 
                      href={`mailto:${fac.email}`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition duration-150 truncate font-medium group/mail py-1"
                      title={`Email ${fac.name}`}
                    >
                      <span className={`p-1 rounded-md transition duration-200 ${pal.iconBg} text-gray-500 group-hover/mail:text-indigo-600 shrink-0`}>
                        <Mail className="h-3 w-3 shrink-0" />
                      </span>
                      <span className="truncate text-[11px] font-bold">{fac.email}</span>
                    </a>

                    {/* Phone Number with hover ring logic */}
                    <a 
                      href={`tel:${fac.phone.replace(/[^\d+]/g, '')}`} 
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition duration-150 font-medium group/phone py-0.5"
                      title={`Call ${fac.name}`}
                    >
                      <span className={`p-1 rounded-md transition duration-200 ${pal.iconBg} text-gray-500 group-hover/phone:text-indigo-600 shrink-0`}>
                        <Phone className="h-3 w-3 shrink-0" />
                      </span>
                      <span className="text-[11px] font-bold tracking-tight text-gray-600">{fac.phone}</span>
                    </a>

                  </div>

                  {/* Bottom Messaging Actions (WhatsApp Call to Action) */}
                  <div className="p-4 bg-gray-50/55 rounded-b-[28px] flex justify-center items-center">
                    <motion.a 
                      href={getWhatsAppUrl(fac.phone, fac.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full text-center text-[11px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/80 px-4 py-2 rounded-2xl transition duration-200 inline-flex items-center justify-center space-x-2 shadow-xs group-hover:border-emerald-200 cursor-pointer"
                      title="Initiate Secure Chat"
                    >
                      {/* WhatsApp Mini SVG with pulsing green microinteraction on hover */}
                      <motion.img 
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                        alt="WhatsApp Logo" 
                        whileHover={{ scale: 1.2, rotate: 12 }}
                        className="h-4 w-4 shrink-0 transition"
                        referrerPolicy="no-referrer"
                      />
                      <span>Reach via WhatsApp</span>
                    </motion.a>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Empty Search Fallback */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-dashed border-gray-200 py-20 px-4 rounded-3xl text-center max-w-xl mx-auto flex flex-col items-center justify-center"
          >
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
              <Sparkles className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="font-extrabold text-gray-900 tracking-tight">No Faculty Matches</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              We couldn't find any program chairs or co-chairs matching your active filtering constraints.
            </p>
            <button 
              onClick={resetFilters} 
              className="mt-5 px-4 h-9 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>Reset Selected Filters</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
