import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Modal from "react-modal";
import { uploadAvatar } from "@/utils/api";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileUpdateAvatarProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const ProfileUpdateAvatar: React.FC<ProfileUpdateAvatarProps> = ({
  closeModal,
  isModalOpen,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const handleUploadAvatar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an avatar file to upload.");
      return;
    }

    if (!token) {
      toast.error("You need to be logged in to like a post");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar_image", file);

      const res = await uploadAvatar(token, formData);
      if (res) {
        console.log("Avatar updated successfully", res);
        closeModal();
      }
    } catch (error) {
      console.log("Failed to upload avatar", error);
      toast.error("Failed to upload avatar.");
    }
  };
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Post Modal"
        ariaHideApp={false}
      >
        <button className="close" onClick={closeModal}></button>
        <div className="change__avatar">
          <form onSubmit={handleUploadAvatar} className="form">
            <input
              name="avatar"
              type="file"
              onChange={handleFileChange}
              id="avatar"
            />
            <button type="submit">Upload</button>
          </form>
          {preview && (
            <div>
              <Image
                src={preview}
                alt="Selected Preview"
                width={200}
                height={200}
              />
            </div>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default ProfileUpdateAvatar;
