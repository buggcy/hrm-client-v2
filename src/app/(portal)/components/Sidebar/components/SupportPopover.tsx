import { ArrowUpRight, CircleHelp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DISCORD_LINK = 'https://discord.gg/5Y9Er6WNN5';
const API_DOCS_LINK = 'https://docs.tavusapi.com/';
const DEVELOPER_SUPPORT_LINK = 'mailto:developer-support@tavus.io';

export const SupportPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start overflow-hidden pl-2.5 transition-all duration-200 group-hover:w-52 sm:size-10"
        >
          <div className="flex w-52 items-center gap-2">
            <CircleHelp className="size-5" />
            <span className="transition-all duration-200 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
              Support
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[13.5rem] p-2">
        <ul className="flex flex-col gap-1">
          <li className="flex">
            <Button
              asChild
              variant="ghost"
              className="h-9 w-full justify-between p-2"
            >
              <a href={API_DOCS_LINK} target="_blank">
                Documentation
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="ghost"
              className="h-9 w-full justify-between p-2"
            >
              <a href={DEVELOPER_SUPPORT_LINK} target="_blank">
                Contact Us
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="ghost"
              className="h-9 w-full justify-between p-2"
            >
              <a href={DISCORD_LINK} target="_blank">
                Join Discord
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
