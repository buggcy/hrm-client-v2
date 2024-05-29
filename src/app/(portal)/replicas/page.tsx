'use client';
import Link from 'next/link';

import { SquareArrowOutUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useReplicasQuery } from '@/hooks';
// DUMMY CONTENT, GENERATED FOR TEST PURPOSES / DO NOT SPEND YOUR TIME FOR REVIEW
// WILL BE REMOVED
export default function ReplicasPage() {
  const { data: replicas, isFetching } = useReplicasQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Replicas</CardTitle>
        <CardDescription>Bla Bla Bla</CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div>Loader...</div>
        ) : (
          <>
            {replicas ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Replica ID</TableHead>
                    <TableHead>Replica Name</TableHead>
                    <TableHead>Replica Status</TableHead>
                    <TableHead>Replica Generate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {replicas.data.map(({ replica_id, replica_name, status }) => (
                    <TableRow key={replica_id}>
                      <TableCell>{replica_id}</TableCell>
                      <TableCell>{replica_name}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>
                        <Button asChild variant="link">
                          <Link href={`/videos/create?replica=${replica_id}`}>
                            Generate video{' '}
                            <SquareArrowOutUpRight className="ml-2 size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>Empty</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
