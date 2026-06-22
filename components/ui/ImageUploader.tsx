"use client";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").replace(/^"(.*)"$/, "$1");
const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").replace(/^"(.*)"$/, "$1");

const widgetOptions = {
  sources: ["local" as const],
  singleUploadAutoClose: true,
  maxFileSize: 5000000,
  clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
};

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

function UploadButton({ label, onOpen }: { label: string; onOpen: () => void }) {
  if (!uploadPreset || !cloudName) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
        Set <code className="bg-yellow-100 px-1">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and <code className="bg-yellow-100 px-1">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> in Vercel env vars, then redeploy.
      </div>
    );
  }
  return (
    <button type="button" onClick={() => onOpen()} className="btn-outline text-sm">{label}</button>
  );
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  return (
    <div>
      {uploadPreset ? (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={widgetOptions}
          config={{ cloud: { cloudName } }}
          onSuccess={(results: CloudinaryUploadWidgetResults) => {
            const info = results.info as any;
            if (info?.secure_url) onChange(info.secure_url);
          }}
        >
          {({ open }) => <UploadButton label={value ? "Change Image" : "Upload Image"} onOpen={open} />}
        </CldUploadWidget>
      ) : (
        <UploadButton label="Upload Image" onOpen={() => {}} />
      )}
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
        uploadPreset ? (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            options={widgetOptions}
            config={{ cloud: { cloudName } }}
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              const info = results.info as any;
              if (info?.secure_url) onChange([...values, info.secure_url]);
            }}
          >
            {({ open }) => <UploadButton label={values.length === 0 ? "Upload Images" : "Add Another Image"} onOpen={open} />}
          </CldUploadWidget>
        ) : (
          <UploadButton label="Upload Images" onOpen={() => {}} />
        )
      )}
    </div>
  );
}
