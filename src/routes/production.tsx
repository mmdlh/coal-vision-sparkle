import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/production')({
 head: () => pageHead('production'),
 component: Page,
});
function Page() { return <PlatformPage page="production"/>; }
