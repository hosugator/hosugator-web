import { getGraphData } from '@/lib/getNodes';
import Knowledges from '@/components/sections/Knowledges';

export default function BlogPage() {
  return (
    <Knowledges initialData={getGraphData()} />
  );
}
