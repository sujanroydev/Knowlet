import Navigator from "@/components/library/Navigator";
import HomeExperience from "@/components/home/HomeExperience";
import AIAssistant from "@/components/knowva/AIAssistant";

export default function Home() {
  return (
    <div className="min-h-[calc(100dvh-7.5rem)]">
      <HomeExperience library={<Navigator variant="home" />} />
      <AIAssistant />
    </div>
  );
}
