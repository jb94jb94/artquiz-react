import { LikedImages } from "../components/LikedImages";

export default function LikedImagesPage() {
  console.log("Test")
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gelikete Bilder</h1>
      <LikedImages />
    </div>
  );
}