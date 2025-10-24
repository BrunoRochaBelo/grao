import { useMemo, useState } from 'react';
import { ChevronLeft, Loader2, FileText, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { chapters } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface ExportAlbumScreenProps {
  onBack: () => void;
}

export function ExportAlbumScreen({ onBack }: ExportAlbumScreenProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState<'full' | 'chapter' | 'series'>('full');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [includeDrafts, setIncludeDrafts] = useState<boolean>(false);
  const [useDarkTheme, setUseDarkTheme] = useState<boolean>(false);
  const [includeTags, setIncludeTags] = useState<boolean>(true);

  const seriesOptions = useMemo(
    () => [
      { id: 'monthversary', label: 'Mesversario completo' },
      { id: 'firsts', label: 'Primeiras vezes' },
      { id: 'letters', label: 'Cartas especiais' },
    ],
    [],
  );

  const canGenerate =
    exportType === 'full' ||
    (exportType === 'chapter' && selectedChapter) ||
    (exportType === 'series' && selectedSeries);

  const handleGeneratePdf = () => {
    if (!canGenerate || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Exportacao iniciada. Avisaremos quando o PDF estiver pronto.');

      setTimeout(() => {
        toast.success('PDF disponivel para download!', {
          description: 'Confira a central de notificacoes para abrir o arquivo.',
        });
      }, 1500);
    }, 1800);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Exportar album</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 text-sm text-muted-foreground">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <p>
            Gere um PDF com a curadoria do album do bebe. Escolha todo o album, um capitulo
            especifico ou uma serie recorrente como os mesversarios.
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">O que exportar?</Label>
          <Select
            value={exportType}
            onValueChange={(value) => {
              setExportType(value as typeof exportType);
              setSelectedChapter('');
              setSelectedSeries('');
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione o conteudo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Album completo</SelectItem>
              <SelectItem value="chapter">Capitulo especifico</SelectItem>
              <SelectItem value="series">Serie especial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {exportType === 'chapter' && (
          <div>
            <Label className="text-sm font-medium text-foreground">Escolha o capitulo</Label>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um capitulo" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {exportType === 'series' && (
          <div>
            <Label className="text-sm font-medium text-foreground">Escolha a serie</Label>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione uma serie" />
              </SelectTrigger>
              <SelectContent>
                {seriesOptions.map((series) => (
                  <SelectItem key={series.id} value={series.id}>
                    {series.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-3">
          <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Checkbox
              id="include-drafts"
              checked={includeDrafts}
              onCheckedChange={(checked) => setIncludeDrafts(Boolean(checked))}
              className="mt-1"
            />
            <div className="space-y-1 text-sm">
              <p className="text-foreground font-medium">Incluir rascunhos</p>
              <p className="text-muted-foreground">
                Adicione momentos que ainda nao foram publicados oficialmente.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Checkbox
              id="dark-theme"
              checked={useDarkTheme}
              onCheckedChange={(checked) => setUseDarkTheme(Boolean(checked))}
              className="mt-1"
            />
            <div className="space-y-1 text-sm">
              <p className="text-foreground font-medium">Usar tema escuro no PDF</p>
              <p className="text-muted-foreground">
                Perfeito para compartilhamentos digitais com contraste suave.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Checkbox
              id="include-tags"
              checked={includeTags}
              onCheckedChange={(checked) => setIncludeTags(Boolean(checked))}
              className="mt-1"
            />
            <div className="space-y-1 text-sm">
              <p className="text-foreground font-medium">Incluir tags e pessoas</p>
              <p className="text-muted-foreground">
                Destaque marcacoes de familiares, locais e palavras-chave.
              </p>
            </div>
          </label>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <FileText className="w-4 h-4" />
            <span>Resumo da exportacao</span>
          </div>
          <p className="text-muted-foreground">
            Tipo: {exportType === 'full' && 'Album completo'}
            {exportType === 'chapter' && 'Capitulo selecionado'}
            {exportType === 'series' && 'Serie personalizada'}
          </p>
          {exportType === 'chapter' && selectedChapter && (
            <p className="text-muted-foreground">
              Capitulo: {chapters.find((chapter) => chapter.id === selectedChapter)?.name}
            </p>
          )}
          {exportType === 'series' && selectedSeries && (
            <p className="text-muted-foreground">
              Serie: {seriesOptions.find((series) => series.id === selectedSeries)?.label}
            </p>
          )}
          <p className="text-muted-foreground">
            Tema: {useDarkTheme ? 'Escuro' : 'Claro'} • Rascunhos: {includeDrafts ? 'Sim' : 'Nao'} •
            Tags: {includeTags ? 'Sim' : 'Nao'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleGeneratePdf} className="w-full" disabled={isGenerating || !canGenerate}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            'Gerar PDF'
          )}
        </Button>

        {!canGenerate && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Escolha um capitulo ou uma serie para continuar.
          </p>
        )}
      </div>
    </div>
  );
}
