/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import { api } from "src/utils/api";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const initMutation = api.s3.init.useMutation();
  const completeMutation = api.s3.complete.useMutation();

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    console.log(selectedFile);
    const format = selectedFile?.name.split(".").pop() || "jpg";
    console.log(format);
    initMutation.mutate({
      format: selectedFile?.name || "Untitled.jpg",
      contentType: selectedFile?.type || "image/jpeg",
    });
  }

  useEffect(() => {
    const uploadFile = async (signedUrl: string | undefined, blob: Blob) => {
      try {
        if (!signedUrl) {
          return new Error("Unable to get signed url");
        }

        const response = await fetch(signedUrl, {
          method: "PUT",
          body: blob,
        });

        if (response.status === 200) {
          console.log(response);
          console.log("Chunk uploaded", response.headers.get("ETag"));
          completeMutation.mutate({
            key: initMutation.data?.key || "",
            uploadId: initMutation.data?.uploadId || "",
            etag: response.headers.get("ETag") || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (initMutation.isSuccess && file) {
      const blob = file.slice(0, file.size, file.type);
      console.log(blob);
      uploadFile(initMutation.data.signedUrl, blob).catch(console.error);
    }
  }, [initMutation.data, initMutation.isSuccess, file]);

  useEffect(() => {
    if (completeMutation.isSuccess) {
      console.log("File uploaded successfully");
      console.log(completeMutation.data.complete);
    }
  }, [completeMutation.isSuccess]);

  return (
    <form>
      <input
        type="file"
        name="fileInput"
        id="fileInput"
        onChange={handleFileInputChange}
      />
      <button type="submit" disabled={!file || uploading}>
        {initMutation.isLoading ? "Uploading..." : "Upload"}
      </button>
      {uploadError && <p>{uploadError}</p>}
    </form>
  );
}
