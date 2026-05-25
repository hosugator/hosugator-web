import { getGraphData } from '@/lib/getNodes';
import Knowledges from '@/components/sections/Knowledges';

export default function BlogPage() {
  return (
    <main className="md:ml-16 px-8 md:px-16">
      <Knowledges initialData={getGraphData()} />
    </main>
  );
}
