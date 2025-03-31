import { useAuthStore } from "@/store/useAuthStore";
import Modal from "react-modal";
import { uploadAvatar } from "@/utils/api";
import { toast } from "sonner";
import Image from "next/image";
import { ProfileUpdateAvatarProps } from "@/types";
import { useImagePreveiw } from "@/hooks/useImagePreview";

const ProfileUpdateAvatar: React.FC<ProfileUpdateAvatarProps> = ({
  closeModal,
  isModalOpen,
}) => {
  const { token } = useAuthStore();

  const { preview, file, error, handleFileChange } = useImagePreveiw();

  const handleUploadAvatar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!file) {
        toast.error("Please select an avatar file to upload.");
        return;
      }

      if (!token) {
        toast.error("You need to be logged in to like a post");
        return;
      }

      const formData = new FormData();
      formData.append("avatar_image", file);

      const res = await uploadAvatar(token, formData);
      if (res) {
        console.log("Avatar updated successfully", res);
        closeModal();
        window.location.reload();
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
