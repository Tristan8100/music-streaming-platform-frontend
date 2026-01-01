'use client';
import { useState, useEffect } from "react";
import { api2 } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";

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
            getUser();
        } catch (error) {
            console.error(error);
        }
    }

    const updatePassword = async () => {
        try {
            const res = await api2.patch("/users/update-password", password ); //NO KEY VALUE PAIRS
            console.log('ZA USER', res.data);
            getUser();
        } catch (error) {
            console.error(error);
        }
    }

    const uploadPhoto = async () => {
        console.log('CLICKK')
        const data = new FormData();
        const zafile = theRef.current?.files?.[0];
        if (!zafile) {
            //should return error
            return;
        }
        data.append('file', zafile);
        try {
            const res = await api2.post("/users/upload-avatar", data
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('ZA USER', res.data);
            getUser();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="m-4">
            <div className="mt-8">
                <h1 className="text-4xl">Account Settings</h1>
                <p>Manage your account settings</p>
            </div>
            <Separator className="my-4" />
            <div>{user?.name}</div>
            <div>{user?.email}</div>
            <div>{user?.photo_url}</div>
            <img src={user?.photo_url} alt="" />
            <div>name</div>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            <Button onClick={updateUserName}>Save Name</Button>
            <div>password</div>
            <input type="password" placeholder="current password" value={password?.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
            <input type="password" placeholder="new password" value={password?.password} onChange={(e) => setPassword({ ...password, password: e.target.value })} />
            <input type="password" placeholder="confirm password" value={password?.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} />
            <Button onClick={updatePassword}>Save Password</Button>
            <div>Change Photo</div>
            <div className="flex gap-4 border">
                <input type="file" name="file" ref={theRef} />
                <Button onClick={uploadPhoto}>Upload</Button>
            </div>
        </div>
        </>
    );
}