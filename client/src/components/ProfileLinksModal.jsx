import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import {
  FaLinkedin,
  FaGithub,
  FaReddit,
  FaDiscord,
  FaQuora,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const socialFields = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <FaLinkedin size={16} />,
    color: "#0077B5",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "github",
    label: "GitHub",
    icon: <FaGithub size={16} />,
    color: "#6e5494",
    placeholder: "https://github.com/username",
  },
  {
    key: "reddit",
    label: "Reddit",
    icon: <FaReddit size={16} />,
    color: "#FF4500",
    placeholder: "https://reddit.com/u/username",
  },
  {
    key: "discord",
    label: "Discord",
    icon: <FaDiscord size={16} />,
    color: "#5865F2",
    placeholder: "Discord username",
  },
  {
    key: "quora",
    label: "Quora",
    icon: <FaQuora size={16} />,
    color: "#B92B27",
    placeholder: "https://quora.com/profile/username",
  },
];

const ProfileLinksModal = ({ isOpen, onClose }) => {
  const { user, updateSocialLinks, updateProfile } = useAuth();
  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    reddit: "",
    discord: "",
    quora: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const avatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Mia",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Jude",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aiden",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe"
  ];

  // Sync form with user data when modal opens
  useEffect(() => {
    if (isOpen && user?.socialLinks) {
      setLinks({
        linkedin: user.socialLinks.linkedin || "",
        github: user.socialLinks.github || "",
        reddit: user.socialLinks.reddit || "",
        discord: user.socialLinks.discord || "",
        quora: user.socialLinks.quora || "",
      });
      setSelectedAvatar(user.avatar || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
    setError("");
    setSuccess(false);
  }, [isOpen, user]);

  const handleChange = (key, value) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateSocialLinks(links);
      const profileUpdates = {};
      if (selectedAvatar !== user.avatar) profileUpdates.avatar = selectedAvatar;
      if (username.trim() !== user.username) profileUpdates.username = username.trim();
      if (email.trim().toLowerCase() !== user.email) profileUpdates.email = email.trim().toLowerCase();
      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(profileUpdates);
      }
      setSuccess(true);
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-surface rounded-2xl shadow-float w-full max-w-md p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-main">
                  Edit Profile
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Update your avatar and social links
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-text-muted hover:text-text-main"
              >
                <X size={18} />
              </button>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); setSuccess(false); }}
                  className="w-full px-3 py-2 bg-background shadow-inner rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder-text-muted text-text-main"
                  placeholder="Your username"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(false); }}
                  className="w-full px-3 py-2 bg-background shadow-inner rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder-text-muted text-text-main"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-main mb-3">
                Select Avatar
              </label>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => {
                        setSelectedAvatar(avatar);
                        setError("");
                        setSuccess(false);
                    }}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === avatar
                        ? "border-primary scale-110 shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover bg-surface-hover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Social Link Inputs */}
            <div className="space-y-3">
              {socialFields.map(({ key, label, icon, color, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color + "18", color }}
                  >
                    {icon}
                  </div>
                  <input
                    type="text"
                    value={links[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-background shadow-inner rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder-text-muted text-text-main"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Error / Success Messages */}
            {error && (
              <div className="mt-4 bg-red-500/10 text-red-400 px-4 py-2.5 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 bg-green-500/10 text-green-400 px-4 py-2.5 rounded-xl text-sm">
                Profile saved successfully!
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileLinksModal;
