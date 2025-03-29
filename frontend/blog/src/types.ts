export interface UserProps {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

export interface CommentProps {
  id: string;
  author: UserProps;
  text: string;
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

export interface PostProps {
  id: string;
  author: UserProps;
  text: string;
  photo: string;
  comments: Comment[];
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

export interface LikeProps {
  liked: boolean;
  likes: number;
  setLiked: (liked: boolean) => void;
  setLikes: (likes: number) => void;
  like: (token: string, id: string) => Promise<{ message: string }>; //This is some special func in api to like post or comment depends of useage
  id: string;
}

export interface UpdatePostProps {
  postId: string;
  initialText: string;
  initialPhoto?: string;
  onUpdate: (updatedText: string, updatedPhoto?: string) => void;
}

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface TabsProps {
  selected: string;
  setSelected: (value: string) => void;
  tabsOptions: string[];
}

export interface ProfileUpdateAvatarProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

export interface ErrorMessageProps {
  message: string;
}
