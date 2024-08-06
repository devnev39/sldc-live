import dayjs from "dayjs";
import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = ({ children }) => {
  const dateFormat = "YYYY-MM-DD";
  const [current, setCurrent] = useState("home");
  const [date, setDate] = useState(dayjs(dayjs(), dateFormat));

  const [open, setOpen] = useState(false);

  const [showIntro, setShowIntro] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <NavbarContext.Provider
      value={{
        dateFormat,
        current,
        setCurrent,
        onClick,
        date,
        setDate,
        open,
        showModal,
        handleCancel,
        showIntro,
        setShowIntro,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
