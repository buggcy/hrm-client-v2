'use client';
import React, { memo, useEffect } from 'react';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { Mic, Palmtree, Puzzle, Rocket, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useUserQuery } from '@/hooks';

import {
  COMFORTABLE_SCRIPT,
  DEFAULT_SCRIPT,
  IMPROVISATION_SCRIPT,
  UPBEAT_SCRIPT,
} from './constants';

type Topic = 'Narrator' | 'Upbeat' | 'Comfortable' | 'Improvisation';

interface TopicCardProps {
  topic: Topic;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  description,
  icon,
  isSelected,
  onSelect,
}) => (
  <Card
    className={`cursor-pointer transition-all ${
      isSelected
        ? 'outline outline-2 outline-offset-2 outline-primary'
        : 'hover:bg-gray-50'
    }`}
    onClick={() => onSelect(topic)}
    tabIndex={0}
  >
    <CardContent className="flex flex-col items-center p-6 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h3 className="mb-2 font-semibold">{topic}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

const topics = [
  {
    topic: 'Narrator',
    description: 'Read the default script',
    icon: <Mic size={24} />,
    text: DEFAULT_SCRIPT,
    title: 'Default Script ',
  },
  {
    topic: 'Upbeat',
    description:
      'Read an exciting story and express the full range of emotions',
    icon: <Rocket size={24} />,
    text: UPBEAT_SCRIPT,
    title: 'Upbeat Script',
  },
  {
    topic: 'Comfortable',
    description: 'Read about a relaxing summer weekend',
    icon: <Palmtree size={24} />,
    text: COMFORTABLE_SCRIPT,
    title: 'Comfortable Script',
  },
  {
    topic: 'Improvisation',
    description: 'Tell your own story',
    icon: <Trophy size={24} />,
    text: IMPROVISATION_SCRIPT,
    title: 'Improvisation',
  },
] as const;

interface TopicDialogProps {
  selectedTopic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicDialog: React.FC<TopicDialogProps> = ({
  selectedTopic: initialSelectedTopic,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedTopic, setSelectedTopic] =
    React.useState<Topic>(initialSelectedTopic);

  useEffect(() => {
    setSelectedTopic(initialSelectedTopic);
  }, [initialSelectedTopic, open]);

  const handleSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleChoose = () => {
    onSelect(selectedTopic);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Puzzle className="size-5" /> Topic Ideas
        </Button>
      </DialogTrigger>
      <DialogContent className="p-8 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Topic Ideas
          </DialogTitle>
        </DialogHeader>
        <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
          Pick a topic you can talk about genuinely and confidently for at least
          45 seconds.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {topics.map(topic => (
            <TopicCard
              key={topic.topic}
              {...topic}
              isSelected={selectedTopic === topic.topic}
              onSelect={handleSelect}
            />
          ))}
        </div>
        <DialogFooter>
          <Button className="mx-auto" onClick={handleChoose}>
            Choose Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ScriptBlock = memo(() => {
  const user = useUserQuery();
  const [selectedTopic, setSelectedTopic] = React.useState<Topic>(
    () => topics[0].topic,
  );
  const topic = topics.find(t => t.topic === selectedTopic);

  return (
    <div className="rounded-md border p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{topic!.title}</h3>
          <TopicDialog
            selectedTopic={selectedTopic}
            onSelect={setSelectedTopic}
          />
        </div>
        <div className="flex max-h-45 flex-col gap-6 overflow-auto text-lg font-medium">
          <p
            dangerouslySetInnerHTML={{
              __html: topic!.text.replace(
                '{{Full Name}}',
                `${user.data!.first_name} ${user.data!.last_name}`,
              ),
            }}
          ></p>
        </div>
      </div>
    </div>
  );
});

ScriptBlock.displayName = 'ScriptBlock';
