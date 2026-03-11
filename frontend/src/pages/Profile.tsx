import React from 'react';
import { useGetMe } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { data, isLoading, isError } = useGetMe();
  const user = data?.data;
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6 mt-8 text-center text-muted-foreground">Loading profile...</div>;
  }
  if (isError || !user) {
    return <div className="max-w-2xl mx-auto p-6 mt-8 text-center text-destructive">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-lg mt-8">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={user.avatar || '/logo.png'}
          alt="User avatar"
          className="w-20 h-20 rounded-full border-4 border-primary object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
            User
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-foreground">Personal Details</h3>
          <ul className="mt-2 text-muted-foreground text-sm">
            <li><span className="font-medium text-foreground">Name:</span> {user.name}</li>
            <li><span className="font-medium text-foreground">Age:</span> {user.age || '-'} </li>
            <li><span className="font-medium text-foreground">Occupation:</span> {user.occupation || '-'} </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Account Details</h3>
          <ul className="mt-2 text-muted-foreground text-sm">
            <li><span className="font-medium text-foreground">Email:</span> {user.email}</li>
            <li><span className="font-medium text-foreground">User ID:</span> {user._id}</li>
            <li><span className="font-medium text-foreground">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-right">
        <button className="px-4 py-2 bg-primary text-background rounded hover:bg-primary/80 transition" onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
