import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Account Settings</h3>
          <button className="px-4 py-2 bg-primary text-background rounded hover:bg-primary/80 transition">Change Password</button>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">Theme</h3>
          <p className="text-muted-foreground">Dark mode is enabled by default.</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">Notifications</h3>
          <p className="text-muted-foreground">Notification settings coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;