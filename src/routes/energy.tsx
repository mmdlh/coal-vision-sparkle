import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/energy')({
 head: () => pageHead('energy'),
 component: Page,
});
function Page() { return <PlatformPage page="energy"/>; }
