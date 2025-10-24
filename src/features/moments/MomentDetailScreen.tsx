import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users as UsersIcon,
  Tag,
  Lock,
  Edit,
} from "lucide-react";
import { motion } from "motion/react";
import { useBabyData } from "@/lib/baby-data-context";
import type { Moment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaCarousel } from "@/components/shared/MediaCarousel";

interface MomentDetailScreenProps {
  moment: Moment;
  onBack: () => void;
  onEdit?: () => void;
}

export function MomentDetailScreen({
  moment,
  onBack,
  onEdit,
}: MomentDetailScreenProps) {
  const { chapters } = useBabyData();
  const chapter = chapters.find((c) => c.id === moment.chapterId);

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {chapter && (
              <Badge
                className="text-white"
                style={{ backgroundColor: chapter.color }}
              >
                {chapter.icon} {chapter.name}
              </Badge>
            )}
            {moment.privacy === "private" && (
              <Badge variant="outline" className="gap-1">
                <Lock className="w-3 h-3" />
                Privado
              </Badge>
            )}
          </div>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Media Gallery */}
        {moment.media && moment.media.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <MediaCarousel
              items={moment.media}
              aspectRatioClass="aspect-[4/3]"
              roundedClass="rounded-2xl"
            />
          </motion.div>
        )}

        {/* Title and Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-foreground mb-2">{moment.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(moment.date).toLocaleDateString("pt-BR", {
                  dateStyle: "long",
                })}
              </span>
            </div>
            <span>·</span>
            <span>{moment.age}</span>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-3 mb-6">
          {moment.location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border"
            >
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Local</span>
              </div>
              <p className="text-foreground">{moment.location}</p>
            </motion.div>
          )}

          {moment.people && moment.people.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border"
            >
              <div className="flex items-center gap-2 text-secondary mb-2">
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">Pessoas Presentes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {moment.people.map((person, index) => (
                  <Badge key={index} variant="secondary">
                    {person}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {moment.tags && moment.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border"
            >
              <div className="flex items-center gap-2 text-primary mb-2">
                <Tag className="w-4 h-4" />
                <span className="text-sm">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {moment.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
