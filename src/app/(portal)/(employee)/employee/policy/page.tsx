'use client';
import { FunctionComponent, Suspense, useEffect, useState } from 'react';

import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCategoryList } from '@/services/employee/policy.service';

import PolicyTable from './component/PolicyTable.component';

interface EmployeePolicyProps {}

const Policypage: FunctionComponent<EmployeePolicyProps> = () => {
  const [categories, setCategories] = useState<string[] | undefined>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch categories and set the first category as default
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoryList();
        console.log(fetchedCategories);
        setCategories(fetchedCategories?.categories);
        if (fetchedCategories?.categories) {
          if (fetchedCategories?.categories.length > 0) {
            setSelectedCategory(fetchedCategories?.categories[0]); // Set first category as default
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    void fetchCategories();
  }, []);

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Policies">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-6 px-2">
        <Header subheading="Your Rights, Responsibilities, and Company Guidelines"></Header>
        <div className="w-full">
          {categories && categories.length > 0 ? (
            <Tabs
              value={selectedCategory}
              className="w-full"
              onValueChange={value => setSelectedCategory(value)}
            >
              <div className="flex flex-col items-start md:flex-row md:space-x-6">
                <TabsList className="mb-4 flex size-full flex-col space-x-2 bg-transparent p-0 md:mb-0 md:w-1/4 md:flex-col md:space-x-0 md:space-y-2">
                  {categories.map(category => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                    >
                      <span>{category}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="w-full md:w-3/4">
                  {categories.map(category => (
                    <TabsContent
                      key={category}
                      value={category}
                      className="mt-0"
                    >
                      <PolicyTable category={category} />
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          ) : (
            <Tabs value={''} className="w-full">
              <div className="flex flex-col items-start md:flex-row md:space-x-6">
                <TabsList className="mb-4 mt-7 flex w-full flex-row space-x-2 bg-transparent p-0 md:mb-0 md:w-1/4 md:flex-col md:space-x-0 md:space-y-2">
                  <TabsTrigger
                    value={''}
                    className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  >
                    <span>All Categories</span>
                  </TabsTrigger>
                </TabsList>
                <div className="w-full md:w-3/4">
                  <TabsContent value={''} className="mt-0">
                    <Suspense fallback={<div>Loading....</div>}>
                      <PolicyTable category={''} />
                    </Suspense>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          )}
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default Policypage;
