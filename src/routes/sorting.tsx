import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/sorting')({
 head: () => pageHead('sorting'),
 component: Page,
});
function Page() { return <PlatformPage page="sorting"/>; }
