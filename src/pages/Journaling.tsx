import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { TradeCalculationResults } from '../utils/tradeCalculations';
import EnhancedJournalingForm from '../components/EnhancedJournalingForm';
import RichSummaryPanel from '../components/RichSummaryPanel';

const Journaling = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [calculations, setCalculations] = useState<TradeCalculationResults | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // Session tag options
  const sessionTags = [
    { id: 'asia', label: 'Asia', color: 'bg-info' },
    { id: 'london', label: 'London', color: 'bg-success' },
    { id: 'ny', label: 'New York', color: 'bg-warning' },
    { id: 'tokyo', label: 'Tokyo', color: 'bg-purple' }
  ];

  // Focus management for accessibility
  useEffect(() => {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      titleElement.focus();
    }
  }, []);

  const handleCalculationsChange = (newCalculations: TradeCalculationResults) => {
    setCalculations(newCalculations);
    setHasUnsavedChanges(true);
  };

  const handleFormDataChange = (newFormData: any) => {
    setFormData(newFormData);
    setHasUnsavedChanges(true);
  };

  const toggleSessionTag = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveJournal = () => {
    const updatedData = {
      formData,
      sessionTags: selectedSessions,
      calculations
    };
    
    saveToLocalStorage('trade-journal-data', updatedData);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Journal Saved",
      description: "Your trading journal has been saved successfully.",
    });
  };

  const handleBackToChecklist = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/');
  };

  // Get today's date in user's locale
  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="font-titillium text-tit-4xl text-foreground mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-4"
            tabIndex={-1}
          >
            Enhanced Trading Journal
          </h1>
          <p className="font-open-sans text-t1 text-muted-foreground">{todayDate}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Enhanced Form */}
          <div className="space-y-6">
            {/* Session Tags */}
            <div className="mb-6">
              <h3 className="font-open-sans text-t3 mb-4 flex items-center gap-2">
                🌍 Session Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {sessionTags.map(session => (
                  <Badge
                    key={session.id}
                    variant={selectedSessions.includes(session.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-8 px-4 py-2 font-open-sans text-t-1 ${
                      selectedSessions.includes(session.id) 
                        ? `${session.color} text-white shadow-colored` 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleSessionTag(session.id)}
                  >
                    {session.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Enhanced Journaling Form */}
            <EnhancedJournalingForm
              onCalculationsChange={handleCalculationsChange}
              onFormDataChange={handleFormDataChange}
            />
          </div>

          {/* Right Column - Rich Summary */}
          <div className="space-y-6">
            {formData && calculations && (
              <RichSummaryPanel
                side={formData.side}
                contracts={parseInt(formData.contracts) || 1}
                instrument={formData.instrumentSymbol}
                sessionTags={selectedSessions.map(id => 
                  sessionTags.find(tag => tag.id === id)?.label || id
                )}
                calculations={calculations}
                entry={parseFloat(formData.entry) || 0}
                exit={formData.exit ? parseFloat(formData.exit) : undefined}
                stopLoss={formData.stopLoss ? parseFloat(formData.stopLoss) : undefined}
                profitTarget={formData.profitTarget ? parseFloat(formData.profitTarget) : undefined}
                startTime={formData.startTime}
                endTime={formData.endTime}
                tradeRating={formData.tradeRating || 0}
              />
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border shadow-floating z-50">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <>
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="font-open-sans text-t-1 text-muted-foreground">Unsaved changes</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToChecklist}
                  className="rounded-8 shadow-menu hover:shadow-floating font-open-sans text-t0"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Checklist
                </Button>
                
                <Button
                  onClick={handleSaveJournal}
                  className="bg-gradient-primary hover:bg-gradient-accent text-primary-foreground rounded-8 shadow-menu hover:shadow-floating px-6 font-open-sans text-t0 font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Journal
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom padding to account for sticky footer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Journaling;