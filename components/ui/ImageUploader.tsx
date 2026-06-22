"use client";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").replace(/^"(.*)"$/, "$1");
const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").replace(/^"(.*)"$/, "$1");
const isConfigured = !!(uploadPreset && cloudName && !uploadPreset.includes("your-") && !cloudName.includes("your-"));

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

function SetupWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
      <p className="font-medium mb-1">Cloudinary not configured</p>
      <p>Set <code className="bg-yellow-100 px-1">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and <code className="bg-yellow-100 px-1">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> in <code className="bg-yellow-100 px-1">.env.local</code>, then restart the dev server.</p>
      <p className="text-xs mt-1">Need help? Create a free account at cloudinary.com → Settings → Upload → Add unsigned upload preset.</p>
    </div>
  );
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  if (!isConfigured) return <SetupWarning />;

  return (
    <div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onSuccess={(results: CloudinaryUploadWidgetResults) => {
          const info = results.info as any;
          if (info?.secure_url) onChange(info.secure_url);
        }}
      >
        {({ open }) => (
          <button type="button" onClick={() => open()} className="btn-outline text-sm">
            {value ? "Change Image" : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>
      {value && (
        <div className="mt-3 relative w-40 aspect-[4/3] bg-gold-muted overflow-hidden border border-gray-200 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button" onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >×</button>
        </div>
      )}
    </div>
  );
}

export function MultiImageUploader({ values, onChange, max = 10 }: MultiImageUploaderProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {values.map((url, i) => (
          <div key={i} className="relative w-28 aspect-[4/3] bg-gold-muted overflow-hidden border border-gray-200 group">
            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >×</button>
          </div>
        ))}
      </div>
      {values.length < max && (
        isConfigured ? (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              const info = results.info as any;
              if (info?.secure_url) onChange([...values, info.secure_url]);
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className="btn-outline text-sm">
                {values.length === 0 ? "Upload Images" : "Add Another Image"}
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <SetupWarning />
        )
      )}
    </div>
  );
}
