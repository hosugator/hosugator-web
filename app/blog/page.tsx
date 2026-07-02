import { getGraphData } from '@/lib/getNodes';
import Knowledges from '@/components/sections/Knowledges';

export default function BlogPage() {
  return (
    <div className="relative w-full md:max-w-4xl md:mx-auto px-5 md:px-8 pb-20">
      <Knowledges initialData={getGraphData()} />
    </div>
  );
}
