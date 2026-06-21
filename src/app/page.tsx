import Hero from "@/components/Hero";
import StoryScene from "@/components/StoryScene";
import { storyData } from "@/data/story";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex flex-col">
        {storyData.map((story) => (
          <StoryScene key={story.id} story={story} />
        ))}
      </div>
      
      {/* Footer / Outro Section */}
      <section className="h-[50vh] flex items-center justify-center bg-zinc-950 text-white relative z-10">
        <div className="text-center">
          <h3 className="text-2xl tracking-[0.3em] font-light uppercase mb-6">
            The End
          </h3>
          <p className="text-zinc-500 font-mono text-sm tracking-widest">
            Or just the beginning
          </p>
        </div>
      </section>
    </>
  );
}
