export interface StoryScene {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  video?: string;
  audio?: string;
  alignment: "left" | "right" | "center";
}

export const storyData: StoryScene[] = [
  {
    id: 1,
    title: "The Meeting",
    subtitle: "Every story begins with a single look",
    description:
      "On a busy school day, our eyes met for only a second.",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 2,
    title: "The Smile",
    subtitle: "A smile that said more than words",
    description:
      "Neither spoke, but the warmth on her face revealed everything her heart wanted to hide.",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 3,
    title: "The Wait",
    subtitle: "Counting days until Fridays",
    description:
      "Every weekend became a promise that perhaps they would meet again...",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 4,
    title: "A Sign",
    subtitle: "Fate leaves clues for those who notice",
    description:
      "A glance across the street, and suddenly coincidence felt impossible.",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 5,
    title: "Your Hand",
    subtitle: "The smallest gesture carried the greatest meaning",
    description:
      "First handshake, our hands met for the first time, dissolving every lingering doubt.",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 6,
    title: "The Chats",
    subtitle: "Every message carried an unspoken emotion.",
    description:
      "The shared laughter, and thoughtful pauses slowly turned simple texts into a bond...",
    image: "/images/banner.jpg",
    alignment: "left",
  },


  {
    id: 7,
    title: "The Calls",
    subtitle: "Voices that bridged every distance",
    description:
      "The conversations turned ordinary moments into unforgettable memories.",
    image: "/images/banner.jpg",
    alignment: "left",
  },


  {
    id: 8,
    title: "Rain",
    subtitle: "Some memories arrive with the clouds",
    description:
      "Me in a raincoat with my cycle, you under an umbrella...",
    image: "/images/banner.jpg",
    alignment: "left",
  },



  {
    id: 9,
    title: "First Video Call",
    subtitle: "Seeing each other beyond the screen",
    description: "For the first time, smiles replaced messages and silence felt closer than ever.",
    image: "/images/banner.jpg",
    alignment: "left",
  },




  {
    id: 10,
    title: "Support",
    subtitle: "Standing by each other through every situation",
    description:
      "No matter how difficult the days became, we were always there for one another.",
    image: "/images/banner.jpg",
    alignment: "center",
  },



  {
    id: 11,
    title: "The Promise",
    subtitle: "Tomorrow begins today",
    description:
      "We promised nothing extraordinary—only to keep choosing each other every single day.",
    image: "/images/banner.jpg",
    alignment: "left",
  },

  {
    id: 12,
    title: "Forever",
    subtitle: "And the story quietly continues",
    description:
      "Some endings are simply the beginning of another chapter waiting to be written.",
    image: "/images/banner.jpg",
    alignment: "center",
  },
];

