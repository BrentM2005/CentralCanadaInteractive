import { type Question } from '../types';

export const QUIZ_QUESTIONS: Question[] = [
  { type: 'multiple-choice', question: "Lake Michigan is a part of Central Canada?", options: ["True", "False"], answer: "False" },
  { type: 'multiple-choice', question: "Which Central Canadian city is the capital of Canada?", options: ["Montreal", "Toronto", "Ottawa", "Quebec City"], answer: "Ottawa" },
  { type: 'multiple-choice', question: "What language is spoken in Quebec?", options: ["French", "English", "Spanish", "Portuguese"], answer: "French" },
  { type: 'multiple-choice', question: "The Canadian Niagara Falls boat tour is called?", options: ["Niagara Falls Tour", "Maid of the Mist", "Titanic", "Voyage to the Falls"], answer: "Voyage to the Falls" },
  { type: 'multiple-choice', question: "The Canadian falls in Niagara is called?", options: ["Mark Carney Falls", "Horseshoe Falls", "Fallsview", "Bridal Veil Falls"], answer: "Horseshoe Falls" },
  { type: 'multiple-choice', question: "Which famous festival is held in Montreal?", options: ["Winterlude", "International Jazz Festival", "Carnaval de Quebec", "Burning Man"], answer: "Montreal International Jazz Festival and Just for Laughs" },
  { type: 'multiple-choice', question: "What can visitors find at Parliament Hill in Ottawa?", options: ["Canada's government buildings", "A shopping mall", "An amusement park"], answer: "Canada's government buildings" },
  { type: 'multiple-choice', question: "Algonquin Provincial Park is one of the most famous parks in which province?", options: ["Quebec", "Manitoba", "Ontario", "New Brunswick"], answer: "Ontario" },
  { type: 'multiple-choice', question: "Which of the following animals can be found in the forests of Algonquin Provincial Park?", options: ["Polar bears", "Moose", "Bison", "Grizzly bears"], answer: "Moose" },
  { type: 'written', question: "If you can visit anywhere in Central Canada right now, where would you go? (optional)" }
];

export const POLL_QUESTIONS: Question[] = [
  { type: 'multiple-choice', question: "Parlez vous francais?", options: ["Yes", "No", "Somewhat", "What?"] },
  { type: 'multiple-choice', question: "Do you like the Leafs or the Habs more?", options: ["Leafs", "Habs", "Don't watch hockey", "I don't like either"] },
  { type: 'multiple-choice', question: "Have you ever been to Quebec?", options: ["Yes", "No", "No, but I want to"] },
  { type: 'multiple-choice', question: "What is your opinion on poutine?", options: ["I love it!", "It's alright", "I don't like it", "I've never had it"] },
  { type: 'multiple-choice', question: "Do you appreciate the nature side of Central Canada or the urban side more?", options: ["Nature", "Urban", "Both", "Neither"] }
];