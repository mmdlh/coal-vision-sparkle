import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/quality')({
 head: () => pageHead('quality'),
 component: Page,
});
function Page() { return <PlatformPage page="quality"/>; }
