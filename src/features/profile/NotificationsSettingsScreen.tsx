import { useState } from "react";
import { ChevronLeft, BellRing, Timer, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({
  onBack,
}: NotificationsSettingsScreenProps) {
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [frequency, setFrequency] = useState("daily");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [categorySettings, setCategorySettings] = useState({
    vaccines: true,
    milestones: true,
    series: true,
    retrospectives: false,
    digest: true,
  });
  const [themePreference, setThemePreference] = useState<
    "light" | "dark" | "system"
  >("system");
  const [language, setLanguage] = useState("pt-BR");
  const [autoBackup, setAutoBackup] = useState(true);
  const [galleryView, setGalleryView] = useState<"timeline" | "grid">(
    "timeline"
  );
  const [showTips, setShowTips] = useState(true);

  const handleCategoryToggle = (key: keyof typeof categorySettings) => {
    setCategorySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setReceiveNotifications(true);
    setFrequency("daily");
    setQuietStart("22:00");
    setQuietEnd("08:00");
    setCategorySettings({
      vaccines: true,
      milestones: true,
      series: true,
      retrospectives: false,
      digest: true,
    });
    setThemePreference("system");
    setLanguage("pt-BR");
    setAutoBackup(true);
    setGalleryView("timeline");
    setShowTips(true);
    toast.success("Preferencias redefinidas.");
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">
          Sussurros e preferências
        </h1>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <BellRing className="w-4 h-4" />
            <span>Sussurros</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Receber sussurros
              </p>
              <p className="text-sm text-muted-foreground">
                Ative ou pause todos os alertas enviados pelo aplicativo.
              </p>
            </div>
            <Switch
              checked={receiveNotifications}
              onCheckedChange={setReceiveNotifications}
              aria-label="Receber sussurros"
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Frequencia
            </Label>
            <RadioGroup
              value={frequency}
              onValueChange={setFrequency}
              className="grid gap-2"
            >
              {[
                { id: "immediate", label: "Imediato" },
                { id: "daily", label: "Diario" },
                { id: "weekly", label: "Semanal" },
                { id: "monthly", label: "Mensal" },
              ].map((option) => (
                <label
                  key={option.id}
                  htmlFor={`frequency-${option.id}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2"
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`frequency-${option.id}`}
                  />
                  <span className="text-sm text-foreground">
                    {option.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>Horario silencioso</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="quiet-start">Inicio</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={quietStart}
                  onChange={(event) => setQuietStart(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quiet-end">Termino</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={quietEnd}
                  onChange={(event) => setQuietEnd(event.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Durante este intervalo nenhuma notificacao push sera enviada.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Categorias
            </Label>
            {[
              { key: "vaccines", label: "Vacinas" },
              { key: "milestones", label: "Marcos" },
              { key: "series", label: "Series / Mesversario" },
              { key: "retrospectives", label: "Retroativos" },
              { key: "digest", label: "Digest semanal" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
              >
                <span>{item.label}</span>
                <Switch
                  checked={
                    categorySettings[item.key as keyof typeof categorySettings]
                  }
                  onCheckedChange={() =>
                    handleCategoryToggle(
                      item.key as keyof typeof categorySettings
                    )
                  }
                  aria-label={item.label}
                />
              </label>
            ))}
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Preferencias salvas automaticamente.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>Preferencias gerais</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={themePreference}
                onValueChange={(value) =>
                  setThemePreference(value as typeof themePreference)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Automatico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Portugues (Brasil)</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                  <SelectItem value="es-ES">Espanol</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground font-medium">
                  Backup automatico
                </p>
                <p className="text-xs text-muted-foreground">
                  Sincronize em nuvem sempre que abrir o app.
                </p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
                aria-label="Backup automatico"
              />
            </div>

            <div className="space-y-2">
              <Label>Destino do backup</Label>
              <Select defaultValue="cloud">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Nuvem do Livro do Bebe</SelectItem>
                  <SelectItem value="drive">Google Drive</SelectItem>
                  <SelectItem value="dropbox">Dropbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exibicao padrao da galeria</Label>
              <Select
                value={galleryView}
                onValueChange={(value) =>
                  setGalleryView(value as typeof galleryView)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma visualizacao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeline">Linha do tempo</SelectItem>
                  <SelectItem value="grid">Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground font-medium">
                  Mostrar dicas contextuais
                </p>
                <p className="text-xs text-muted-foreground">
                  Sugestoes breves durante o uso do app.
                </p>
              </div>
              <Switch
                checked={showTips}
                onCheckedChange={setShowTips}
                aria-label="Mostrar dicas contextuais"
              />
            </div>

            <Button variant="outline" onClick={handleReset}>
              Redefinir preferencias
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ultimo backup: 22/10/2025 as 10:37
          </p>
        </section>
      </div>
    </div>
  );
}
