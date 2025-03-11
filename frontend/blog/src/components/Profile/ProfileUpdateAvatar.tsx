import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Modal from "react-modal";
import { uploadAvatar } from "@/utils/api";
import { toast } from "sonner";

interface ProfileUpdateAvatarProps {
    closeModal: () => void;
    isModalOpen: boolean;
  }

const ProfileUpdateAvatar: React.FC<ProfileUpdateAvatarProps> = ({ closeModal, isModalOpen }) => {
  const [file, setFile] = useState<File | null>(null);
  const { token } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileUpdateAvatar;
