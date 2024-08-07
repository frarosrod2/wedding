export const revalidate = 0;

import { Header } from "./components/Header";

export default async function Home() {

  return (
    <main className="h-full">
      <Header />
    </main>
  );
}
