import { useMemo, useState } from "react";
import type { Area, Point } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Crop as CropIcon, RotateCw, SlidersHorizontal, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { fileToDataUrl, urlToDataUrl } from "@/lib/file";
import { getCroppedImageDataUrl } from "@/lib/image-editor";
import { getLogoDisplayUrl } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  folder?: string;
  onChange: (url: string) => void;
};

type AspectPreset = {
  id: string;
  label: string;
  value: number | undefined;
};

const LOGO_ASPECT_PRESETS: AspectPreset[] = [
  { id: "free", label: "Free", value: undefined },
  { id: "1-1", label: "1:1", value: 1 },
  { id: "4-3", label: "4:3", value: 4 / 3 },
  { id: "16-9", label: "16:9", value: 16 / 9 },
];

const IMAGE_ASPECT_PRESETS: AspectPreset[] = [
  { id: "16-9", label: "16:9", value: 16 / 9 },
  { id: "4-3", label: "4:3", value: 4 / 3 },
  { id: "1-1", label: "1:1", value: 1 },
  { id: "free", label: "Free", value: undefined },
];

function getDataUriMimeType(dataUri: string) {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  return match?.[1] || "image/jpeg";
}

export function ImageUploadField({ label, value, onChange, folder = "webmitra" }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [preparingEditor, setPreparingEditor] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImage, setEditorImage] = useState("");
  const [editorMimeType, setEditorMimeType] = useState("image/jpeg");

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const isLogoFolder = folder.toLowerCase() === "logo";
  const previewUrl = isLogoFolder ? getLogoDisplayUrl(value) : value;
  const aspectPresets = isLogoFolder ? LOGO_ASPECT_PRESETS : IMAGE_ASPECT_PRESETS;
  const defaultAspect = isLogoFolder ? 1 : 16 / 9;
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);

  const activeAspectId = useMemo(
    () => aspectPresets.find((item) => item.value === aspect)?.id || "free",
    [aspect, aspectPresets],
  );

  const resetEditorControls = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(defaultAspect);
    setCroppedAreaPixels(null);
  };

  const uploadDataUri = async (dataUri: string) => {
    const url = await adminApi.uploadImage(dataUri, folder, { removeBackground: isLogoFolder });
    onChange(url);
    toast.success(isLogoFolder ? "Logo uploaded and background processed" : "Image uploaded");
  };

  const openEditor = (dataUri: string, mimeType?: string) => {
    resetEditorControls();
    setEditorImage(dataUri);
    setEditorMimeType(mimeType || getDataUriMimeType(dataUri));
    setEditorOpen(true);
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUri = await fileToDataUrl(file);
      openEditor(dataUri, file.type || "image/jpeg");
    } catch {
      toast.error("Failed to read image file");
    } finally {
      event.target.value = "";
    }
  };

  const onEditCurrent = async () => {
    if (!value) return;

    try {
      setPreparingEditor(true);
      const source = isLogoFolder ? getLogoDisplayUrl(value) : value;
      const dataUri = source.startsWith("data:") ? source : await urlToDataUrl(source);
      openEditor(dataUri, getDataUriMimeType(dataUri));
    } catch {
      toast.error("Cannot edit this image URL. Please upload the file again.");
    } finally {
      setPreparingEditor(false);
    }
  };

  const handleUploadOriginal = async () => {
    if (!editorImage) return;

    try {
      setUploading(true);
      await uploadDataUri(editorImage);
      setEditorOpen(false);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadEdited = async () => {
    if (!editorImage) return;
    if (!croppedAreaPixels) {
      toast.error("Please set a crop area first");
      return;
    }

    try {
      setUploading(true);
      const outputMimeType = isLogoFolder ? "image/png" : editorMimeType;
      const processedDataUri = await getCroppedImageDataUrl(editorImage, croppedAreaPixels, {
        rotation,
        mimeType: outputMimeType,
        quality: 0.92,
      });
      await uploadDataUri(processedDataUri);
      setEditorOpen(false);
    } catch {
      toast.error("Failed to process and upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex flex-col gap-2">
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" />

        <div className="flex flex-wrap items-center gap-2">
          <Input type="file" accept="image/*" onChange={onFileChange} aria-label={`Upload ${label}`} className="max-w-[230px]" />

          <span className="text-xs text-muted-foreground">
            {uploading ? "Uploading..." : preparingEditor ? "Preparing editor..." : "Cloudinary/local"}
          </span>

          {isLogoFolder ? <span className="text-xs text-muted-foreground">Auto background removal</span> : null}

          {value ? (
            <Button type="button" variant="outline" size="sm" onClick={onEditCurrent} disabled={uploading || preparingEditor}>
              <CropIcon className="h-4 w-4" />
              Edit current
            </Button>
          ) : null}

          {value ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("")}
              className="ml-auto"
              aria-label={`Remove ${label}`}
              disabled={uploading || preparingEditor}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {value ? (
        <img
          src={previewUrl}
          alt={label}
          className={`h-28 w-full rounded-md border border-border sm:h-40 ${
            isLogoFolder ? "bg-secondary/45 object-contain p-2" : "object-cover"
          }`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = value;
          }}
        />
      ) : null}

      {editorOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-background p-4 shadow-glass md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold">Edit Image Before Upload</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)} disabled={uploading}>
                Close
              </Button>
            </div>

            <div className="relative mt-3 h-[300px] overflow-hidden rounded-xl border border-border bg-black md:h-[380px]">
              <Cropper
                image={editorImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                objectFit={isLogoFolder ? "contain" : "horizontal-cover"}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CropIcon className="h-3.5 w-3.5" />
                  Aspect
                </p>
                <div className="flex flex-wrap gap-2">
                  {aspectPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      type="button"
                      size="sm"
                      variant={activeAspectId === preset.id ? "default" : "outline"}
                      onClick={() => setAspect(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Zoom
                </p>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full accent-primary"
                  aria-label="Zoom"
                />
                <p className="text-xs text-muted-foreground">{zoom.toFixed(2)}x</p>
              </div>

              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <RotateCw className="h-3.5 w-3.5" />
                  Rotation
                </p>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(event) => setRotation(Number(event.target.value))}
                  className="w-full accent-primary"
                  aria-label="Rotation"
                />
                <p className="text-xs text-muted-foreground">{rotation} degrees</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleUploadOriginal} disabled={uploading}>
                <Upload className="h-4 w-4" />
                Upload Original
              </Button>
              <Button type="button" onClick={handleUploadEdited} disabled={uploading}>
                {uploading ? "Uploading..." : "Apply Edit and Upload"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
