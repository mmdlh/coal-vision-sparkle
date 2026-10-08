import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/safety')({
 head: () => pageHead('safety'),
 component: Page,
});
function Page() { return <PlatformPage page="safety"/>; }
