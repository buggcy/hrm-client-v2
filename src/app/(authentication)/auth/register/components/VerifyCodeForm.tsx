import * as React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Details } from './Details';
import { ExperienceTable } from './Experience';
import { KYC } from './KYC';

export function VerifyCodeForm() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Verify Code',
    'Personal Details',
    'KYC',
    'Educational Document',
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <Card className="min-w-[700px]">
      <CardHeader>
        <div className="flex justify-center">
          <div className="flex w-[650px] justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm ${
                  activeStep === index
                    ? 'bg-blue-500 font-medium text-white'
                    : 'bg-muted font-medium text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form>
          {activeStep === 0 && (
            <div className="mx-auto grid w-9/12 items-center gap-4">
              <CardTitle className="pt-8 text-center">Verify Code</CardTitle>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Enter your code</Label>
                <Input id="code" placeholder="Enter your code" />
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="mx-auto grid w-full items-center gap-4">
              <Details />
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid w-full items-center gap-4">
              <KYC />
            </div>
          )}

          {activeStep === 3 && (
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <ExperienceTable />
              </div>
            </div>
          )}
        </form>
      </CardContent>

      {activeStep === 0 && (
        <CardFooter className="flex justify-between">
          <Button className="mx-auto w-9/12" type="submit">
            Verify Code
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
