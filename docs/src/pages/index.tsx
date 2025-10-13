import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Home(): ReactNode {
  return (
    <Layout title="Side My Tools" description="Side My Tools documentation mockup">
      <main className="container margin-vert--xl">
        <Heading as="h1">Side My Tools</Heading>
        <p>Welcome to the pared-down documentation site. Use the Docs tab to open the single Home page.</p>
      </main>
    </Layout>
  );
}
