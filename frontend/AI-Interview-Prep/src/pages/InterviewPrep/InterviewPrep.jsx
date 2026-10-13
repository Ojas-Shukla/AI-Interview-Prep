import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../utils/axioinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatDate, normalizeQuestionList } from "../../utils/helper";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [explanations, setExplanations] = useState({});

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await api.get(API_PATHS.sessions.byId(sessionId));
        const currentSession = data.session || data;
        setSession(currentSession);

        const questions = normalizeQuestionList(currentSession) || [];
        const initialNotes = {};

        questions.forEach((question) => {
          initialNotes[question._id] = question.note || "";
        });

        setNoteDrafts(initialNotes);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load this session.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const handleTogglePin = async (questionId) => {
    try {
      const { data } = await api.post(API_PATHS.questions.pin(questionId));
      const currentQuestion = data.question;

      setSession((prev) => ({
        ...prev,
        questions: (prev?.questions || []).map((question) =>
          question._id === currentQuestion._id ? { ...question, isPinned: currentQuestion.isPinned } : question
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update the pinned state.");
    }
  };

  const handleSaveNote = async (questionId) => {
    try {
      const note = noteDrafts[questionId] || "";
      await api.post(API_PATHS.questions.note(questionId), { note });
      toast.success("Note saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save note.");
    }
  };

  const handleGenerateExplanation = async (questionText, questionId) => {
    try {
      const { data } = await api.post(API_PATHS.ai.generateExplanation, { question: questionText });
      setExplanations((prev) => ({
        ...prev,
        [questionId]: data.explanation || data.answer || "No explanation returned.",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate explanation.");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading interview session...</div>;
  }

  const questions = normalizeQuestionList(session) || [];

  return (
    <div className="min-h-screen bg-[#FFFCEF] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Interview prep</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">{session?.role || "Interview Session"}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {session?.topicsToFocus} • {formatDate(session?.createdAt)}
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-200 hover:text-orange-600"
          >
            Back to dashboard
          </button>
        </header>

        <div className="space-y-5">
          {questions.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              This session has no questions yet.
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question._id || `${question.question}-${index}`} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question {index + 1}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">{question.question}</h3>
                  </div>

                  <button
                    onClick={() => handleTogglePin(question._id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${question.isPinned ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"}`}
                  >
                    {question.isPinned ? "Pinned" : "Pin"}
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Answer</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{question.answer || "No answer available."}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleGenerateExplanation(question.question, question._id)}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500"
                  >
                    Explain concept
                  </button>
                </div>

                {explanations[question._id] && (
                  <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-orange-700">Explanation</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{explanations[question._id]}</p>
                  </div>
                )}

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Your notes</label>
                  <textarea
                    rows={4}
                    value={noteDrafts[question._id] || ""}
                    onChange={(event) =>
                      setNoteDrafts((prev) => ({
                        ...prev,
                        [question._id]: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white"
                    placeholder="Write your thoughts, follow-up questions, or key takeaways..."
                  />
                  <div className="mt-3 flex justify-end">
                    <button onClick={() => handleSaveNote(question._id)} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
                      Save note
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;