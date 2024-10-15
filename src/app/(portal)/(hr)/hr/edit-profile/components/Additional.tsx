import { EmployeeListRowActions } from '@/components/data-table/actions/employee-list.actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const data = [
  {
    type: 'Education',
    document: 'Diploma.pdf',
    documentType: 'pdf',
    documentImage: 'https://github.com/shadcn.png',
  },
  {
    type: 'Work Experience',
    document: 'Offer_Letter.pdf',
    documentType: 'pdf',
    documentImage: 'https://github.com/shadcn.png',
  },
];

export function Additional() {
  return (
    <Card className="border-none p-6 shadow-none sm:w-[300px] md:w-[31.25rem] xl:w-[860px]">
      <div>
        <div className="mb-4 flex justify-between">
          <CardHeader className="mb-4 flex items-center justify-between p-0">
            <CardTitle className="flex-1 text-right">
              Additional Documents
            </CardTitle>
          </CardHeader>
        </div>

        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={item.documentImage}
                        alt={item.document}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{item.document}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.documentType}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="flex items-center justify-end">
                  <EmployeeListRowActions row={{ original: item }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </Card>
  );
}
