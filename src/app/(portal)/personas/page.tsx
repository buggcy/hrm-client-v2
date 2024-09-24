'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Loader } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { usePersonasInfinityQuery } from '@/hooks/usePersonas';

import { GetPersonaByIdInput } from './components/GetPersonaByIdInput';
import {
  PersonaDetailsSheet,
  usePersonaDetailsSheet,
} from './components/PersonaDetailsSheet';
import { PersonasBlock } from './components/PersonasBlock';
import { SinglePersonasBlock } from './components/SinglePersonasBlock';
import { PersonaBanner } from '../replicas/PersonaBanner';

import { IPersona, PersonaType } from '@/types';

const LIMIT = 10;

export default function PersonasPage() {
  const { personaId: selectedPersona, onOpenChange } = usePersonaDetailsSheet();
  const [searchResult, setSearchResult] = useState<IPersona | null>(null);

  const {
    data: stockPersonas,
    isLoading: stockPersonasIsLoading,
    isRefetching: stockPersonasIsRefetching,
    isPlaceholderData: stockPersonasIsPlaceholderData,
    fetchNextPage: fetchNextPageStock,
    hasNextPage: hasNextPageStock,
    isFetchingNextPage: isFetchingNextPageStock,
  } = usePersonasInfinityQuery({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    queryParams: {
      limit: LIMIT,
      persona_type: PersonaType.STUDIO,
    },
  });

  const {
    data: personalPersonas,
    isLoading: personalPersonasIsLoading,
    isRefetching,
    isPlaceholderData,
    fetchNextPage: fetchNextPagePersonal,
    hasNextPage: hasNextPagePersonal,
    isFetchingNextPage: isFetchingNextPagePersonal,
  } = usePersonasInfinityQuery({
    refetchInterval() {
      return 5 * 60 * 1000;
    },
    refetchOnWindowFocus: true,
    queryParams: {
      limit: LIMIT,
      persona_type: PersonaType.PERSONAL,
    },
  });

  const handleLoadMoreStock = () => {
    void fetchNextPageStock();
  };

  const handleLoadMorePersonal = () => {
    void fetchNextPagePersonal();
  };
  const stockPersonasData = useMemo(() => {
    return stockPersonas?.pages?.map(page => page.data).flat();
  }, [stockPersonas]);

  const personalPersonasData = useMemo(() => {
    return personalPersonas?.pages?.map(page => page.data).flat();
  }, [personalPersonas]);

  const totalStockPersonas = stockPersonas?.pages?.[0]?.total_count || 0;
  const totalPersonalPersonas = personalPersonas?.pages?.[0]?.total_count || 0;

  const backgroundRefetching =
    (!isPlaceholderData && isRefetching && !personalPersonasIsLoading) ||
    (!stockPersonasIsPlaceholderData &&
      stockPersonasIsRefetching &&
      !stockPersonasIsLoading);

  return (
    <Layout>
      <HighTrafficBanner />

      <LayoutHeader title="Persona Library">
        <CopyApiUrl type="GET" url="persona" className="hidden sm:flex" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="personaLibrary" />
          <Button asChild>
            <Link href="/personas/create">Create Persona</Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <PersonaBanner />
        <GetPersonaByIdInput setSearchResult={setSearchResult} />
        <Tabs defaultValue="all" className="relative w-full">
          {!searchResult && (
            <TabsList className="mb-6 border">
              <TabsTrigger value="all">All Personas</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="studio">Stock</TabsTrigger>
            </TabsList>
          )}
          {backgroundRefetching && (
            <div className="absolute right-2 top-2">
              <Loader className="size-6 animate-spin" />
            </div>
          )}

          {searchResult ? (
            <SinglePersonasBlock
              title="Persona"
              persona={searchResult}
              onOpenDetails={onOpenChange}
            />
          ) : (
            <div>
              <TabsContent value="all" tabIndex={-1}>
                <div className="space-y-10">
                  <PersonasBlock
                    title="Personal Personas"
                    personas={personalPersonasData}
                    isLoading={personalPersonasIsLoading}
                    isPersonalPersonas
                    onLoadMore={
                      hasNextPagePersonal ? handleLoadMorePersonal : undefined
                    }
                    isFetchingNextPage={isFetchingNextPagePersonal}
                    total={totalPersonalPersonas}
                    onOpenDetails={onOpenChange}
                  />
                  <PersonasBlock
                    title="Stock Personas"
                    personas={stockPersonasData}
                    isLoading={stockPersonasIsLoading}
                    onLoadMore={
                      hasNextPageStock ? handleLoadMoreStock : undefined
                    }
                    isFetchingNextPage={isFetchingNextPageStock}
                    total={totalStockPersonas}
                    onOpenDetails={onOpenChange}
                  />
                </div>
              </TabsContent>
              <TabsContent value="personal" tabIndex={-1}>
                <PersonasBlock
                  title="Personal Personas"
                  personas={personalPersonasData}
                  isLoading={personalPersonasIsLoading}
                  isPersonalPersonas
                  onLoadMore={
                    hasNextPagePersonal ? handleLoadMorePersonal : undefined
                  }
                  isFetchingNextPage={isFetchingNextPagePersonal}
                  total={totalPersonalPersonas}
                  onOpenDetails={onOpenChange}
                />
              </TabsContent>
              <TabsContent value="studio" tabIndex={-1}>
                <PersonasBlock
                  title="Stock Personas"
                  personas={stockPersonasData}
                  isLoading={stockPersonasIsLoading}
                  onLoadMore={
                    hasNextPageStock ? handleLoadMoreStock : undefined
                  }
                  isFetchingNextPage={isFetchingNextPageStock}
                  total={totalStockPersonas}
                  onOpenDetails={onOpenChange}
                />
              </TabsContent>
            </div>
          )}
        </Tabs>
        <PersonaDetailsSheet id={selectedPersona} onOpenChange={onOpenChange} />
      </LayoutWrapper>
    </Layout>
  );
}
