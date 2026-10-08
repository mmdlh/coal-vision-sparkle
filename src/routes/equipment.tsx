import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage, pageHead } from '@/components/platform/platform';
export const Route = createFileRoute('/equipment')({
 head: () => pageHead('equipment'),
 component: Page,
});
function Page() { return <PlatformPage page="equipment"/>; }
