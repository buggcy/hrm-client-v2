import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function KYC() {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      accountHolderName,
      accountNumber,
      bankName,
      ibanNumber,
    });
    setAccountHolderName('');
    setAccountNumber('');
    setBankName('');
    setIbanNumber('');
  };

  return (
    <Card className="w-[1110px] border-none shadow-none">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="account-holder-name" className="mb-2 text-left">
                Account Holder Name
              </Label>
              <Input
                id="account-holder-name"
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                placeholder="Account Holder Name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="account-number" className="mb-2 text-left">
                Account Number
              </Label>
              <Input
                id="account-number"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                required
                type="text"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="bank-name" className="mb-2 text-left">
                Bank Name
              </Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="Bank Name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="iban-number" className="mb-2 text-left">
                IBAN Number
              </Label>
              <Input
                id="iban-number"
                value={ibanNumber}
                onChange={e => setIbanNumber(e.target.value)}
                placeholder="PK12ABCD3456789012345678"
                required
                type="text"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardHeader>
        <CardTitle>CNIC Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex w-[241.5px] flex-col">
              <Label htmlFor="cnic-number" className="mb-2 text-left">
                CNIC Number
              </Label>
              <Input
                id="cnic-number"
                placeholder="CNIC Number"
                required
                type="number"
                inputMode="numeric"
                min="0"
              />
            </div>
            <div className="flex w-[241.5px] flex-col">
              <Label className="mb-2 text-left" htmlFor="picture">
                Front Image CNIC
              </Label>
              <Input id="picture" type="file" required />
            </div>
            <div className="flex w-[241.5px] flex-col">
              <Label className="mb-2 text-left" htmlFor="picture">
                Back Image CNIC
              </Label>
              <Input id="picture" type="file" required />
            </div>
          </div>
          <div className="flex justify-end pt-8">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
