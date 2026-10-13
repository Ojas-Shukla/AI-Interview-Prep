export const formatDate = (dateString) => {
  if (!dateString) return "Recently";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const normalizeQuestionList = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.questions)) return data.questions;
  if (Array.isArray(data.session?.questions)) return data.session.questions;

  return [];
};
