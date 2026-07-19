import React, { useState } from 'react';
import { MessageCircle, Send, ShieldAlert, X, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HelpCenter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="help-center-root" className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="help-center-popup"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-2xl overflow-hidden shadow-blue-900/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                id="close-help-btn"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-white">
                <HeartHandshake className="text-white animate-pulse" size={18} />
                <h4 className="font-bold text-sm">Need Assistance?</h4>
              </div>
              <p className="text-blue-50 text-[10px] mt-1">Average response time: 2 mins • 24/7 Local Support</p>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Assalamu Alaikum! Facing issues with downloads, licenses, or payments? Connect with our Bangladeshi technical support immediately.
              </p>

              {/* Support Options */}
              <div className="flex flex-col gap-2">
                {/* Telegram */}
                <a
                  href="https://t.me/Shorif_331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 bg-sky-50/50 hover:bg-sky-50 rounded-xl border border-sky-100/50 hover:border-sky-200 transition-all group"
                  id="telegram-link"
                >
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                    <Send size={15} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Telegram Helpline</span>
                    <span className="text-[9px] text-slate-400">Chat: @Shorif_331</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801558118588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 bg-green-50/50 hover:bg-green-50 rounded-xl border border-green-100/50 hover:border-green-200 transition-all group"
                  id="whatsapp-link"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <MessageCircle size={15} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">WhatsApp Support</span>
                    <span className="text-[9px] text-slate-400">01558118588 (Hotline)</span>
                  </div>
                </a>

                {/* Email Ticket */}
                <a
                  href="mailto:info.shorif0000@gmail.com"
                  className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/50 transition-all group"
                  id="email-support-link"
                >
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                    <ShieldAlert size={15} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Email Support</span>
                    <span className="text-[9px] text-slate-400">info.shorif0000@gmail.com</span>
                  </div>
                </a>
              </div>

              {/* Status footer */}
              <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Bangladesh Helpdesk Online
                </div>
                <span>v1.4.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="toggle-help-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-colors cursor-pointer relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="msg-icon"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span>
        </span>
      </motion.button>
    </div>
  );
}
