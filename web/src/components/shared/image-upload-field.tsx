import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { fileToDataUrl } from "@/lib/file";
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

export function ImageUploadField({ label, value, onChange, folder = "webmitra" }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const isLogoFolder = folder.toLowerCase() === "logo";
  const previewUrl = isLogoFolder ? getLogoDisplayUrl(value) : value;

  const uploadDataUri = async (dataUri: string) => {
    const url = await adminApi.uploadImage(dataUri, folder);
    onChange(url);
    toast.success("Image uploaded");
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await fileToDataUrl(file);
      await uploadDataUri(dataUri);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const onRemoveImage = () => {
    if (uploading) return;
    onChange("");
    toast.success("Image removed");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex flex-col gap-2">
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" />

        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            aria-label={`Upload ${label}`}
            className="max-w-[230px]"
            disabled={uploading}
          />

          <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Cloudinary/local"}</span>

          {value ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              className="ml-auto"
              aria-label={`Remove ${label}`}
              disabled={uploading}
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
    </div>
  );
}
