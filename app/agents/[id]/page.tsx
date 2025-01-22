// This will be your main page component (Server Component)
/** @jsx preserve */
import preserve from './ClientComponent'; // Corrected import statement
import ClientComponent from './ClientComponent';

// Removed the generateStaticParams function
// export function generateStaticParams() {
//   // Your static params generation logic
//   return [
//     { id: '1' },
//     { id: '2' },
//     // ... etc
//   ]
// }

export default function AgentPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div id={params.id} />
    </div>
  );
}