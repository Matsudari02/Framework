import React, { useState, useRef, useEffect } from 'react';
import { useCruntRoll } from '../contexts/CruntRollContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, uploadAvatar } = useCruntRoll();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // 🔥 Atualiza o preview quando o avatar do usuário mudar
  useEffect(() => {
    if (user?.avatar) {
      // Se for relativo, adiciona a base URL
      const avatarUrl = user.avatar.startsWith('http') 
        ? user.avatar 
        : `http://localhost:5000${user.avatar}`;
      setPreview(avatarUrl);
    } else {
      // Se não tiver avatar, usa o placeholder
      setPreview(null);
    }
  }, [user?.avatar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use JPG, PNG, GIF ou WebP.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.warning('Selecione uma imagem primeiro.');
      return;
    }
    setUploading(true);
    try {
      const success = await uploadAvatar(selectedFile);
      if (success) {
        toast.success('Avatar atualizado com sucesso!');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        // O useEffect vai atualizar o preview com o novo avatar
      } else {
        toast.error('Erro ao atualizar avatar.');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    // Volta para o avatar salvo (ou placeholder)
    if (user?.avatar) {
      const avatarUrl = user.avatar.startsWith('http') 
        ? user.avatar 
        : `http://localhost:5000${user.avatar}`;
      setPreview(avatarUrl);
    } else {
      setPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <div className="avatar-section">
          <img
            src={preview || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=f47521&color=fff&size=150`}
            alt="Avatar"
            className="profile-avatar"
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              Selecionar imagem
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              className="btn"
              onClick={handleSave}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Enviando...' : 'Salvar'}
            </button>
            {selectedFile && (
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Membro desde:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;