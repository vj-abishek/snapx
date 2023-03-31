/* eslint-disable @typescript-eslint/restrict-template-expressions */
export default function generateTitle(title: string | null = null) {
  const adjectives = [
    "happy",
    "funny",
    "silly",
    "lovely",
    "friendly",
    "playful",
  ];

  // date in this format: 8 March 2020
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const animals = ["pig", "cat", "dog", "rabbit", "hamster", "turtle"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  if (title) {
    return `${title} - ${date}`;
  }
  return `${adjective} ${animal} - ${date}`;
}
