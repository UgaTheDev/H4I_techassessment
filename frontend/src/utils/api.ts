const API_URL = import.meta.env.VITE_API_URL || '/api';

export const submitQuiz = async (
  questionId: string,
  userName: string,
  selectedAnswer: string,
  correctAnswer: string
) => {
  const response = await fetch(`${API_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId,
      userName,
      selectedAnswer,
      correctAnswer,
    }),
  });
  return response.json();
};

export const getQuizResults = async (questionId: string) => {
  const response = await fetch(`${API_URL}/quiz/results/${questionId}`);
  return response.json();
};

export const gradeAnswer = async (
  questionId: string,
  userName: string,
  question: string,
  answer: string,
  rubric: string,
  keyPoints: string[]
) => {
  const response = await fetch(`${API_URL}/grade-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId,
      userName,
      question,
      answer,
      rubric,
      keyPoints,
    }),
  });
  return response.json();
};

export const addComment = async (
  pageId: string,
  userName: string,
  comment: string
) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId,
      userName,
      comment,
    }),
  });
  return response.json();
};

export const getComments = async (pageId: string) => {
  const response = await fetch(`${API_URL}/comments/${pageId}`);
  return response.json();
};
