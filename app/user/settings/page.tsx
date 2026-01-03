'use client';
import { useState, useEffect } from "react";
import { api2 } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"

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
            console.log('ZA USER', res.data);
            setUser(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const updateUserName = async () => {
        try {
            const res = await api2.patch("/users/update-name", { name: user?.name });
            console.log('ZA USER', res.data);
            toast.success('Name updated successfully');
            getUser();
        } catch (error) {
            console.error(error);
        }
    }

    const updatePassword = async () => {
        try {
            const res = await api2.patch("/users/update-password", password);
            console.log('ZA USER', res.data);
            getUser();
        } catch (error) {
            console.error(error);
        }
    }

    const uploadPhoto = async () => {
        setLoading(true);
        console.log('CLICKK')
        const data = new FormData();
        const zafile = theRef.current?.files?.[0];
        if (!zafile) {
            return;
        }
        data.append('file', zafile);
        try {
            const res = await api2.post("/users/upload-avatar", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('ZA USER', res.data);
            setUser(null);
            getUser();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        //toast.success('Welcome back, ' + user?.name);
        getUser();
    }, []);

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
                <p className="text-gray-600">Manage your account settings</p>
            </div>

            <Separator className="mb-6" />

            {/* Profile */}
            <div className="bg-white border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
                <div className="flex items-center gap-6">
                    {loading ?
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                        :
                        <img src={user?.photo_url} alt="Profile" className="rounded-full w-32 h-32 object-cover" />
                    }
                    <div className="flex flex-col gap-3">
                        <input type="file" name="file" ref={theRef} className="text-sm" />
                        <Button onClick={uploadPhoto} className="w-fit">Upload Photo</Button>
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Account */}
            <div className="bg-white border rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={user.name} 
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button onClick={updateUserName} disabled={loading}>Save</Button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Password*/}
            <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter current password" 
                            value={password?.currentPassword} 
                            onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter new password" 
                            value={password?.password} 
                            onChange={(e) => setPassword({ ...password, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            value={password?.confirmPassword} 
                            onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button onClick={updatePassword} className="w-full" disabled={loading}>Update Password</Button>
                </div>
            </div>
        </div>
    );
}