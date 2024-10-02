import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Dropzone from './uploadFile';

const data = [
  {
    type: 'Education',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    institute: 'University of Example',
    position: "Bachelor's Degree",
    referenceNo: 'REF001',
    document: 'Diploma.pdf',
  },
  {
    type: 'Work Experience',
    startDate: '2021-06-01',
    endDate: '2023-06-01',
    institute: 'Company XYZ',
    position: 'Software Developer',
    referenceNo: 'REF002',
    document: 'Offer_Letter.pdf',
  },
];

export function ExperienceTable() {
  return (
    <Card className="border-none p-6 shadow-none">
      <div>
        <div className="mb-4 flex justify-between">
          <CardHeader className="mb-4 flex items-center justify-between p-0">
            <CardTitle className="flex-1 text-right">
              Education & Experience
            </CardTitle>
          </CardHeader>
          <Button>Add More</Button>
        </div>

        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Institute/Company</TableHead>
              <TableHead>Position/Degree</TableHead>
              <TableHead>Reference No</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.startDate}</TableCell>
                <TableCell>{item.endDate}</TableCell>
                <TableCell>{item.institute}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.referenceNo}</TableCell>
                <TableCell> View Document</TableCell>
                <TableCell>
                  <Button
                    className="px-3 py-2 text-xs"
                    size="sm"
                    variant="primary-inverted"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Records</TableCell>
              <TableCell className="text-right">{data.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Dropzone />
        <div className="flex justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </Card>
  );
}
