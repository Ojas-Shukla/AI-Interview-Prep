import React from "react";
import { useNavigate } from "react-router-dom";

import HERO_IMG from "../assets/hero-img.jpg";
import { APP_FEATURES } from "../utils/data";
import { useUser } from "../context/userContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#FFFCEF] text-slate-900">
      <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-amber-200/30 blur-[80px]" />
      <div className="absolute right-0 top-20 h-[350px] w-[350px] rounded-full bg-orange-200/40 blur-[90px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 text-lg font-bold text-white shadow-lg shadow-orange-200">
            AI
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">Interview Prep AI</p>
          </div>
        </div>

        <button
          onClick={() => navigate(user ? "/dashboard" : "/login")}
          className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
        >
          {user ? "Go to dashboard" : "Login / Sign Up"}
        </button>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-20">
        <section>
          <div className="mb-6 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            AI Powered
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Ace interviews with <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">AI-powered</span> learning.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Build interview confidence with role-based questions, answer expansion, concept explanations, and organized prep sessions tailored to your experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
              className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              {user ? "Continue prep" : "Get Started"}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
            >
              I already have an account
            </button>
          </div>
        </section>

        <section className="relative">
          <div className="overflow-hidden rounded-[32px] border border-orange-100 bg-white p-3 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <img
              src={HERO_IMG}
              alt="AI interview prep illustration"
              className="h-[520px] w-full rounded-[24px] object-cover"
            />
          </div>
        </section>
      </main>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why it works</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Everything you need to prepare better</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {APP_FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl text-orange-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;