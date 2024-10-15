import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Profile() {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      accountHolderName,
      accountNumber,
      bankName,
      ibanNumber,
      profileDescription,
    });
    setAccountHolderName('');
    setAccountNumber('');
    setBankName('');
    setIbanNumber('');
    setProfileDescription('');
  };

  return (
    <Card className="flex w-full max-w-full flex-col border-none shadow-none sm:w-[300px] md:w-[31.25rem] xl:w-[860px]">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          <Label
            className="mb-2 text-left text-muted-foreground"
            htmlFor="picture"
          >
            Change Avatar
          </Label>
          <Input id="picture" type="file" required />
          <p className="mt-2 text-xs text-muted-foreground dark:text-gray-400">
            PDF, DOCX, JPG, and PNG. Please choose files under 200KB for upload.
          </p>

          <Label
            className="mb-2 mt-6 text-left text-muted-foreground"
            htmlFor="profile-description"
          >
            Profile Description
          </Label>
          <Textarea
            id="profile-description"
            placeholder="Write a short description about yourself"
            value={profileDescription}
            onChange={e => setProfileDescription(e.target.value)}
            required
            rows={4}
            className="mb-4"
          />

          <div className="flex justify-end pt-8">
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
