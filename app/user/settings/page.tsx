'use client';
import { useState, useEffect } from "react";
import { api2 } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Upload, Lock, User, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export type UserPublic = {
  email: string;
  name: string;
  photo_url: string;
};

export type UpdatePassword = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function SettingsPage() {
    const [user, setUser] = useState<UserPublic | null>(null);
    const [password, setPassword] = useState<UpdatePassword>({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });
    const theRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        try {
            const res = await api2.get("/users/user-auth");
            setUser(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load user data");
        }
    }

    const updateUserName = async () => {
        if (!user?.name) {
            toast.error("Name cannot be empty");
            return;
        }
        try {
            setLoading(true);
            await api2.patch("/users/update-name", { name: user?.name });
            toast.success('Name updated successfully');
            await getUser();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update name");
        } finally {
            setLoading(false);
        }
    }

    const updatePassword = async () => {
        if (!password.currentPassword || !password.password || !password.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }
        if (password.password !== password.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        try {
            setLoading(true);
            await api2.patch("/users/update-password", password);
            toast.success('Password updated successfully');
            setPassword({ currentPassword: '', password: '', confirmPassword: '' });
            await getUser();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    }

    const uploadPhoto = async () => {
        setLoading(true);
        const data = new FormData();
        const zafile = theRef.current?.files?.[0];
        if (!zafile) {
            toast.error("Please select an image");
            setLoading(false);
            return;
        }
        data.append('file', zafile);
        try {
            await api2.post("/users/upload-avatar", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile photo updated successfully');
            await getUser();
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload photo");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="space-y-4">
                    <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-3xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/user/feed">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </motion.div>

            <Separator />

            {/* Profile Photo Section */}
            <motion.div
                variants={itemVariants}
                className="bg-card border rounded-2xl p-8 space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                        </div>
                        Profile Photo
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Upload a new profile picture to personalize your account
                    </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 rounded-full border-4 border-green-500 border-t-transparent"
                        />
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                        >
                            <Avatar className="w-32 h-32 border-4 border-green-500/20">
                                <AvatarImage src={user?.photo_url} alt={user?.name} />
                                <AvatarFallback className="text-2xl">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                    )}

                    {/* Upload Control */}
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="relative">
                            <Input
                                type="file"
                                ref={theRef}
                                accept="image/*"
                                className="cursor-pointer"
                                disabled={loading}
                            />
                        </div>
                        <Button
                            onClick={uploadPhoto}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 gap-2"
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Upload className="w-4 h-4" />
                                    </motion.div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload Photo
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Account Information Section */}
            <motion.div
                variants={itemVariants}
                className="bg-card border rounded-2xl p-8 space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        Account Information
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Update your personal details
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            Full Name
                        </label>
                        <div className="flex gap-3">
                            <Input
                                type="text"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                placeholder="Enter your name"
                                disabled={loading}
                                className="flex-1"
                            />
                            <Button
                                onClick={updateUserName}
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            value={user.email}
                            disabled
                            className="bg-muted text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Email address cannot be changed. Contact support if needed.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Password Section */}
            <motion.div
                variants={itemVariants}
                className="bg-card border rounded-2xl p-8 space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-purple-600" />
                        </div>
                        Change Password
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Keep your account secure by using a strong password
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            Current Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter current password"
                            value={password?.currentPassword}
                            onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            New Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            value={password?.password}
                            onChange={(e) => setPassword({ ...password, password: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">
                            Confirm Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={password?.confirmPassword}
                            onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        onClick={updatePassword}
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 gap-2"
                    >
                        {loading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Lock className="w-4 h-4" />
                                </motion.div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Update Password
                            </>
                        )}
                    </Button>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                        <p className="font-semibold mb-1">Password Requirements:</p>
                        <ul className="space-y-1 text-xs">
                            <li>• At least 8 characters long</li>
                            <li>• Contains uppercase and lowercase letters</li>
                            <li>• Contains numbers and special characters</li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                variants={itemVariants}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 space-y-4"
            >
                <div>
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                        Irreversible and destructive actions
                    </p>
                </div>
                <Button
                    variant="destructive"
                    className="w-full"
                    disabled={loading}
                >
                    Delete Account
                </Button>
            </motion.div>
        </motion.div>
    );
}