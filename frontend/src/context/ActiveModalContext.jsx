import { createContext, useState } from "react";

const ActiveModalContext = createContext();

const ActiveModalProvider = ({ children }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return(
    <ActiveModalContext.Provider value={{ isPreviewModalOpen, setIsPreviewModalOpen, isEditModalOpen, setIsEditModalOpen, isDeleteModalOpen, setIsDeleteModalOpen }} >
      {children}
    </ActiveModalContext.Provider>
  );
}

export { ActiveModalContext, ActiveModalProvider };