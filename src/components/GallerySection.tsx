import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";

const photos = [
  { src: photo1, title: "Golden Hour", desc: "Mountain sunset" },
  { src: photo2, title: "Morning Dew", desc: "Macro nature" },
  { src: photo3, title: "City Nights", desc: "Urban exploration" },
];

const GallerySection = () => (
  <section id="gallery" className="py-24">
    <div className="container mx-auto px-6">
      <div className="mb-16 text-center">
        <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
          // gallery
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Mobile Photography
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.title}
            className="group relative overflow-hidden rounded-xl border border-border"
          >
            <img
              src={photo.src}
              alt={photo.title}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {photo.title}
              </h3>
              <p className="text-sm text-muted-foreground">{photo.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
