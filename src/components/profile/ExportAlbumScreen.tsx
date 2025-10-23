import { useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface ExportAlbumScreenProps {
  onBack: () => void;
}

export function ExportAlbumScreen({ onBack }: ExportAlbumScreenProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, you would trigger a download or show a link.
      alert('PDF gerado com sucesso! (simulação)');
    }, 2000);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Exportar Álbum</h1>
      </div>

      <div className="space-y-6">
        <div>
          <Label>O que exportar?</Label>
          <Select defaultValue="full">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o que exportar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Álbum completo</SelectItem>
              <SelectItem value="chapter">Capítulo específico</SelectItem>
              <SelectItem value="series">Série específica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="include-drafts" />
          <Label htmlFor="include-drafts">Incluir rascunhos?</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="dark-theme" />
          <Label htmlFor="dark-theme">Tema escuro no PDF?</Label>
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleGeneratePdf} className="w-full" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            'Gerar PDF'
          )}
        </Button>
      </div>
    </div>
  );
}
