import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, FolderOpen, ImageIcon, ChevronUp, ChevronDown } from "lucide-react";

interface GalleryItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

interface AlbumPhoto {
  id: string;
  album_id: string;
  title: string;
  image_url: string;
  sort_order: number;
}

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albumPhotos, setAlbumPhotos] = useState<Record<string, AlbumPhoto[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("gallery_items").select("*").order("sort_order");
    const itemsList = (data as GalleryItem[]) ?? [];
    setItems(itemsList);

    // Fetch album photos for all albums
    const albums = itemsList.filter((i) => i.type === "album");
    if (albums.length > 0) {
      const { data: photos } = await supabase
        .from("gallery_album_photos")
        .select("*")
        .in("album_id", albums.map((a) => a.id))
        .order("sort_order");
      const grouped: Record<string, AlbumPhoto[]> = {};
      (photos as AlbumPhoto[] ?? []).forEach((p) => {
        if (!grouped[p.album_id]) grouped[p.album_id] = [];
        grouped[p.album_id].push(p);
      });
      setAlbumPhotos(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (error) {
      toast({ title: "Upload error", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    return data.publicUrl;
  };

  const addPhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await uploadImage(file);
      if (!url) return;
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const { error } = await supabase.from("gallery_items").insert({
        type: "photo",
        title,
        image_url: url,
        sort_order: items.length,
      });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { fetchItems(); toast({ title: "Photo added" }); }
    };
    input.click();
  };

  const addAlbum = async () => {
    const title = prompt("Album title:");
    if (!title?.trim()) return;
    const { error } = await supabase.from("gallery_items").insert({
      type: "album",
      title: title.trim(),
      sort_order: items.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { fetchItems(); toast({ title: "Album created" }); }
  };

  const addAlbumPhoto = async (albumId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      for (const file of files) {
        const url = await uploadImage(file);
        if (!url) continue;
        const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        await supabase.from("gallery_album_photos").insert({
          album_id: albumId,
          title,
          image_url: url,
          sort_order: (albumPhotos[albumId]?.length ?? 0),
        });
      }
      fetchItems();
      toast({ title: `${files.length} photo(s) added to album` });
    };
    input.click();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { fetchItems(); toast({ title: "Deleted" }); }
  };

  const deleteAlbumPhoto = async (id: string) => {
    const { error } = await supabase.from("gallery_album_photos").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { fetchItems(); toast({ title: "Photo removed" }); }
  };

  const updateItem = async (id: string, updates: Partial<GalleryItem>) => {
    await supabase.from("gallery_items").update(updates).eq("id", id);
    fetchItems();
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    const a = items[index];
    const b = items[swapIndex];
    await Promise.all([
      supabase.from("gallery_items").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("gallery_items").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchItems();
  };

  const moveAlbumPhoto = async (albumId: string, index: number, direction: "up" | "down") => {
    const photos = albumPhotos[albumId] ?? [];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= photos.length) return;
    const a = photos[index];
    const b = photos[swapIndex];
    await Promise.all([
      supabase.from("gallery_album_photos").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("gallery_album_photos").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchItems();
  };

  // Set album cover from first photo or uploaded image
  const setAlbumCover = async (albumId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await uploadImage(file);
      if (url) {
        await supabase.from("gallery_items").update({ image_url: url }).eq("id", albumId);
        fetchItems();
        toast({ title: "Cover updated" });
      }
    };
    input.click();
  };

  if (loading) return <p className="font-display text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Gallery</h2>
        <div className="flex gap-2">
          <Button onClick={addPhoto} size="sm" className="gap-1">
            <Upload className="h-3 w-3" /> Add Photo
          </Button>
          <Button onClick={addAlbum} size="sm" variant="outline" className="gap-1">
            <FolderOpen className="h-3 w-3" /> New Album
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 p-3">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  {item.type === "album" ? <FolderOpen className="h-6 w-6 text-muted-foreground" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <input
                  defaultValue={item.title}
                  onBlur={(e) => { if (e.target.value !== item.title) updateItem(item.id, { title: e.target.value }); }}
                  className="w-full bg-transparent font-display text-sm font-semibold text-foreground outline-none"
                />
                <input
                  defaultValue={item.description ?? ""}
                  onBlur={(e) => updateItem(item.id, { description: e.target.value || null })}
                  placeholder="Description"
                  className="w-full bg-transparent font-display text-xs text-muted-foreground outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 font-display text-[10px] ${item.type === "album" ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-primary"}`}>
                    {item.type}
                  </span>
                  {item.type === "album" && (
                    <>
                      <button onClick={() => setExpandedAlbum(expandedAlbum === item.id ? null : item.id)} className="font-display text-[10px] text-primary hover:underline">
                        {albumPhotos[item.id]?.length ?? 0} photos
                      </button>
                      <button onClick={() => setAlbumCover(item.id)} className="font-display text-[10px] text-muted-foreground hover:text-primary">
                        Set cover
                      </button>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Album photos expanded */}
            {item.type === "album" && expandedAlbum === item.id && (
              <div className="border-t border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-xs text-muted-foreground">Album Photos</span>
                  <Button onClick={() => addAlbumPhoto(item.id)} size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Add Photos
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {(albumPhotos[item.id] ?? []).map((photo) => (
                    <div key={photo.id} className="group relative">
                      <img src={photo.image_url} alt={photo.title} className="aspect-square w-full rounded-lg object-cover" />
                      <button
                        onClick={() => deleteAlbumPhoto(photo.id)}
                        className="absolute top-1 right-1 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3 text-destructive-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center font-display text-sm text-muted-foreground">Gallery is empty. Add photos or create an album above.</p>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
