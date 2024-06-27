import React from 'react';
import ReactGA from 'react-ga4';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPage from './ContentPage';  // Adjust the import path as necessary
import LevelsPage from './LevelsPage';

const ToggleSwitch = ({ onLevelsClick, onContentClick }) => {
  const handleSelectLevels = () => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });
    onLevelsClick();
  };

  const handleSelectContent = () => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });
    onContentClick();
  };

  return (
    <Tabs defaultValue="levels" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="levels" onInteract={handleSelectLevels}>Levels</TabsTrigger>
        <TabsTrigger value="content" onInteract={handleSelectContent}>Content</TabsTrigger>
      </TabsList>
      <TabsContent value="levels">
        <LevelsPage />  
      </TabsContent>
      <TabsContent value="content">
        <ContentPage />  
      </TabsContent>
    </Tabs>
  );
};

export default ToggleSwitch;
