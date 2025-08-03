import { customAlphabet } from 'nanoid';

export const generateId = (): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 16);
  return nanoid();
};

export const generateSlug = (): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  const nanoid = customAlphabet(alphabet, 60);
  return nanoid();
};

export const generateVerificationCode = (): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 8);
  const code = nanoid();
  return `${code.slice(0, 3)}-${code.slice(3)}`;
};

export const generateToken = (): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 32);
  return nanoid();
};