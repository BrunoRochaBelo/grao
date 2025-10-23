import { useState } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Shield, Users, UserPen } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { babies, getCurrentBaby } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface ManageAccountScreenProps {
  onBack: () => void;
}

export function ManageAccountScreen({ onBack }: ManageAccountScreenProps) {
  const [name, setName] = useState('Bruno Oliveira');
  const [email, setEmail] = useState('bruno@example.com');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createdAt = '22/03/2024';

  const linkedBabies = babies.filter((baby) => !baby.isActive);
  const activeBaby = getCurrentBaby();
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString();
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    toast.success('Nome atualizado com sucesso.');
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    toast.success('Email atualizado com sucesso.');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos da senha.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas novas precisam ser iguais.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
    toast.success('Senha alterada com sucesso.');
  };

  const handleSignOut = () => {
    const confirmed = window.confirm('Tem certeza que deseja sair da conta?');
    if (!confirmed) return;
    toast.success('Voce saiu da conta. Redirecionando para login...');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Excluir conta e uma acao permanente. Deseja continuar mesmo assim?',
    );
    if (!confirmed) return;
    toast.success('Conta excluida (simulacao).');
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Sua conta</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-2 mb-6">
        <p className="text-sm text-muted-foreground">Responsavel</p>
        <p className="text-lg font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">Conta criada em {createdAt}</p>
      </div>

      <div className="space-y-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <UserPen className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Dados pessoais</span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nome</Label>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button size="sm" onClick={handleSaveName}>
                  Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full bg-muted/50 rounded-lg border border-dashed border-border px-3 py-2 text-left flex items-center justify-between text-sm"
                onClick={() => setIsEditingName(true)}
              >
                <span>{name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Email</Label>
            {isEditingEmail ? (
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEmail}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingEmail(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="w-full bg-muted/50 rounded-lg border border-dashed border-border px-3 py-2 text-left flex items-center justify-between text-sm"
                onClick={() => setIsEditingEmail(true)}
              >
                <span>{email}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Seguranca</span>
          </div>

          {isEditingPassword ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="current-password">Senha atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleChangePassword}>
                  Salvar nova senha
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingPassword(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full bg-muted/50 rounded-lg border border-dashed border-border px-3 py-2 text-left flex items-center justify-between text-sm"
              onClick={() => setIsEditingPassword(true)}
            >
              <span>Alterar senha</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <Button variant="ghost" className="text-destructive justify-start" onClick={handleDeleteAccount}>
            Excluir conta
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Outros bebes vinculados</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeBaby.name} esta definido como perfil principal neste dispositivo.
          </p>
          {linkedBabies.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {linkedBabies.map((baby) => (
                <li key={baby.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span>{baby.name}</span>
                  <span className="text-xs">Criado em {formatDate(baby.birthDate)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">
              Nenhum outro perfil vinculado.
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
