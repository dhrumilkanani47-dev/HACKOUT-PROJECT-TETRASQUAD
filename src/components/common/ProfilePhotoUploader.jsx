import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePhotoUploader = () => {
  const inputRef = useRef(null);
  const { user, updateProfile } = useAuth();

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateProfile({ profilePhoto: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-green-400 to-emerald-500 text-white flex items-center justify-center font-heading font-bold text-base shadow-sm"
        aria-label="Add profile photo"
      >
        {user?.profilePhoto ? (
          <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          user?.name?.slice(0, 2).toUpperCase() || 'EG'
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 opacity-0 hover:opacity-100 transition-opacity">
          <Camera className="w-4 h-4" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
    </>
  );
};

export default ProfilePhotoUploader;