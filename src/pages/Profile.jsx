import React, { useState, useRef } from 'react';
import { useCruntRoll } from '../contexts/CruntRollContext';
import { showSuccess, showError } from '../components/ToastWrapper';

const Profile = () => {
  const { user, uploadAvatar } = useCruntRoll();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('A imagem deve ter no máximo 5MB');
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      showError('Formato não permitido. Use JPG, PNG ou GIF.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload automático
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await uploadAvatar(file);
      showSuccess('Avatar atualizado com sucesso!');
      setPreview(null);
    } catch (error) {
      showError(error.message || 'Erro ao enviar avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="loading">Carregando...</div>;

  return (
    <div className="profile-container">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <div className="avatar-section">
          <img
            src={user.avatar ? `http://localhost:5000${user.avatar}` : '/default-avatar.png'}
            alt="Avatar"
            className="profile-avatar"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button
            className="btn"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? 'Enviando...' : 'Alterar Avatar'}
          </button>
          {preview && (
            <div className="preview-container">
              <p>Pré-visualização:</p>
              <img src={preview} alt="Preview" className="preview-avatar" />
            </div>
          )}
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>Membro desde:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;