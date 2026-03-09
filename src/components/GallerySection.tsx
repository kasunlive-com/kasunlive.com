import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight, ImageIcon, FolderOpen, Instagram } from "lucide-react";

// Local fallback imports
import burjKhalifa from "@/assets/burj-khalifa.jpg";
import dalada from "@/assets/dalada.jpg";
import perahera from "@/assets/perahera.jpg";
import kuweniConcert from "@/assets/kuweni-concert.jpg";
import witheredFlower from "@/assets/withered-flower.jpg";
import fourUConcert from "@/assets/4u-concert.jpg";
import beach from "@/assets/beach.jpg";

type GalleryItem =
  | { type: "photo"; src: string; title: string; desc: string }
  | { type: "album"; title: string; desc: string; cover: string; photos: { src: string; title: string }[] };

const fallbackItems: GalleryItem[] = [
  { type: "photo", src: burjKhalifa, title: "Burj Khalifa", desc: "Dubai city lights" },
  { type: "photo", src: dalada, title: "Dalada Maligawa", desc: "Temple of the Tooth" },
  {
    type: "album",
    title: "Live Concerts",
    desc: "Music moments captured live",
    cover: kuweniConcert,
    photos: [
      { src: kuweniConcert, title: "Kuweni Live in Concert" },
      { src: fourUConcert, title: "4U Concert — After 10 Years" },
    ],
  },
  { type: "photo", src: witheredFlower, title: "Withered Flower", desc: "Nature in the pines" },
  { type: "photo", src: perahera, title: "Esala Perahera", desc: "Sacred festival procession" },
  { type: "photo", src: beach, title: "Beach Vibes", desc: "Tropical paradise" },
];

const INITIAL_DISPLAY = 3;

const GallerySection = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(fallbackItems);
  const [lightbox, setLightbox] = useState<{ photos: { src: string; title: string }[]; index: number } | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data: items } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order");

      if (!items || items.length === 0) return; // keep fallbacks

      // Fetch album photos
      const albumIds = items.filter((i: any) => i.type === "album").map((i: any) => i.id);
      let albumPhotosMap: Record<string, { src: string; title: string }[]> = {};

      if (albumIds.length > 0) {
        const { data: photos } = await supabase
          .from("gallery_album_photos")
          .select("*")
          .in("album_id", albumIds)
          .order("sort_order");

        (photos ?? []).forEach((p: any) => {
          if (!albumPhotosMap[p.album_id]) albumPhotosMap[p.album_id] = [];
          albumPhotosMap[p.album_id].push({ src: p.image_url, title: p.title });
        });
      }

      const mapped: GalleryItem[] = items.map((item: any) => {
        if (item.type === "album") {
          const photos = albumPhotosMap[item.id] ?? [];
          return {
            type: "album" as const,
            title: item.title,
            desc: item.description ?? "",
            cover: item.image_url ?? photos[0]?.src ?? "",
            photos,
          };
        }
        return {
          type: "photo" as const,
          src: item.image_url ?? "",
          title: item.title,
          desc: item.description ?? "",
        };
      });

      setGalleryItems(mapped);
    };

    fetchGallery();
  }, []);

  const visibleItems = showAll ? galleryItems : galleryItems.slice(0, INITIAL_DISPLAY);

  const openPhoto = (src: string, title: string) => {
    setLightbox({ photos: [{ src, title }], index: 0 });
  };

  const openAlbum = (photos: { src: string; title: string }[], startIndex = 0) => {
    setLightbox({ photos, index: startIndex });
  };

  const navigate = (dir: -1 | 1) => {
    if (!lightbox) return;
    const newIndex = (lightbox.index + dir + lightbox.photos.length) % lightbox.photos.length;
    setLightbox({ ...lightbox, index: newIndex });
  };

  return (
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
          {visibleItems.map((item) =>
            item.type === "photo" ? (
              <div
                key={item.title}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-border"
                onClick={() => openPhoto(item.src, item.title)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ) : (
              <div
                key={item.title}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-border"
                onClick={() => openAlbum(item.photos)}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-background/80 px-2 py-1 backdrop-blur-sm">
                  <FolderOpen className="h-3 w-3 text-secondary" />
                  <span className="font-display text-xs text-foreground">{item.photos.length}</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-secondary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            )
          )}
        </div>

        {galleryItems.length > INITIAL_DISPLAY && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-display text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {showAll ? "Show Less" : `View All (${galleryItems.length})`}
            </button>
            <a
              href="https://www.instagram.com/kassa.iam/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-display text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:text-primary"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {lightbox.photos.length > 1 && (
            <>
              <button
                className="absolute left-4 rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:text-primary"
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:text-primary"
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.photos[lightbox.index].src}
              alt={lightbox.photos[lightbox.index].title}
              className="max-h-[80vh] rounded-xl object-contain"
            />
            <div className="mt-3 text-center">
              <p className="font-display text-sm text-foreground">
                {lightbox.photos[lightbox.index].title}
              </p>
              {lightbox.photos.length > 1 && (
                <p className="font-display text-xs text-muted-foreground">
                  {lightbox.index + 1} / {lightbox.photos.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
