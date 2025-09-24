import { Card, CardContent } from "@/components/ui/card";

export default function CampaignGoalsSlide() {
  const goals = [
    "Help Families in Need",
    "Raise Awareness Through Stories",
    "Build Money Confidence",
    "Show the Power of Partnership",
    "Be Open and Accountable",
  ];

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Campaign Goals – “New Year, Savvier You”</h1>
      <ul className="list-disc text-lg space-y-4 text-gray-800">
        {goals.map((goal, index) => (
          <li key={index} className="leading-relaxed">{goal}</li>
        ))}
      </ul>
    </div>
  );
}

// --- Script for Presenter ---
// Our campaign has five simple but powerful goals:
// First, we want to help families in need by providing affordable food and more financial counselling support.
// Second, we aim to raise awareness through stories, showing the human side of the cost-of-living crisis.
// Third, we want to build money confidence by sharing simple, practical tips through videos and an e-book.
// Fourth, we will show the power of partnership by combining Costco’s bulk-buying model with the Salvation Army’s reach.
// And finally, we commit to being open and accountable, reporting results clearly so the community can see the real impact.