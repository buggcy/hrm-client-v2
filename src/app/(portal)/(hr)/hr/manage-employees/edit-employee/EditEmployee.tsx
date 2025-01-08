import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeDataQuery } from '@/hooks/employeeEdit/useEmployeeEdit.hook';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

import AssignPerks from './components/assign-perks/AssignPerks';
import EditDesignation from './components/edit-designation/EditDesignation';
import ManageLeaves from './components/manage-leaves/ManageLeaves';
import ProfileEdit from './components/profile-edit/ProfileEdit';
import SalaryIncrement from './components/salary-increment/SalaryIncrement';

const EditEmployee = () => {
  const searchParams = useSearchParams();
  const userIdFromParams: string | undefined =
    typeof window !== 'undefined'
      ? searchParams.get('employee') ?? undefined
      : undefined;

  const { refetch, data: employeeData } = useEmployeeDataQuery({
    employeeId: userIdFromParams,
  });
  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { refetchEditEmployeeData, setRefetchEditEmployeeData } =
    editEmployeeStore;

  useEffect(() => {
    if (refetchEditEmployeeData) {
      void refetch();
    }
    setRefetchEditEmployeeData(false);
  }, [refetch, setRefetchEditEmployeeData, refetchEditEmployeeData]);
  return (
    <Tabs
      className="flex flex-col gap-4 lg:flex-row"
      defaultValue="edit-profile"
    >
      <TabsList className="flex h-full flex-col justify-start bg-transparent p-4 lg:w-fit lg:min-w-[205px] xl:min-w-[280px]">
        <TabsTrigger
          value="edit-profile"
          className="flex w-full justify-center p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 lg:justify-start"
        >
          Edit Profile
        </TabsTrigger>
        <TabsTrigger
          value="edit-salary"
          className="flex w-full justify-center p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 lg:justify-start"
        >
          Salary Increments
        </TabsTrigger>
        <TabsTrigger
          value="edit-designation"
          className="flex w-full justify-center p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 lg:justify-start"
        >
          Edit Designation
        </TabsTrigger>
        <TabsTrigger
          value="edit-perks"
          className="flex w-full justify-center p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 lg:justify-start"
        >
          Assign Perks
        </TabsTrigger>
        <TabsTrigger
          value="edit-leaves"
          className="flex w-full justify-center p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 lg:justify-start"
        >
          Manage Leaves
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="edit-profile"
        className="mt-0 flex-1 rounded-lg bg-background p-4"
      >
        <ProfileEdit data={employeeData} />
      </TabsContent>
      <TabsContent
        value="edit-salary"
        className="mt-0 flex-1 rounded-lg bg-background p-4"
      >
        <SalaryIncrement employeeId={userIdFromParams} />
      </TabsContent>
      <TabsContent
        value="edit-designation"
        className="mt-0 flex-1 rounded-lg bg-background p-4"
      >
        <EditDesignation
          employeeId={userIdFromParams || ''}
          designationData={employeeData?.output?.employee?.position}
          refetchDesignationList={() => refetch()}
        />
      </TabsContent>
      <TabsContent
        value="edit-perks"
        className="mt-0 flex-1 overflow-y-auto rounded-lg bg-background p-4"
      >
        <AssignPerks empId={userIdFromParams} />
      </TabsContent>
      <TabsContent
        value="edit-leaves"
        className="mt-0 flex-1 rounded-lg bg-background p-4"
      >
        <ManageLeaves empId={userIdFromParams} />
      </TabsContent>
    </Tabs>
  );
};

export default EditEmployee;
