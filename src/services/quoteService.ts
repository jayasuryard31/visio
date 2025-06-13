
import { Quote } from '../types';

// Fallback quotes pool for when APIs fail
const fallbackQuotes: Quote[] = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    content: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    content: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    content: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown"
  },
  {
    content: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    content: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    content: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  },
  {
    content: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    content: "Dream bigger. Do bigger.",
    author: "Unknown"
  },
  {
    content: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown"
  },
  {
    content: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    content: "Do something today that your future self will thank you for.",
    author: "Unknown"
  },
  {
    content: "Little things make big days.",
    author: "Unknown"
  },
  {
    content: "It's going to be hard, but hard does not mean impossible.",
    author: "Unknown"
  },
  {
    content: "Don't wait for opportunity. Create it.",
    author: "Unknown"
  },
  {
    content: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    content: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon"
  },
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    content: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    content: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  }
];

// Function to get a random quote from fallback pool
const getRandomFallbackQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
};

// Function to fetch from Quotable API
const fetchFromQuotable = async (): Promise<Quote> => {
  const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=200');
  if (!response.ok) {
    throw new Error('Quotable API failed');
  }
  const data = await response.json();
  return {
    content: data.content,
    author: data.author
  };
};

// Function to fetch from QuoteGarden API
const fetchFromQuoteGarden = async (): Promise<Quote> => {
  const response = await fetch('https://quote-garden.herokuapp.com/api/v3/quotes/random');
  if (!response.ok) {
    throw new Error('QuoteGarden API failed');
  }
  const data = await response.json();
  return {
    content: data.data.quoteText.replace(/[""]/g, ''),
    author: data.data.quoteAuthor
  };
};

// Function to fetch from API Ninjas
const fetchFromApiNinjas = async (): Promise<Quote> => {
  const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
    headers: {
      'X-Api-Key': 'demo' // Using demo key for free tier
    }
  });
  if (!response.ok) {
    throw new Error('API Ninjas failed');
  }
  const data = await response.json();
  if (data && data.length > 0) {
    return {
      content: data[0].quote,
      author: data[0].author
    };
  }
  throw new Error('No quote data from API Ninjas');
};

// Function to fetch from Zen Quotes (Alternative endpoint)
const fetchFromZenQuotes = async (): Promise<Quote> => {
  const response = await fetch('https://zenquotes.io/api/random');
  if (!response.ok) {
    throw new Error('ZenQuotes API failed');
  }
  const data = await response.json();
  return {
    content: data[0].q.replace(/[""]/g, ''),
    author: data[0].a
  };
};

// Function to fetch from Quotable with different categories
const fetchInspirationalQuote = async (): Promise<Quote> => {
  const tags = ['motivational', 'inspirational', 'success', 'wisdom', 'life'];
  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  
  const response = await fetch(`https://api.quotable.io/random?tags=${randomTag}&minLength=30&maxLength=180`);
  if (!response.ok) {
    throw new Error('Inspirational quote fetch failed');
  }
  const data = await response.json();
  return {
    content: data.content,
    author: data.author
  };
};

// Function to fetch from DummyJSON (Free and reliable)
const fetchFromDummyJSON = async (): Promise<Quote> => {
  const response = await fetch('https://dummyjson.com/quotes/random');
  if (!response.ok) {
    throw new Error('DummyJSON API failed');
  }
  const data = await response.json();
  return {
    content: data.quote,
    author: data.author
  };
};

export const fetchRandomQuote = async (): Promise<Quote> => {
  console.log('Fetching random quote...');
  
  // Array of different quote fetching strategies (prioritized by reliability)
  const quoteFetchers = [
    fetchFromDummyJSON,        // Most reliable
    fetchFromQuotable,         // Primary choice
    fetchFromQuoteGarden,      // Good backup
    fetchInspirationalQuote,   // Quotable with categories
    fetchFromZenQuotes,        // Alternative source
    fetchFromApiNinjas         // Additional source
  ];
  
  // Randomize the order of API calls to get variety
  const shuffledFetchers = quoteFetchers.sort(() => Math.random() - 0.5);
  
  // Try each API in random order
  for (const fetcher of shuffledFetchers) {
    try {
      console.log(`Trying quote fetcher: ${fetcher.name}`);
      const quote = await fetcher();
      console.log('Successfully fetched quote:', quote);
      
      // Validate the quote has content and author
      if (quote.content && quote.author) {
        return quote;
      } else {
        console.warn(`Invalid quote data from ${fetcher.name}:`, quote);
        continue;
      }
    } catch (error) {
      console.warn(`Quote fetcher ${fetcher.name} failed:`, error);
      continue;
    }
  }
  
  // If all APIs fail, return a random fallback quote
  console.log('All quote APIs failed, using fallback quote');
  const fallbackQuote = getRandomFallbackQuote();
  console.log('Using fallback quote:', fallbackQuote);
  return fallbackQuote;
};
