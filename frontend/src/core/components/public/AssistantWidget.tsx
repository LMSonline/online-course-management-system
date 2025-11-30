"use client";

import AssistantPopup from "./AssistantPopup";
import { useAssistantStore } from "./store";

export default function AssistantWidget() {
  const { open, closePopup } = useAssistantStore();

  return (
    <>
      <AssistantPopup open={open} onClose={closePopup} />
    </>
  );
}
