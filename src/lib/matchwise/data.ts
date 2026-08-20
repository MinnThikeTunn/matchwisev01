import mayPhoto from "@/assets/may.jpg";
import minPhoto from "@/assets/min.jpg";
import kyawPhoto from "@/assets/kyaw.jpg";
import thuraPhoto from "@/assets/thura.jpg";
import aungPhoto from "@/assets/aung.jpg";
import zawPhoto from "@/assets/zaw.jpg";

export type Intent = "long_term" | "open_to_serious" | "new_friends_first" | "unsure";

export type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  photo: string;
  bio: string;
  intent: Intent;
  /** how quickly the person wants things to move, 0 = slow, 1 = fast */
  pace: number;
  values: string[];
  interests: string[];
  communication: {
    /** 0 = occasional, 1 = constant */
    frequency: number;
    /** 0 = short check-ins, 1 = long thoughtful messages */
    depth: number;
    channel: "text" | "voice" | "in_person";
  };
  availability: string[];
  /** 0 = fully spontaneous, 1 = plans everything */
  planning: number;
  /** 0 = quiet nights, 1 = big social energy */
  socialEnergy: number;
  /** 0 = familiar routines, 1 = always something new */
  novelty: number;
  prompt: { question: string; answer: string };
  verifiedDemo: boolean;
};

export const INTENT_LABEL: Record<Intent, string> = {
  long_term: "Looking for a long-term relationship",
  open_to_serious: "Open to something serious",
  new_friends_first: "Wants to start as friends",
  unsure: "Still figuring it out",
};

export const demoUser: Profile = {
  id: "may",
  name: "May",
  age: 22,
  city: "Yangon",
  occupation: "Interaction design student",
  photo: mayPhoto,
  bio: "Design student who sketches in cafés, keeps a film camera in her bag, and takes her time with people.",
  intent: "long_term",
  pace: 0.25,
  values: ["kindness", "curiosity", "growth", "honesty"],
  interests: ["product design", "photography", "cafés", "live music", "reading"],
  communication: { frequency: 0.4, depth: 0.85, channel: "text" },
  availability: ["weekday evenings", "saturday", "sunday"],
  planning: 0.8,
  socialEnergy: 0.45,
  novelty: 0.55,
  prompt: {
    question: "A small thing I care about…",
    answer: "Replying properly instead of quickly. I would rather send one real message a day.",
  },
  verifiedDemo: true,
};

export const candidates: Profile[] = [
  {
    id: "min",
    name: "Min",
    age: 23,
    city: "Yangon",
    occupation: "Software engineering student",
    photo: minPhoto,
    bio: "Builds small tools nobody asked for, shoots street photos on weekends, and is happiest in a quiet café with a hard problem.",
    intent: "long_term",
    pace: 0.3,
    values: ["kindness", "curiosity", "growth", "patience"],
    interests: ["product design", "photography", "cafés", "open source", "live music"],
    communication: { frequency: 0.45, depth: 0.8, channel: "text" },
    availability: ["weekday evenings", "saturday", "sunday"],
    planning: 0.35,
    socialEnergy: 0.4,
    novelty: 0.6,
    prompt: {
      question: "A small thing I care about…",
      answer: "Learning the name of the person who makes my coffee.",
    },
    verifiedDemo: true,
  },
  {
    id: "kyaw",
    name: "Kyaw",
    age: 24,
    city: "Yangon",
    occupation: "Architecture graduate",
    photo: kyawPhoto,
    bio: "Draws buildings for work and rooftops for fun. Slow talker, long walker, terrible at ending phone calls.",
    intent: "open_to_serious",
    pace: 0.45,
    values: ["curiosity", "honesty", "craft"],
    interests: ["architecture", "photography", "cycling", "cafés"],
    communication: { frequency: 0.35, depth: 0.7, channel: "in_person" },
    availability: ["weekday evenings", "sunday"],
    planning: 0.6,
    socialEnergy: 0.5,
    novelty: 0.5,
    prompt: {
      question: "A small thing I care about…",
      answer: "Finding the one bench in the city with the best late light.",
    },
    verifiedDemo: true,
  },
  {
    id: "thura",
    name: "Thura",
    age: 25,
    city: "Yangon",
    occupation: "Guitar teacher",
    photo: thuraPhoto,
    bio: "Teaches jazz standards to teenagers on weekdays, plays small rooms on weekends. Loud music, quiet life.",
    intent: "open_to_serious",
    pace: 0.55,
    values: ["kindness", "creativity", "loyalty"],
    interests: ["live music", "cooking", "cafés", "film"],
    communication: { frequency: 0.75, depth: 0.5, channel: "voice" },
    availability: ["weekday afternoons", "friday", "saturday"],
    planning: 0.3,
    socialEnergy: 0.8,
    novelty: 0.7,
    prompt: {
      question: "A small thing I care about…",
      answer: "Cooking for people instead of explaining how I feel.",
    },
    verifiedDemo: true,
  },
  {
    id: "aung",
    name: "Aung",
    age: 26,
    city: "Yangon",
    occupation: "Community librarian",
    photo: aungPhoto,
    bio: "Runs a small reading room, keeps a list of every book he has lent out, and reads three at a time.",
    intent: "long_term",
    pace: 0.2,
    values: ["kindness", "patience", "growth", "community"],
    interests: ["reading", "cafés", "history", "board games"],
    communication: { frequency: 0.3, depth: 0.9, channel: "text" },
    availability: ["weekday evenings", "saturday"],
    planning: 0.75,
    socialEnergy: 0.3,
    novelty: 0.3,
    prompt: {
      question: "A small thing I care about…",
      answer: "Keeping the reading room open an extra hour when someone is still studying.",
    },
    verifiedDemo: true,
  },
  {
    id: "zaw",
    name: "Zaw",
    age: 24,
    city: "Yangon",
    occupation: "Physiotherapy student",
    photo: zawPhoto,
    bio: "Runs at 5am, studies until late, and will absolutely make you try the trail by the reservoir once.",
    intent: "new_friends_first",
    pace: 0.6,
    values: ["discipline", "honesty", "growth"],
    interests: ["running", "cooking", "football", "photography"],
    communication: { frequency: 0.8, depth: 0.35, channel: "voice" },
    availability: ["early mornings", "sunday"],
    planning: 0.55,
    socialEnergy: 0.75,
    novelty: 0.65,
    prompt: {
      question: "A small thing I care about…",
      answer: "Actually showing up when I said I would, even at 5am.",
    },
    verifiedDemo: true,
  },
];

export const profilesById: Record<string, Profile> = Object.fromEntries(
  [demoUser, ...candidates].map((p) => [p.id, p]),
);

export const conversationStarters = [
  "What's the best photo you've taken recently?",
  "What would your ideal quiet weekend look like?",
  "What project are you most excited about?",
];

export const reportReasons = [
  "Fake or misleading profile",
  "Harassment or offensive messages",
  "Asking for money",
  "Someone under 18",
  "Something else",
];
