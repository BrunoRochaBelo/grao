import { useEffect, useMemo, useState } from "react";
import {
  X,
  Camera,
  MapPin,
  Users,
  Lock,
  Tag,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlaceholderTemplate, Chapter } from "@/types";
import { toast } from "sonner";
import { getHighlightStyle } from "@/lib/highlights";
import {
  buildDefaultValues,
  formatDateLabel,
  isValidDateValue,
  isValidTime,
  normalizePeople,
  MAX_TAGS,
  type MomentFormValues,
  type PrivacyOption,
} from "./forms/momentFormConfig";
import { useMomentActions } from "./hooks/useMomentActions";

interface MomentFormProps {
  isOpen: boolean;
  onClose: () => void;
  template: PlaceholderTemplate;
  chapter: Chapter;
  onSave?: () => void;
}

interface PrivacyDisplay {
  id: PrivacyOption;
  label: string;
  tone: Parameters<typeof getHighlightStyle>[0];
  Icon: typeof Lock;
}

const PRIVACY_OPTIONS: PrivacyDisplay[] = [
  { id: "private", label: "Privado", tone: "lavender", Icon: Lock },
  { id: "people", label: "Pessoas", tone: "mint", Icon: Users },
  { id: "link", label: "Link", tone: "babyBlue", Icon: LinkIcon },
];

export function MomentForm({
  isOpen,
  onClose,
  template,
  chapter,
  onSave,
}: MomentFormProps) {
  const [currentTag, setCurrentTag] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MomentFormValues>({
    defaultValues: buildDefaultValues(template.name),
    mode: "onBlur",
  });

  const { createMoment, getAgeLabel, isBabySelected } = useMomentActions();

  const dateValue = watch("date");
  const timeValue = watch("time");
  const tags = watch("tags");
  const privacy = watch("privacy");

  const ageLabel = useMemo(
    () => (isValidDateValue(dateValue) ? getAgeLabel(dateValue) : ""),
    [dateValue, getAgeLabel]
  );

  useEffect(() => {
    register("status");
    register("tags");
    register("privacy");
  }, [register]);

  useEffect(() => {
    reset(buildDefaultValues(template.name));
    setCurrentTag("");
    setTagError(null);
  }, [reset, template.id, template.name]);

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

  const onSubmit = async (values: MomentFormValues) => {
    if (!isBabySelected) {
      toast.error("Nenhum bebê ativo selecionado.");
      return;
    }

    const peopleList = normalizePeople(values.peopleRaw);

    try {
      const created = await createMoment({
        chapterId: chapter.id,
        templateId: template.id,
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
          ? `${template.icon} Lembrança guardada com carinho 🌸`
          : "Rascunho salvo para depois."
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

  const handleDiscard = () => {
    if (isDirty) {
      if (confirm("Descartar alterações?")) {
        reset(buildDefaultValues(template.name));
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
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {chapter.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <Label>Fotos e Vídeos</Label>
                  <button className="w-full h-40 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Adicionar mídia</span>
                  </button>
                </div>

                <div>
                  <Label htmlFor="title">
                    Dê um nome a esta lembrança <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Primeiro sorriso, dia na praia, etc."
                    className="mt-1"
                    {...register("title", {
                      required: "Toda lembrança precisa de um nome.",
                      setValueAs: (value) => (value as string).trimStart(),
                    })}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      className="mt-1"
                      max={new Date().toISOString().split("T")[0]}
                      {...register("date", {
                        required: "Selecione uma data.",
                        validate: (value) =>
                          isValidDateValue(value) ||
                          "A data não pode estar no futuro.",
                      })}
                    />
                    {errors.date && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      className="mt-1"
                      {...register("time", {
                        required: "Selecione um horário.",
                        validate: (value) =>
                          isValidTime(value) || "Informe um horário válido.",
                      })}
                    />
                    {errors.time && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      placeholder="Casa da vovó, no parque..."
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
                    <Label htmlFor="people">Quem estava presente?</Label>
                    <Input
                      id="people"
                      placeholder="Vovô, titia, etc."
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="noteShort">Um pequeno resumo</Label>
                    <Textarea
                      id="noteShort"
                      placeholder="Uma frase ou citação especial..."
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
                    <Label htmlFor="noteLong">Sua história completa</Label>
                    <Textarea
                      id="noteLong"
                      placeholder="Escreva com o coração... quais cheiros, sons e sentimentos tornaram este momento especial?"
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

                <div>
                  <Label htmlFor="tags">Etiquetas</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(event) => setCurrentTag(event.target.value)}
                      placeholder="Digite e pressione enter"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  {(tagError || errors.tags) && (
                    <p className="text-destructive text-sm mt-1">
                      {tagError ?? errors.tags?.message}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="rounded-full p-0.5 hover:bg-muted transition-colors"
                          aria-label={`Remover etiqueta ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        Nenhuma etiqueta adicionada.
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Quem pode ver este momento?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRIVACY_OPTIONS.map((option) => {
                      const style = getHighlightStyle(option.tone);
                      const isActive = privacy === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setValue("privacy", option.id, {
                              shouldDirty: true,
                            })
                          }
                          className={`rounded-xl border transition-all text-left p-3 space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            isActive
                              ? "border-transparent ring-2 ring-offset-2 ring-offset-background"
                              : "border-border hover:border-primary"
                          }`}
                          style={isActive ? style : undefined}
                        >
                          <option.Icon className="w-5 h-5" />
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {option.id === "private"
                                ? "Visível apenas para você e administradores."
                                : option.id === "people"
                                ? "Compartilhe com familiares e amigos conectados."
                                : "Disponibilize por link compartilhável."}
                            </p>
                          </div>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-sm">
                              <Check className="w-4 h-4" /> Selecionado
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-background/90">
              <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePublish}
                  >
                    Guardar na história
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

