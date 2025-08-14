import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { JournalData, defaultJournalData } from '../utils/journalGenerator';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const Journaling = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<JournalData>(() =>
    loadFromLocalStorage('journal-form-data', defaultJournalData)
  );

  // Session tag options
  const sessionTags = [
    { id: 'asia', label: 'Asia', color: 'bg-info' },
    { id: 'london', label: 'London', color: 'bg-success' },
    { id: 'ny', label: 'New York', color: 'bg-warning' },
    { id: 'tokyo', label: 'Tokyo', color: 'bg-purple' }
  ];

  // Setup type options
  const setupTypes = [
    'Trendline Break',
    'Retest',
    'Bounce',
    'Breakout',
    'Pullback',
    'Support/Resistance',
    'Counter Trend'
  ];

  // Emotional/Mental state chips
  const mentalStates = [
    { id: 'calm', label: 'Calm', color: 'bg-success' },
    { id: 'fomo', label: 'FOMO', color: 'bg-destructive' },
    { id: 'patience', label: 'Patience', color: 'bg-emerald' },
    { id: 'discipline', label: 'Discipline', color: 'bg-primary' },
    { id: 'confident', label: 'Confident', color: 'bg-info' },
    { id: 'uncertain', label: 'Uncertain', color: 'bg-warning' },
    { id: 'rushed', label: 'Rushed', color: 'bg-destructive' },
    { id: 'focused', label: 'Focused', color: 'bg-purple' }
  ];

  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedMentalStates, setSelectedMentalStates] = useState<string[]>([]);

  // Focus management for accessibility
  useEffect(() => {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      titleElement.focus();
    }
  }, []);

  // Track unsaved changes
  const handleInputChange = (field: keyof JournalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const toggleMentalState = (stateId: string) => {
    setSelectedMentalStates(prev => 
      prev.includes(stateId)
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveJournal = () => {
    // Update form data with selected tags
    const updatedData = {
      ...formData,
      session: selectedSessions.join(', '),
      tags: [...formData.tags, ...selectedMentalStates.map(id => 
        mentalStates.find(state => state.id === id)?.label || id
      )]
    };
    
    saveToLocalStorage('journal-form-data', updatedData);
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="font-titillium text-tit-4xl text-foreground mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-4"
            tabIndex={-1}
          >
            Daily Journal
          </h1>
          <p className="font-open-sans text-t1 text-muted-foreground">{todayDate}</p>
        </div>

        <div className="space-y-8">
          {/* Session Tags */}
          <Card className="glass-effect hover-float rounded-16 shadow-menu">
            <CardHeader>
              <CardTitle className="font-open-sans text-t3 flex items-center gap-2">
                🌍 Session Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Setup Type */}
          <Card className="glass-effect hover-float rounded-16 shadow-menu">
            <CardHeader>
              <CardTitle className="font-open-sans text-t3 flex items-center gap-2">
                📊 Setup Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.setupType}
                onValueChange={(value) => handleInputChange('setupType', value)}
              >
                <SelectTrigger className="w-full rounded-8 shadow-toggle-disable focus:shadow-toggle-active">
                  <SelectValue placeholder="Select setup type" />
                </SelectTrigger>
                <SelectContent>
                  {setupTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Trade Details */}
          <Card className="glass-effect hover-float rounded-16 shadow-menu">
            <CardHeader>
              <CardTitle className="font-open-sans text-t3 flex items-center gap-2">
                📈 Trade Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="side" className="font-open-sans text-t-1 font-medium">Side</Label>
                  <Select
                    value={formData.side}
                    onValueChange={(value: 'LONG' | 'SHORT') => handleInputChange('side', value)}
                  >
                    <SelectTrigger id="side" className="rounded-8 shadow-toggle-disable focus:shadow-toggle-active">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LONG">LONG</SelectItem>
                      <SelectItem value="SHORT">SHORT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="entry" className="font-open-sans text-t-1 font-medium">Entry</Label>
                  <Input
                    id="entry"
                    type="text"
                    value={formData.entry}
                    onChange={(e) => handleInputChange('entry', e.target.value)}
                    className="rounded-8 shadow-toggle-disable focus:shadow-toggle-active"
                    placeholder="1.2750"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tp" className="font-open-sans text-t-1 font-medium">Take Profit</Label>
                  <Input
                    id="tp"
                    type="text"
                    value={formData.takeProfit1}
                    onChange={(e) => handleInputChange('takeProfit1', e.target.value)}
                    className="rounded-8 shadow-toggle-disable focus:shadow-toggle-active"
                    placeholder="1.2850"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sl" className="font-open-sans text-t-1 font-medium">Stop Loss</Label>
                  <Input
                    id="sl"
                    type="text"
                    value={formData.stopLoss}
                    onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                    className="rounded-8 shadow-toggle-disable focus:shadow-toggle-active"
                    placeholder="1.2700"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contracts" className="font-open-sans text-t-1 font-medium">Contracts</Label>
                  <Input
                    id="contracts"
                    type="text"
                    value={formData.contracts}
                    onChange={(e) => handleInputChange('contracts', e.target.value)}
                    className="rounded-8 shadow-toggle-disable focus:shadow-toggle-active"
                    placeholder="0.5 lots"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Notes */}
          <Card className="glass-effect hover-float rounded-16 shadow-menu">
            <CardHeader>
              <CardTitle className="font-open-sans text-t3 flex items-center gap-2">
                📝 Execution Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.bullets.join('\n')}
                onChange={(e) => handleInputChange('bullets', e.target.value.split('\n'))}
                placeholder="What happened? What did I do well? What to improve?

• Waited for proper confirmation
• Risk management followed
• Could have been more patient on entry"
                className="min-h-32 rounded-8 shadow-toggle-disable focus:shadow-toggle-active"
              />
            </CardContent>
          </Card>

          {/* Emotional/Mental Notes */}
          <Card className="glass-effect hover-float rounded-16 shadow-menu">
            <CardHeader>
              <CardTitle className="font-open-sans text-t3 flex items-center gap-2">
                🧠 Emotional & Mental State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {mentalStates.map(state => (
                  <Badge
                    key={state.id}
                    variant={selectedMentalStates.includes(state.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-8 px-4 py-2 font-open-sans text-t-1 ${
                      selectedMentalStates.includes(state.id) 
                        ? `${state.color} text-white shadow-colored` 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleMentalState(state.id)}
                  >
                    {state.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
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