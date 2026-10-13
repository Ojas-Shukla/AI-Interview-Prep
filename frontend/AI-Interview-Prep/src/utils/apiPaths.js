export const API_PATHS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    profile: "/auth/profile",
    uploadImage: "/auth/upload-image",
  },
  sessions: {
    create: "/sessions/create",
    mySessions: "/sessions/my-sessions",
    byId: (id) => `/sessions/${id}`,
    delete: (id) => `/sessions/${id}`,
  },
  questions: {
    add: "/questions/add",
    pin: (id) => `/questions/${id}/pin`,
    note: (id) => `/questions/${id}/note`,
  },
  ai: {
    generateQuestions: "/ai/generate-questions",
    generateExplanation: "/ai/generate-explanation",
  },
};
