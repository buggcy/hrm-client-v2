import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolbarProps, View } from 'react-big-calendar';

import { Button } from '@/components/ui/button';

import { MyEvent } from '@/libs/validations/employee';
import { cn } from '@/utils';

const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({
  date,
  onNavigate,
  onView,
  view,
}) => {
  return (
    <div className={cn('rbc-toolbar')}>
      <div className="flex space-x-3">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
            style={{
              color: 'hsl(var(--forground))',
              borderTop: '1px solid hsl(var(--border))',
              borderLeft: '1px solid hsl(var(--border))',
              borderBottom: '1px solid hsl(var(--border))',
              borderRight: 'none',
              borderRadius: ' 5px 0 0 5px ',
              padding: '4px',
              fontSize: '12px',
              height: '25px',
            }}
            className="text-foreground dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            style={{
              color: 'hsl(var(--forground))',
              borderLeft: 'none',
              borderTop: '1px solid hsl(var(--border))',
              borderRight: '1px solid hsl(var(--border))',
              borderBottom: '1px solid hsl(var(--border))',
              borderRadius: ' 0 4px 4px 0 ',
              padding: '4px',
              fontSize: '12px',
              height: '25px',
              border: '1px solid hsl(var(--border))',
            }}
            className="text-foreground dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            height: '25px',
            color: 'hsl(var(--forground))',
            border: '1px solid hsl(var(--border))',
          }}
          className="text-foreground dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Today
        </Button>
      </div>
      <span className={cn('rbc-toolbar-label text-lg')}>
        {format(date, 'MMMM yyyy')}
      </span>

      <div className={cn('rbc-btn-group')}>
        {(['month', 'week', 'day', 'agenda'] as View[]).map(name => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            onClick={() => onView(name)}
            // className={cn(view === name ? 'rbc-active' : '')}
            style={{
              fontSize: '12px',
              padding: '4px 12px',
              height: '25px',
              border: '1px solid hsl(var(--border))',

              backgroundColor: view === name ? '#e6e6e670' : '',
              color:
                view === name
                  ? 'hsl(var(--forground))'
                  : 'hsl(var(--muted-foreground))',
            }}
            className={`${cn(view === name ? 'rbc-active' : '')} text-foreground dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;
