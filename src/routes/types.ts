import type {
  Baby,
  Chapter,
  FamilyMember,
  Moment,
  PlaceholderTemplate,
} from "@/types";

export type Screen =
  | "home"
  | "gallery"
  | "moments"
  | "chapters"
  | "notifications"
  | "profile";

export type ViewState =
  | { type: "main"; screen: Screen }
  | { type: "chapter-detail"; chapter: Chapter }
  | { type: "moment-form"; template: PlaceholderTemplate; chapter: Chapter }
  | { type: "blank-moment"; chapter: Chapter }
  | { type: "moment-detail"; moment: Moment }
  | { type: "growth" }
  | { type: "vaccines" }
  | { type: "consultations" }
  | { type: "sleep-humor" }
  | { type: "family-tree" }
  | { type: "family-member-detail"; member: FamilyMember }
  | { type: "manage-babies" }
  | { type: "edit-baby"; baby: Baby }
  | { type: "add-baby" }
  | { type: "export-album" }
  | { type: "manage-account" }
  | { type: "notifications-settings" }
  | { type: "help-and-support" }
  | { type: "splash" }
  | { type: "auth" };
