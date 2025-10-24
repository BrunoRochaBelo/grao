import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyMember, getMoments, chapters } from '../../lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

interface FamilyMemberDetailScreenProps {
  member: FamilyMember;
  onBack: () => void;
  onSelectMoment?: (momentId: string) => void;
}

export function FamilyMemberDetailScreen({ member, onBack, onSelectMoment }: FamilyMemberDetailScreenProps) {
  const allMoments = getMoments();
  
  // Filter moments where this member participated
  const memberMoments = allMoments.filter(moment => 
    moment.people?.some(person => 
      person.toLowerCase() === member.name.toLowerCase()
    )
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else if (months < 0) {
      return `${years - 1} ${years - 1 === 1 ? 'ano' : 'anos'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  };

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
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Member Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-foreground mb-1">{member.name}</h1>
              <p className="text-muted-foreground">{member.relation}</p>
              {member.birthDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getAge(member.birthDate)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl text-foreground">{memberMoments.length}</p>
              <p className="text-sm text-muted-foreground">Momentos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-foreground">
                {new Set(memberMoments.map(m => m.chapterId)).size}
              </p>
              <p className="text-sm text-muted-foreground">Capítulos</p>
            </div>
          </div>
        </motion.div>

        {/* Moments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-foreground mb-3">Momentos com {member.name.split(' ')[0]}</h2>
          
          {memberMoments.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum momento registrado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {memberMoments.map((moment, index) => {
                const chapter = chapters.find(c => c.id === moment.chapterId);
                
                return (
                  <motion.div
                    key={moment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => onSelectMoment?.(moment.id)}
                    className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {moment.media && moment.media.length > 0 && (
                      <div className="aspect-[3/2] overflow-hidden">
                        <img
                          src={moment.media[0]}
                          alt={moment.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-foreground flex-1">{moment.title}</h3>
                        {chapter && (
                          <Badge
                            className="text-white ml-2"
                            style={{ backgroundColor: chapter.color }}
                          >
                            {chapter.icon}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(moment.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span>·</span>
                        <span>{moment.age}</span>
                      </div>

                      {moment.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                          <MapPin className="w-3 h-3" />
                          <span>{moment.location}</span>
                        </div>
                      )}

                      {moment.people && moment.people.length > 1 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {moment.people
                            .filter(p => p.toLowerCase() !== member.name.toLowerCase())
                            .slice(0, 3)
                            .map((person, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {person}
                              </Badge>
                            ))}
                          {moment.people.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{moment.people.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
