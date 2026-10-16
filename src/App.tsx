/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, AppTab } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { LiveHazeMonitor } from './components/LiveHazeMonitor';
import { ItinerarySubstitutionEngine } from './components/ItinerarySubstitutionEngine';
import { HazeGuideHub, GuideSubSection } from './components/HazeGuideHub';
import { HazeSimulatorModal } from './components/HazeSimulatorModal';
import { HazeAlertBanner } from './components/HazeAlertBanner';
import { Footer } from './components/Footer';
import { fetchLiveSingaporePsi } from './services/psiService';
import { RegionalPsiData, SingaporeRegion } from './types/haze';
import { FALLBACK_PSI_DATA } from './data/hazeData';
import { LocationMatchResult } from './utils/locationResolver';

function MainAppContent() {
  const { effectiveTheme, isMobile } = useApp();
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [guideSubSection, setGuideSubSection] = useState<GuideSubSection>('education');
  const [selectedRegion, setSelectedRegion] = useState<SingaporeRegion>('central');
  const [userLocation, setUserLocation] = useState<LocationMatchResult | null>({
    query: 'Marina Bay Sands',
    matchedName: 'Marina Bay & Bayfront',
    region: 'central',
    regionDisplayName: 'Central Singapore',
    note: 'Popular Tourist Landmark',
  });
  const [regionsData, setRegionsData] = useState<Record<SingaporeRegion, RegionalPsiData>>(
    FALLBACK_PSI_DATA as Record<SingaporeRegion, RegionalPsiData>
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatedPsi, setSimulatedPsi] = useState<number | null>(null);
  const [alertThresholdEnabled, setAlertThresholdEnabled] = useState(true);

  const loadPsiData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLiveSingaporePsi();
      setRegionsData(res.data);
      setIsLiveFeed(res.isLive);
    } catch (err) {
      console.error('Error fetching live PSI:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPsiData();
    // Refresh every 5 minutes
    const interval = setInterval(loadPsiData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute active region data, incorporating simulator override if active
  const baseRegionData = regionsData[selectedRegion] || regionsData['national'];
  const effectivePsi = simulatedPsi !== null ? simulatedPsi : baseRegionData.psi24Hourly;

  const determineStatus = (psi: number): RegionalPsiData['status'] => {
    if (psi <= 50) return 'Good';
    if (psi <= 100) return 'Moderate';
    if (psi <= 200) return 'Unhealthy';
    if (psi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const effectiveRegionData: RegionalPsiData = {
    ...baseRegionData,
    psi24Hourly: effectivePsi,
    status: determineStatus(effectivePsi),
    description:
      simulatedPsi !== null
        ? `[SIMULATED SCENARIO] Air quality is in the ${determineStatus(effectivePsi)} band (PSI ${effectivePsi}). Testing tourist advisory responses.`
        : baseRegionData.description,
  };

  const handleApplySimulation = (psi: number | null) => {
    setSimulatedPsi(psi);
  };

  const handleNavigateToGuideSection = (section: GuideSubSection) => {
    setGuideSubSection(section);
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Advisory Banner (Active when PSI > 100) */}
      <HazeAlertBanner
        psi={effectivePsi}
        status={effectiveRegionData.status}
        onNavigateToItinerary={() => {
          setActiveTab('itinerary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToSupplies={() => handleNavigateToGuideSection('supplies')}
      />

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSimulator={() => setSimulatorOpen(true)}
        isSimulating={simulatedPsi !== null}
        simulatedPsi={simulatedPsi ?? effectivePsi}
      />

      {/* Main Viewport Container with dynamic mobile scaling */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-8 pb-24 md:pb-8 mobile-scale-container">
        {activeTab === 'overview' && (
          <HomeOverview
            currentRegionData={effectiveRegionData}
            allRegionsData={regionsData}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            userLocation={userLocation}
            onSetUserLocation={setUserLocation}
          />
        )}

        {activeTab === 'live' && (
          <LiveHazeMonitor
            currentRegionData={effectiveRegionData}
            allRegionsData={regionsData}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onRefresh={loadPsiData}
            isRefreshing={isRefreshing}
            onNavigateToItinerary={() => {
              setActiveTab('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToSupplies={() => handleNavigateToGuideSection('supplies')}
            onNavigateToEducation={() => handleNavigateToGuideSection('education')}
            alertThresholdEnabled={alertThresholdEnabled}
            onToggleAlertThreshold={() => setAlertThresholdEnabled(!alertThresholdEnabled)}
            userLocation={userLocation}
            onSetUserLocation={setUserLocation}
          />
        )}

        {activeTab === 'itinerary' && <ItinerarySubstitutionEngine />}

        {activeTab === 'guide' && (
          <HazeGuideHub initialSection={guideSubSection} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectGuideSection={handleNavigateToGuideSection}
      />

      {/* Interactive Scenario Simulator Modal */}
      <HazeSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        isSimulating={simulatedPsi !== null}
        simulatedPsi={simulatedPsi ?? 75}
        onApplySimulation={handleApplySimulation}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
