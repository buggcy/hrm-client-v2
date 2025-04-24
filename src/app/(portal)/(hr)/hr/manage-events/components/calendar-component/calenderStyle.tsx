import { MyEvent } from '@/libs/validations/employee';

export const eventStyleGetter = (event: MyEvent) => {
  let className = 'event-style';

  if (event.Event_Type === 'holiday') {
    className = 'event-holiday';
  } else if (event.Event_Type === 'company') {
    className = 'event-non-holiday';
  } else if (event.Event_Type === 'birthday') {
    className = 'event-birthday';
  } else if (event.Event_Type === 'anniversary') {
    className = 'event-anniversary';
  }

  return {
    className,
  };
};
