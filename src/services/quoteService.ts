
import { Quote } from '../types';

export const fetchRandomQuote = async (): Promise<Quote> => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Fallback quote
    return {
      content: "The time to repair the roof is when the sun is shining.",
      author: "John F. Kennedy"
    };
  }
};
