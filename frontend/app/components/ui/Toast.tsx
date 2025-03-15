import * as React from "react";
import { Toast } from "radix-ui";
import "./styles.css";

interface ToastComponentProps {
  message: string;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ message }) => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const showToast = () => {
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <button className="Button large violet" onClick={showToast}>
        Show Notification
      </button>

      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">{message}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default ToastComponent;
