import { useState } from 'react';
import { X, Camera, MapPin, Users, Lock, Tag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PlaceholderTemplate, addMoment, calculateAge, currentBaby, Chapter } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface MomentFormProps {
  isOpen: boolean;
  onClose: () => void;
  template: PlaceholderTemplate;
  chapter: Chapter;
  onSave?: () => void;
}

export function MomentForm({ isOpen, onClose, template, chapter, onSave }: MomentFormProps) {
  const [title, setTitle] = useState(template.name);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('');
  const [noteShort, setNoteShort] = useState('');
  const [noteLong, setNoteLong] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'people' | 'link'>('private');
  const [isSaving, setIsSaving] = useState(false);

  const calculatedAge = calculateAge(currentBaby.birthDate, date);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (status: 'published' | 'draft') => {
    if (!title.trim()) {
      toast.error('Preencha o campo obrigatório: Título');
      return;
    }

    setIsSaving(true);

    try {
      const momentDate = `${date}T${time}:00`;
      
      addMoment({
        chapterId: chapter.id,
        templateId: template.id,
        title: title.trim(),
        date: momentDate,
        age: calculatedAge,
        location: location.trim() || undefined,
        people: people.trim() ? people.split(',').map(p => p.trim()) : undefined,
        media: [], // Would be populated with uploaded images
        noteShort: noteShort.trim() || undefined,
        noteLong: noteLong.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        privacy,
        status,
      });

      toast.success(
        status === 'published' 
          ? `${template.icon} ${template.name} registrado com sucesso!`
          : 'Rascunho salvo com sucesso'
      );
      
      if (onSave) onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar momento. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (title !== template.name || noteShort || noteLong || tags.length > 0) {
      if (confirm('Descartar alterações?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Form Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h2 className="text-foreground">{template.name}</h2>
                  <p className="text-muted-foreground text-sm">{chapter.name}</p>
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

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Media Upload */}
                <div>
                  <Label>Fotos e Vídeos</Label>
                  <button className="w-full h-40 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Adicionar mídia</span>
                  </button>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Conte este momento em uma frase..."
                    className="mt-1"
                  />
                </div>

                {/* Date and Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      className="mt-1"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      className="mt-1"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Calculated Age Display */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <p className="text-muted-foreground text-sm mb-1">Idade no momento</p>
                  <p className="text-foreground">{calculatedAge}</p>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Local</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Onde aconteceu?"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* People */}
                <div>
                  <Label htmlFor="people">Pessoas</Label>
                  <div className="relative mt-1">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="people"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      placeholder="Quem estava presente? (separe por vírgula)"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Short Note */}
                <div>
                  <Label htmlFor="noteShort">Nota Curta</Label>
                  <Input
                    id="noteShort"
                    value={noteShort}
                    onChange={(e) => setNoteShort(e.target.value)}
                    placeholder="Descreva em poucas palavras..."
                    className="mt-1"
                  />
                </div>

                {/* Long Note */}
                <div>
                  <Label htmlFor="noteLong">Nota Detalhada</Label>
                  <Textarea
                    id="noteLong"
                    value={noteLong}
                    onChange={(e) => setNoteLong(e.target.value)}
                    placeholder="Quer registrar mais detalhes?"
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mt-1 mb-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Adicione uma tag"
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleAddTag} type="button" variant="secondary">
                      Adicionar
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy */}
                <div>
                  <Label>Privacidade</Label>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPrivacy('private')}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm transition-colors ${
                        privacy === 'private'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Lock className="w-4 h-4 inline-block mr-1" />
                      Privado
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacy('people')}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm transition-colors ${
                        privacy === 'people'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Pessoas
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacy('link')}
                      className={`flex-1 py-2 px-3 rounded-xl text-sm transition-colors ${
                        privacy === 'link'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border space-y-2">
              <Button
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="w-full h-12"
                size="lg"
              >
                {isSaving ? (
                  'Salvando...'
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Salvar Momento
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDiscard}
                  disabled={isSaving}
                >
                  Descartar
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                >
                  Salvar Rascunho
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
