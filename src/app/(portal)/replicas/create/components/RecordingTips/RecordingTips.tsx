import { useState } from 'react';

import MuxPlayer from '@mux/mux-player-react';
import {
  ArrowUpRight,
  Check,
  Focus,
  Glasses,
  Hand,
  HeadsetIcon,
  Shirt,
  Smartphone,
  Sun,
  VideoIcon,
  Volume2,
  XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useMediaQuery } from '@/hooks';
import { cn } from '@/utils';

export function RecordingTips({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl content-start">
          <DialogHeader>
            <DialogTitle className="text-center">
              Prepare your recording environment
            </DialogTitle>
          </DialogHeader>
          <RecordingTipsComponent />
          <DialogFooter className="pt-4">
            <div className="flex w-full flex-col items-center justify-center gap-8">
              <div className="inline-flex items-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Here you can find more detailed
                </p>
                <Button
                  variant="link"
                  className="h-5 gap-1 p-1 font-bold text-foreground underline"
                  asChild
                >
                  <a
                    href="https://docs.tavus.io/sections/replicas/best-practices-and-examples"
                    target="blank"
                    rel="noreferrer"
                  >
                    Best Practices
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </div>
              <DialogClose asChild>
                <Button>I Understand</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Prepare your recording environment</DrawerTitle>
        </DrawerHeader>
        <RecordingTipsComponent />
        <DrawerFooter className="pt-2">
          <div className="inline-flex items-center py-2">
            <p className="text-sm font-medium text-muted-foreground">
              Here you can find more detailed
            </p>
            <Button
              variant="link"
              className="h-5 gap-1 p-1 font-bold text-foreground underline"
              asChild
            >
              <a
                href="https://docs.tavus.io/sections/replicas/best-practices-and-examples"
                target="blank"
                rel="noreferrer"
              >
                Best Practices
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
          <DrawerClose asChild>
            <Button>I understand</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const doArr = [
  {
    icon: VideoIcon,
    text: 'Set up your <strong>HD camera</strong> or recording software',
  },
  {
    icon: Smartphone,
    text: 'If using a smartphone, film in <strong>landscape</strong>',
  },
  {
    icon: Focus,
    text: 'Make sure your <strong>face & upper body</strong> are in <strong>focus</strong>',
  },
  {
    icon: Sun,
    text: 'Ensure the <strong>recording space</strong> is quiet and well-lit',
  },
  {
    icon: Volume2,
    text: 'Speak <strong>naturally</strong>, we&apos;ll capture <strong>tone & emotion</strong>',
  },
];

const AvoidHeadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
  >
    <circle cx="12.5" cy="12" r="9.25" stroke="#EF4444" strokeWidth="1.5" />
    <path
      d="M3.3281 15.3591L5.54234 14.2703C5.56917 14.2571 5.58616 14.2298 5.58616 14.1999L5.5862 12.927C5.58625 11.4119 5.63938 9.39895 7.15439 9.3835V9.3835C8.21934 9.37264 8.40885 11.1613 8.40885 12.2263V12.2263C8.40885 12.2543 8.43156 12.2771 8.45957 12.2771H10.796C11.3482 12.2771 11.796 11.8294 11.796 11.2771V8.254C11.796 7.72813 12.8689 7.28877 13.3385 7.52548C14.7511 8.23756 17.1455 8.66905 20.8282 7.83268"
      stroke="#EF4444"
      strokeWidth="1.5"
    />
    <circle cx="17.0781" cy="13.25" r="1.25" fill="#EF4444" />
  </svg>
);

const doNotArr = [
  {
    icon: Shirt,
    text: 'Avoid clothes that blend into the background',
  },
  {
    icon: Glasses,
    text: 'Avoid accessories that block your head & face like hats, earrings, or thick glasses.',
  },
  {
    icon: HeadsetIcon,
    text: 'Don&apos;t turn your head away from the camera',
  },
  {
    icon: AvoidHeadIcon,
    text: 'Avoid backgrounds that are busy or moving',
  },
  {
    icon: Hand,
    text: 'Don&apos;t move around too much or exaggerate movements, like waving your hands',
  },
];

function RecordingTipsComponent() {
  return (
    <div className="flex">
      <Tabs
        defaultValue="text"
        className="flex w-full flex-col items-center justify-center"
      >
        <TabsList>
          <TabsTrigger className="px-6" value="text">
            Text Tips
          </TabsTrigger>
          <TabsTrigger className="px-6" value="video">
            Video Tips
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                  <span className="rounded-full bg-success p-1 text-center">
                    <Check className="size-4 text-background" />
                  </span>
                  <CardTitle className="text-lg">Do&apos;s</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  {doArr.map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>
                        <Icon
                          className={cn('size-6 text-success', {
                            '-rotate-90': index === 1,
                          })}
                        />
                      </span>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                  <span className="rounded-full bg-destructive p-1 text-center">
                    <XIcon className="size-4 text-background" />
                  </span>
                  <CardTitle className="text-lg">Dont&apos;s</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 p-4 pt-0">
                  {doNotArr.map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>
                        <Icon className={cn('size-6 text-destructive')} />
                      </span>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="video" className="mt-8">
          <MuxPlayer
            className="h-64 overflow-hidden rounded-md"
            src="https://stream.mux.com/OiWxgih49NGrbvObft01CS01UcVOo97TOEt2oOYBAH00gU.m3u8?redundant_streams=true"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
