import { useEffect } from "react";
import { useBabyData } from "@/lib/baby-data-context";

export function DebugBabyData() {
  const { status, chapters, currentBaby, getPlaceholdersForChapter } =
    useBabyData();

  useEffect(() => {
    console.log("=== DEBUG BABY DATA ===");
    console.log("Status:", status);
    console.log("Current Baby:", currentBaby);
    console.log("Chapters:", chapters);

    if (chapters.length > 0) {
      const firstChapter = chapters[0];
      console.log("First Chapter:", firstChapter);
      const placeholders = getPlaceholdersForChapter(firstChapter.id);
      console.log("Placeholders for first chapter:", placeholders);
    }
  }, [status, chapters, currentBaby, getPlaceholdersForChapter]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        color: "#fff",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
        maxHeight: "20%",
        overflowY: "auto",
      }}
    >
      <p>Status: {status}</p>
      <p>Chapters: {chapters.length}</p>
      <p>Current Baby: {currentBaby?.name || "none"}</p>
    </div>
  );
}
