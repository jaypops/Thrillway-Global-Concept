import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

interface FileUploaderProps {
  id: string;
  label: string;
  description: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  previewUrls?: string[] | { name: string; url: string }[]; 
  onFileChange: (files: File[]) => void;
  onRemove: (index: number) => void;
  error?: string;
  icon?: React.ReactNode;
}

export const FileUploader = ({
  id,
  label,
  description,
  accept,
  multiple = true,
  files,
  previewUrls,
  onFileChange,
  onRemove,
  error,
  icon = <Upload className="h-6 w-6 mb-2" />,
}: FileUploaderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFileChange([...files, ...newFiles]);
    }
  };

  const isDocumentUploader = id === "document-upload";

  return (
    <div className="space-y-2">
      <label className="flex items-center">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
          error ? "border-destructive" : ""
        }`}
      >
        <input
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
        <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
          {icon}
          <span className="text-sm font-medium">
            Click to upload {label.toLowerCase()}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{description}</span>
        </label>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {previewUrls && previewUrls.length > 0 && (
        <div className="mt-4">
          {isDocumentUploader ? (
            <div className="space-y-2">
              {previewUrls.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <a
                    href={(doc as { name: string; url: string }).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-[200px]"
                  >
                    {(doc as { name: string; url: string }).name}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="text-destructive hover:text-destructive/80 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url as string}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {files.length > 0 && !previewUrls && (
        <div className="space-y-2 mt-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted p-2 rounded-md"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive/80 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};