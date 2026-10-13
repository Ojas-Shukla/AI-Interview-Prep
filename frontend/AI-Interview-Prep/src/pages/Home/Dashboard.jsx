import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useUser } from "../../context/userContext";
import api from "../../utils/axioinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatDate, normalizeQuestionList } from "../../utils/helper";

const initialForm = {
  role: "Frontend Developer",
  experience: "2",
  topicsToFocus: "React, JavaScript, APIs",
  description: "Focus on component design, state management, and debugging patterns.",
  numberOfQuestions: 5,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [form, setForm] = useState(initialForm);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get(API_PATHS.sessions.mySessions);
        setSessions(Array.isArray(data) ? data : data.sessions || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(API_PATHS.ai.generateQuestions, {
        role: form.role,
        experience: form.experience,
        topicsToFocus: form.topicsToFocus,
        numberOfQuestions: Number(form.numberOfQuestions) || 5,
      });

      const questions = normalizeQuestionList(data);

      if (!questions.length) {
        toast.error("No questions were generated for this prompt.");
        return;
      }

      setGeneratedQuestions(questions);
      toast.success(`${questions.length} questions ready for your session.`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate interview questions right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!generatedQuestions.length) {
      toast.error("Generate questions before saving the session.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(API_PATHS.sessions.create, {
        role: form.role,
        experience: form.experience,
        topicsToFocus: form.topicsToFocus,
        description: form.description,
        questions: generatedQuestions,
      });

      const session = data.session || data;
      const sessionId = session?._id || session?.id;

      if (!sessionId) {
        throw new Error("Session could not be created.");
      }

      toast.success("Your interview session has been saved.");
      navigate(`/interview-prep/${sessionId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to create the session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCEF] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Welcome back, {user?.name || "there"}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-200 hover:text-orange-600"
            >
              Home
            </button>
            <button
              onClick={logout}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Create interview session</h2>
                <p className="mt-1 text-sm text-slate-600">Generate a tailored mock interview around your target role.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                <input name="role" value={form.role} onChange={handleChange} className="input-box" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Experience</span>
                <input name="experience" value={form.experience} onChange={handleChange} className="input-box" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Topics to focus on</span>
                <input name="topicsToFocus" value={form.topicsToFocus} onChange={handleChange} className="input-box" />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Session description</span>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-box" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Number of questions</span>
                <input name="numberOfQuestions" type="number" min="1" max="20" value={form.numberOfQuestions} onChange={handleChange} className="input-box" />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={handleGenerateQuestions} className="btn-small" disabled={loading}>
                {loading ? "Generating..." : "Generate Questions"}
              </button>
              <button onClick={handleCreateSession} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-200 hover:text-orange-600" disabled={loading}>
                Save Session
              </button>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Generated questions</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {generatedQuestions.slice(0, 5).map((question, index) => (
                    <li key={`${question.question}-${index}`} className="rounded-xl bg-white px-3 py-2">
                      {index + 1}. {question.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">My sessions</h2>
            </div>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  No sessions yet. Generate your first mock interview.
                </div>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session._id}
                    onClick={() => navigate(`/interview-prep/${session._id}`)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-slate-900">{session.role}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                        {normalizeQuestionList(session).length} Qs
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(session.createdAt)}</p>
                    <p className="mt-2 text-sm text-slate-600">{session.topicsToFocus}</p>
                  </button>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;