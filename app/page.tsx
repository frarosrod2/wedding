export const revalidate = 0;

import { getAllImages } from "./actions/get-all-images";
import { Header } from "./components/Header";
import { Image } from "./interfaces/Image";

export default async function Home() {
  const images: Image[] = await getAllImages().catch((err) => {
    console.log(err);
    return [];
  });

  return (
    <main className="h-full">
      <Header images={images} />
    </main>
  );
}
