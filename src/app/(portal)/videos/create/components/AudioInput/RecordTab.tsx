import { Mic, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { formatTime } from '@/utils';

import {
  useAudioRecorder,
  useMicrophones,
  useVideoGenerateFilesStore,
  useVideoGenerateFormStore,
} from '../../hooks';
import { AudioTab } from '../../types';

const MINIMUM_RECORDING_DURATION = 3;

export const RecordTab = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { microphones, selectedMicrophone, setSelectedMicrophone } =
    useMicrophones();
  const { isRecording, record, stop, duration, cancel } = useAudioRecorder(
    selectedMicrophone?.deviceId,
  );
  const setForm = useVideoGenerateFormStore(store => store.set);
  const setFormFiles = useVideoGenerateFilesStore(store => store.set);

  const handleClick = () => {
    if (isRecording) stop();
    else
      record()
        .then(result => {
          if (!result) return;

          if (result.duration < MINIMUM_RECORDING_DURATION)
            toast({
              title: t('portal.videos.create.audio.input.error.short.title'),
              description: t(
                'portal.videos.create.audio.input.error.short.description',
                {
                  duration: MINIMUM_RECORDING_DURATION,
                },
              ),
            });
          // TODO: add validation for audio length
          else
            setFormFiles({
              audio: {
                file: result.file,
                duration: result.duration,
                url: URL.createObjectURL(result.file),
              },
            });
        })
        .catch(() => {
          toast({
            title: t('ui.toast.title.somethingWentWrong'),
            description: t('portal.videos.create.audio.input.error.permission'),
          });
        });
  };

  const handleBack = () => {
    setForm({ audioTab: AudioTab.UPLOAD });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 pt-6">
      <Button
        type="button"
        className="size-16 rounded-full p-3 text-white shadow-icon-button"
        onClick={handleClick}
      >
        {isRecording ? <Square fill="white" size={24} /> : <Mic size={32} />}
      </Button>

      {isRecording && <p className="py-2">{formatTime(duration)}</p>}
      {!isRecording && (
        <Select
          disabled={!microphones.length}
          value={selectedMicrophone?.deviceId}
          onValueChange={deviceId => {
            setSelectedMicrophone(
              microphones.find(mic => mic.deviceId === deviceId)!,
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              // TODO: add placeholder when we don't have devices list
              placeholder={t('portal.videos.create.audio.select.placeholder')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {microphones.map(microphone => (
                <SelectItem
                  key={microphone.deviceId}
                  value={microphone.deviceId}
                >
                  {microphone.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {!isRecording && (
        <Button variant="outline" onClick={handleBack} type="button">
          {t('ui.button.back')}
        </Button>
      )}
      {isRecording && (
        <Button type="button" variant="outline" onClick={cancel}>
          {t('ui.button.cancel')}
        </Button>
      )}
    </div>
  );
};
