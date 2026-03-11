import React, { useState } from 'react';
import { useGetMe } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const { data } = useGetMe();
  const user = data?.data;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    occupation: user?.occupation || '',
    avatar: user?.avatar || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mutation for updating profile
  const updateProfile = useMutation({
    mutationFn: async (payload: any) => {
      setSaving(true);
      setError('');
      // If avatar file is uploaded, handle upload (mock: just use local URL)
      let avatarUrl = form.avatar;
      if (avatarFile) {
        // In real app, upload to server/cloud and get URL
        avatarUrl = URL.createObjectURL(avatarFile);
      }
      const res = await authService.updateMe({
        name: form.name,
        age: form.age,
        occupation: form.occupation,
        avatar: avatarUrl,
      });
      setSaving(false);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      navigate('/profile');
    },
    onError: (err: any) => {
      setSaving(false);
      setError(err?.message || 'Failed to update profile');
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-background rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Edit Profile</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          updateProfile.mutate(form);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded border bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
            className="w-full px-3 py-2 rounded border bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Occupation</label>
          <input
            type="text"
            value={form.occupation}
            onChange={e => setForm({ ...form, occupation: e.target.value })}
            className="w-full px-3 py-2 rounded border bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0] || null;
              setAvatarFile(file);
              if (file) {
                setForm({ ...form, avatar: URL.createObjectURL(file) });
              }
            }}
            className="w-full px-3 py-2 rounded border bg-background text-foreground"
          />
          {form.avatar && (
            <img src={form.avatar} alt="Avatar preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email (read-only)</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-3 py-2 rounded border bg-background text-foreground opacity-70"
          />
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 bg-primary text-background rounded hover:bg-primary/80 transition"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;