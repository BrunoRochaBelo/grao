import { useState, useMemo } from "react";
import { X, Camera, MapPin, Users, Lock, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Chapter } from "@/types";
import { toast } from "sonner";
import { getHighlightStyle } from "@/lib/highlights";
import { useMomentActions } from "./hooks/useMomentActions";

interface BlankMomentFormProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  onSave?: () => void;
}

interface BlankMomentFormValues {
  title: string;
  date: string;
  time: string;
  location?: string;
  peopleRaw: string;
  noteShort?: string;
  noteLong?: string;
  tags: string[];
  privacy: "private" | "people" | "link";
  status: "published" | "draft";
}

interface PrivacyDisplay {
  id: "private" | "people" | "link";
  label: string;
  tone: Parameters<typeof getHighlightStyle>[0];
  Icon: typeof Lock;
}

const PRIVACY_OPTIONS: PrivacyDisplay[] = [
  { id: "private", label: "Privado", tone: "lavender", Icon: Lock },
  { id: "people", label: "Pessoas", tone: "mint", Icon: Users },
  { id: "link", label: "Link", tone: "babyBlue", Icon: LinkIcon },
];

const MAX_TAGS = 10;

function buildDefaultValues(): BlankMomentFormValues {
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    title: "",
    date: today,
    time: now,
    location: "",
    peopleRaw: "",
    noteShort: "",
    noteLong: "",
    tags: [],
    privacy: "private",
    status: "draft",
  };
}

function formatDateLabel(dateValue: string, timeValue: string): string {
  if (!dateValue || !timeValue) return "—";

  try {
    const [year, month, day] = dateValue.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${formatter.format(date)} às ${timeValue}`;
  } catch {
    return "—";
  }
}


function normalizePeople(input: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function BlankMomentForm({
  isOpen,
  onClose,
  chapter,
  onSave,
}: BlankMomentFormProps) {
  const [currentTag, setCurrentTag] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BlankMomentFormValues>({
    defaultValues: buildDefaultValues(),
    mode: "onBlur",
  });

  const { createMoment, getAgeLabel, isBabySelected } = useMomentActions();

  const dateValue = watch("date");
  const timeValue = watch("time");
  const tags = watch("tags");
  const privacy = watch("privacy");

  const ageLabel = useMemo(
    () => (dateValue ? getAgeLabel(dateValue) : ""),
    [dateValue, getAgeLabel]
  );

  const handleAddTag = () => {
    const normalizedTag = currentTag.trim();
    if (!normalizedTag) return;

    if (tags.length >= MAX_TAGS) {
      setTagError(`Use no máximo ${MAX_TAGS} etiquetas por momento.`);
      return;
    }

    if (tags.includes(normalizedTag)) {
      toast.info("Esta etiqueta já foi adicionada.");
      return;
    }

    setValue("tags", [...tags, normalizedTag], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCurrentTag("");
    setTagError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true, shouldValidate: true }
    );
    if (tagError) {
      setTagError(null);
    }
  };

  const onSubmit = async (values: BlankMomentFormValues) => {
    if (!isBabySelected) {
      toast.error("Nenhum bebê ativo selecionado.");
      return;
    }

    const peopleList = normalizePeople(values.peopleRaw);

    try {
      const created = await createMoment({
        chapterId: chapter.id,
        templateId: "",
        title: values.title,
        date: values.date,
        time: values.time,
        location: values.location || undefined,
        people: peopleList,
        noteShort: values.noteShort || undefined,
        noteLong: values.noteLong || undefined,
        tags: values.tags,
        privacy: values.privacy,
        status: values.status,
        ageLabel,
      });

      if (!created) {
        throw new Error("Falha ao criar momento");
      }

      toast.success(
        values.status === "published"
          ? "✨ Momento em branco criado com sucesso!"
          : "Rascunho salvo com sucesso"
      );

      onSave?.();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar momento. Tente novamente.");
    }
  };

  const onInvalid = () => {
    toast.error("Revise os campos destacados para continuar.");
  };

  const submitForm = handleSubmit(onSubmit, onInvalid);

  const handlePublish = () => {
    setValue("status", "published", {
      shouldDirty: true,
      shouldValidate: true,
    });
    void submitForm();
  };

  const handleDraft = () => {
    setValue("status", "draft", {
      shouldDirty: true,
      shouldValidate: true,
    });
    void submitForm();
  };

  const handleDiscard = () => {
    if (isDirty) {
      if (confirm("Descartar alterações?")) {
        reset(buildDefaultValues());
        onClose();
      }
      return;
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h2 className="text-foreground">Momento em Branco</h2>
                  <p className="text-muted-foreground text-sm">
                    {chapter.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDiscard}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Mídia */}
                <div>
                  <Label>Fotos e Vídeos</Label>
                  <button className="w-full h-40 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Adicionar mídia</span>
                  </button>
                </div>

                {/* Título */}
                <div>
                  <Label htmlFor="blank-title">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="blank-title"
                    placeholder="Dê um nome a este momento..."
                    className="mt-1"
                    {...register("title", {
                      required: "Informe um título para o momento.",
                      setValueAs: (value) => (value as string).trimStart(),
                    })}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="blank-date">Data</Label>
                    <Input
                      id="blank-date"
                      type="date"
                      className="mt-1"
                      max={new Date().toISOString().split("T")[0]}
                      {...register("date", {
                        required: "Selecione uma data.",
                      })}
                    />
                    {errors.date && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="blank-time">Hora</Label>
                    <Input
                      id="blank-time"
                      type="time"
                      className="mt-1"
                      {...register("time", {
                        required: "Selecione um horário.",
                      })}
                    />
                    {errors.time && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Idade e Data Formatada */}
                <div className="flex items-center justify-between bg-muted/60 border border-border rounded-xl p-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Idade registrada
                    </p>
                    <p className="text-foreground font-medium">
                      {ageLabel || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{formatDateLabel(dateValue, timeValue)}</span>
                  </div>
                </div>

                {/* Local e Pessoas */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="blank-location">Local</Label>
                    <Input
                      id="blank-location"
                      placeholder="Onde aconteceu?"
                      className="mt-1"
                      {...register("location", {
                        maxLength: {
                          value: 120,
                          message: "O local pode ter no máximo 120 caracteres.",
                        },
                      })}
                    />
                    {errors.location && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="blank-people">Pessoas</Label>
                    <Input
                      id="blank-people"
                      placeholder="Separe os nomes com vírgula"
                      className="mt-1"
                      {...register("peopleRaw", {
                        maxLength: {
                          value: 200,
                          message:
                            'O campo "Pessoas" pode ter no máximo 200 caracteres.',
                        },
                      })}
                    />
                    {errors.peopleRaw && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.peopleRaw.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notas */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="blank-noteShort">Resumo do momento</Label>
                    <Textarea
                      id="blank-noteShort"
                      placeholder="Escreva uma frase marcante..."
                      className="mt-1"
                      rows={3}
                      {...register("noteShort", {
                        maxLength: {
                          value: 160,
                          message:
                            "O resumo pode ter no máximo 160 caracteres.",
                        },
                      })}
                    />
                    {errors.noteShort && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.noteShort.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="blank-noteLong">Depoimento completo</Label>
                    <Textarea
                      id="blank-noteLong"
                      placeholder="Conte mais detalhes e sentimentos sobre este momento..."
                      className="mt-1"
                      rows={4}
                      {...register("noteLong", {
                        maxLength: {
                          value: 2000,
                          message:
                            "O depoimento pode ter no máximo 2000 caracteres.",
                        },
                      })}
                    />
                    {errors.noteLong && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.noteLong.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Etiquetas */}
                <div>
                  <Label htmlFor="blank-tags">Etiquetas</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/80 hover:text-destructive-foreground transition-colors"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Input
                      id="blank-tags"
                      placeholder="Adicione uma etiqueta..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!currentTag.trim()}
                    >
                      Adicionar
                    </Button>
                  </div>

                  {tagError && (
                    <p className="text-destructive text-sm mt-1">{tagError}</p>
                  )}
                </div>

                {/* Privacidade */}
                <div>
                  <Label>Privacidade</Label>
                  <div className="flex gap-2 mt-2">
                    {PRIVACY_OPTIONS.map(({ id, label, tone, Icon }) => (
                      <button
                        key={id}
                        onClick={() => {
                          setValue("privacy", id, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          privacy === id
                            ? `border-primary ${getHighlightStyle(
                                tone
                              )} text-primary`
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé com ações */}
            <div className="border-t border-border p-4 bg-muted/20">
              <div className="max-w-2xl mx-auto flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleDiscard}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDraft}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Publicar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
