'use client';

import React from 'react';
import { Check, Gift, Sparkles, Award } from 'lucide-react';

interface StampCardProps {
  currentStamps: number;
  totalRequired: number;
  rewardTitle: string;
  cardsCompleted: number;
  onStaffStampClick?: () => void;
}

export default function StampCard({
  currentStamps,
  totalRequired,
  rewardTitle,
  cardsCompleted,
  onStaffStampClick,
}: StampCardProps) {
  const percentage = Math.min(Math.round((currentStamps / totalRequired) * 100), 100);

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xl border border-slate-100 relative overflow-hidden">
      {/* Decorative gradient header banner */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600" />

      {/* Card Header */}
      <div className="flex items-center justify-between mt-1 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Loyalty Pass</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Stamp Card</h2>
        </div>
        {cardsCompleted > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-extrabold text-amber-800 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{cardsCompleted} {cardsCompleted === 1 ? 'Card' : 'Cards'} Done</span>
          </div>
        )}
      </div>

      {/* Stamp Slots Grid */}
      <div className="grid grid-cols-3 gap-3 my-4">
        {Array.from({ length: totalRequired }).map((_, index) => {
          const slotNumber = index + 1;
          const isStamped = slotNumber <= currentStamps;
          const isFinal = slotNumber === totalRequired;

          return (
            <div
              key={index}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                isStamped
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/25 scale-[1.02] border border-amber-300'
                  : isFinal
                  ? 'border-2 border-dashed border-rose-400 bg-rose-50/60 text-rose-500'
                  : 'border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {isStamped ? (
                <div className="flex flex-col items-center justify-center animate-bounce-short">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-0.5">
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-100">
                    Stamp #{slotNumber}
                  </span>
                </div>
              ) : isFinal ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <Gift className="w-6 h-6 text-rose-500 mb-1 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-rose-700 leading-tight">
                    REWARD
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-300">{slotNumber}</span>
                  <span className="text-[9px] font-medium text-slate-400 uppercase">Stamp</span>
                </div>
              )}

              {/* Number tag top right */}
              <span className={`absolute top-1.5 right-2 text-[9px] font-bold ${isStamped ? 'text-amber-200' : 'text-slate-300'}`}>
                #{slotNumber}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 mb-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>{currentStamps} of {totalRequired} stamps</span>
          <span className="text-amber-600 font-bold">{totalRequired - currentStamps === 0 ? 'Reward Ready!' : `${totalRequired - currentStamps} more to unlock`}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Milestone Reward Box */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 mt-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Gift className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">6th Visit Reward</div>
          <div className="text-sm font-bold text-slate-900 truncate">{rewardTitle}</div>
        </div>
      </div>

      {/* Quick Staff Stamp Button */}
      {onStaffStampClick && (
        <button
          onClick={onStaffStampClick}
          className="w-full mt-3 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
        >
          <span>Staff Stamp Validation (Enter PIN)</span>
        </button>
      )}
    </div>
  );
}
