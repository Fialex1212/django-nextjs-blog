import { useAuthStore } from "@/store/useAuthStore";
import css from "./styles.module.css";

const Popup = ({ children }) => {
  const { isPopup, setIsPopup } = useAuthStore();

  if (!isPopup) {
    return null;
  }
  return (
    <div className={css.overlay} onClick={() => setIsPopup(false)}>
      <div
        className={`${css.popup} ${isPopup ? css.popup__active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;