export const getUserName = (): string | null => {
  return localStorage.getItem('userName');
};

export const setUserName = (name: string): void => {
  localStorage.setItem('userName', name);
};

export const promptForName = (): string => {
  const name = prompt('Please enter your name to continue:');
  if (name && name.trim()) {
    setUserName(name.trim());
    return name.trim();
  }
  return promptForName(); // Recursive until valid name
};

export const ensureUserName = (): string => {
  const existing = getUserName();
  if (existing) return existing;
  return promptForName();
};
