import React, { useRef, useState } from 'react';
import { Camera, Check, Sparkles, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePhotoUploader = () => {
  const inputRef = useRef(null);
  const { user, updateProfile } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      await updateProfile({ profilePhoto: reader.result });
      setShowOptions(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url) => {
    await updateProfile({ profilePhoto: url });
    setShowOptions(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2000);
  };

  const handleRemovePhoto = async () => {
    await updateProfile({ profilePhoto: null });
    setShowOptions(false);
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShowOptions(true)}
          className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-green-400 to-emerald-500 text-white flex items-center justify-center font-heading font-bold text-base shadow-sm ring-2 ring-emerald-300/60 active:scale-95 transition-all"
          title="Change profile photo"
        >
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-extrabold tracking-wider">
              {user?.name?.slice(0, 2).toUpperCase() || 'SK'}
            </span>
          )}
          <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-white" />
          </span>
        </button>

        {/* Small camera badge */}
        <div
          onClick={() => setShowOptions(true)}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer active:scale-90"
          title="Upload photo"
        >
          <Camera className="w-2.5 h-2.5" />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in font-heading font-bold">
          <Check className="w-3.5 h-3.5 text-emerald-300" /> Photo Updated!
        </div>
      )}

      {/* Profile Photo Selection Modal */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-4 shadow-2xl border border-green-200 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" /> Choose Profile Photo
              </h4>
              <button
                onClick={() => setShowOptions(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="app-btn w-full text-xs font-bold py-2.5 mb-3 shadow-xs flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> Upload From Device / Gallery
            </button>

            {/* Presets */}
            <div className="text-[10px] text-slate-500 font-semibold mb-2 uppercase tracking-wider">
              Or Choose an Avatar:
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(url)}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 hover:border-emerald-500 active:scale-95 transition-all shadow-xs"
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {user?.profilePhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="w-full py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
              >
                Remove Custom Photo
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePhotoUploader;